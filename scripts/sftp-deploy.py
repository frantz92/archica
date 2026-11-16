#!/usr/bin/env python3
"""Uploads out/ to the web host with the OpenSSH `sftp` client (key login, no shell needed).

Shared hosting often allows SFTP only (no commands on the server), which rules out rsync and any
password login. This script needs nothing but Python 3 and the `sftp` that ships with macOS and
Linux. It is called by scripts/deploy.sh (DEPLOY_PROTOCOL=sftp); the environment is documented there.

What it does: creates the directories, uploads every file of out/ (always; a content change can keep
the file size), then deletes remote files and directories that are no longer part of the site.
Server-managed folders (.well-known, cgi-bin, ...) are never touched.
"""

from __future__ import annotations

import os
import subprocess
import sys
import tempfile
from pathlib import Path

# Top-level entries on the server that belong to the hosting, not to the site.
KEEP = {
    ".well-known", "cgi-bin", ".ftpquota", ".htpasswd",
    # Default error pages of the hosting.
    "400.shtml", "401.shtml", "403.shtml", "404.shtml", "500.shtml", "503.shtml",
}  # fmt: skip
# Local files that are never uploaded.
SKIP = {".DS_Store"}


def env(name: str, default: str = "") -> str:
    return os.environ.get(name, default)


def fail(message: str) -> "None":
    print(f"error: {message}", file=sys.stderr)
    sys.exit(1)


def local_tree(root: Path) -> tuple[list[str], list[str]]:
    """Directories (parents first) and files of `root`, as POSIX paths relative to it."""
    directories: list[str] = []
    files: list[str] = []
    for path in sorted(root.rglob("*")):
        relative = path.relative_to(root).as_posix()
        if path.name in SKIP:
            continue
        (directories if path.is_dir() else files).append(relative)
    return directories, files


def parse_listing(output: str) -> tuple[list[str], list[str]]:
    """Names of directories and of other entries from `ls -la` output."""
    directories: list[str] = []
    others: list[str] = []
    for line in output.splitlines():
        line = line.rstrip()
        if not line or line.startswith(("sftp>", "total")):
            continue
        parts = line.split(None, 8)
        if len(parts) < 9 or parts[0][0] not in "-dl":
            continue
        # Newer OpenSSH clients print the listed path in front of each name; a name never has "/".
        name = parts[8].split(" -> ")[0].rstrip("/").rsplit("/", 1)[-1]
        if name in (".", ".."):
            continue
        (directories if parts[0][0] == "d" else others).append(name)
    return directories, others


class Sftp:
    def __init__(self, work: Path) -> None:
        host = env("DEPLOY_HOST")
        user = env("DEPLOY_USER")
        port = env("DEPLOY_PORT", "22")
        ssh_dir = work / ".ssh"
        ssh_dir.mkdir(mode=0o700, exist_ok=True)

        key = ssh_dir / "deploy_key"
        if env("DEPLOY_SSH_KEY"):
            key.write_text(env("DEPLOY_SSH_KEY").rstrip("\n") + "\n")
        elif env("DEPLOY_SSH_KEY_FILE"):
            key.write_bytes(Path(env("DEPLOY_SSH_KEY_FILE")).expanduser().read_bytes())
        else:
            fail("this host accepts SSH keys only: set DEPLOY_SSH_KEY or DEPLOY_SSH_KEY_FILE")
        key.chmod(0o600)

        known_hosts = ssh_dir / "known_hosts"
        if env("DEPLOY_KNOWN_HOSTS"):
            known_hosts.write_text(env("DEPLOY_KNOWN_HOSTS").rstrip("\n") + "\n")
            host_check = "StrictHostKeyChecking=yes"
        else:
            host_check = "StrictHostKeyChecking=accept-new"

        # One SSH connection shared by all sftp calls (a short socket path: the limit is ~100 chars).
        self.socket_dir = Path(tempfile.mkdtemp(prefix="acm-", dir="/tmp"))
        self.control = f"{self.socket_dir}/cm"
        common = [
            "-i", str(key),
            "-o", "IdentitiesOnly=yes", "-o", "BatchMode=yes", "-o", host_check,
            "-o", f"UserKnownHostsFile={known_hosts}",
            "-o", "ServerAliveInterval=15", "-o", "ServerAliveCountMax=4",
            "-o", "ConnectTimeout=20",
        ]  # fmt: skip
        self.target = f"{user}@{host}"
        self.port = port
        self.common = common

        # The master runs in the background with its streams detached, so it cannot block Python.
        log = self.socket_dir / "master.log"
        with open(log, "w") as log_file:
            started = subprocess.run(
                ["ssh", "-fN", "-M", "-S", self.control, "-p", port, *common, self.target],
                stdin=subprocess.DEVNULL, stdout=log_file, stderr=log_file,
            )  # fmt: skip
        if started.returncode != 0:
            sys.stderr.write(log.read_text())
            fail(f"cannot open the SSH connection (code {started.returncode})")

        self.command = [
            "sftp", "-q", "-b", "-", "-P", port, *common,
            "-o", "ControlMaster=no", "-o", f"ControlPath={self.control}",
            self.target,
        ]  # fmt: skip

    def run(self, lines: list[str]) -> str:
        result = subprocess.run(
            self.command,
            input="\n".join(lines) + "\n",
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            sys.stderr.write(result.stdout)
            sys.stderr.write(result.stderr)
            fail(f"sftp exited with code {result.returncode}")
        return result.stdout

    def close(self) -> None:
        subprocess.run(
            ["ssh", "-S", self.control, "-O", "exit", self.target],
            capture_output=True,
        )
        for entry in self.socket_dir.glob("*"):
            entry.unlink(missing_ok=True)
        self.socket_dir.rmdir()


def remote_tree(sftp: Sftp, base: str) -> tuple[set[str], set[str]]:
    """Directories and files below `base` (relative POSIX paths), found directory by directory."""
    directories: set[str] = set()
    files: set[str] = set()
    pending = [""]
    while pending:
        relative = pending.pop()
        path = f"{base}/{relative}" if relative else base
        found_dirs, found_files = parse_listing(sftp.run([f'ls -la "{path}"']))
        for name in found_dirs:
            child = f"{relative}/{name}" if relative else name
            if not relative and name in KEEP:
                continue
            directories.add(child)
            pending.append(child)
        for name in found_files:
            child = f"{relative}/{name}" if relative else name
            if not relative and name in KEEP:
                continue
            files.add(child)
    return directories, files


def main() -> None:
    for name in ("DEPLOY_HOST", "DEPLOY_USER", "DEPLOY_PATH"):
        if not env(name):
            fail(f"{name} is not set")
    base = env("DEPLOY_PATH").rstrip("/")
    dry_run = env("DEPLOY_DRY_RUN") == "1"
    root = Path("out")
    if not (root / ".htaccess").is_file():
        fail("out/.htaccess is missing: run npm run build first")

    directories, files = local_tree(root)

    with tempfile.TemporaryDirectory(prefix="deploy-") as work_name:
        sftp = Sftp(Path(work_name))
        try:
            print("Reading the server ...")
            remote_dirs, remote_files = remote_tree(sftp, base)

            stale_files = sorted(remote_files - set(files))
            stale_dirs = sorted(
                (d for d in remote_dirs if d not in set(directories)),
                key=lambda d: d.count("/"),
                reverse=True,
            )
            print(f"Upload: {len(files)} file(s) in {len(directories)} folder(s).")
            print(f"Remove from the server: {len(stale_files)} file(s), {len(stale_dirs)} folder(s).")
            for path in stale_files:
                print(f"  - {path}")
            for path in stale_dirs:
                print(f"  - {path}/")
            if dry_run:
                for path in files:
                    print(f"  + {path}")
                print("Deploy finished (dry run: nothing was uploaded).")
                return

            batch = [f'-mkdir "{base}"']
            batch += [f'-mkdir "{base}/{d}"' for d in directories]
            batch += [f'put "{root / f}" "{base}/{f}"' for f in files]
            sftp.run(batch)
            print("Upload done.")

            removal = [f'rm "{base}/{f}"' for f in stale_files]
            removal += [f'rmdir "{base}/{d}"' for d in stale_dirs]
            if removal:
                sftp.run(removal)
                print("Old files removed.")
            print("Deploy finished.")
        finally:
            sftp.close()


if __name__ == "__main__":
    main()
