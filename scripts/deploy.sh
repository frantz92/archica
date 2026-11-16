#!/usr/bin/env bash
# Uploads out/ to the web host (SeoHost).
# Used by .github/workflows/deploy.yml; can be run locally with the same environment variables:
#   DEPLOY_HOST, DEPLOY_USER, DEPLOY_PATH         (required)
#   DEPLOY_PROTOCOL = sftp (default: OpenSSH sftp + Python, key login only, no lftp needed)
#                   | ftps | ftp (lftp, password login)
#   DEPLOY_PORT, DEPLOY_DRY_RUN=1 (lists, uploads nothing)
# For sftp:  DEPLOY_SSH_KEY (private key text) or DEPLOY_SSH_KEY_FILE (path), optional
#            DEPLOY_KNOWN_HOSTS (pins the server key).
# For ftps/ftp: DEPLOY_PASSWORD (no spaces); DEPLOY_PARALLEL (default 1), DEPLOY_DEBUG=1.
set -euo pipefail

: "${DEPLOY_HOST:?DEPLOY_HOST is not set}"
: "${DEPLOY_USER:?DEPLOY_USER is not set}"
: "${DEPLOY_PATH:?DEPLOY_PATH is not set}"
protocol="$(printf '%s' "${DEPLOY_PROTOCOL:-sftp}" | tr '[:upper:]' '[:lower:]')"

# The upload removes everything in the target that is not in out/. Refuse paths that would
# reach beyond the web root of the site.
case "$DEPLOY_PATH" in
  "" | "/" | "." | "./" | "~" | "~/" | ".." )
    echo "Refusing to deploy to '$DEPLOY_PATH': set DEPLOY_PATH to the site's own directory." >&2
    exit 1 ;;
esac
[ -f out/index.html ] || [ -f out/404.html ] || { echo "out/ is missing: run npm run build." >&2; exit 1; }
[ -f out/.htaccess ] || { echo "out/.htaccess is missing: the build did not finish." >&2; exit 1; }

if [ "$protocol" = "sftp" ]; then
  command -v python3 >/dev/null || { echo "python3 is not installed." >&2; exit 1; }
  command -v sftp >/dev/null || { echo "The OpenSSH sftp client is not installed." >&2; exit 1; }
  exec python3 "$(dirname "$0")/sftp-deploy.py"
fi

command -v lftp >/dev/null || { echo "lftp is not installed (needed for ftps/ftp)." >&2; exit 1; }

# Credentials live in a throw-away HOME, so a developer's own ~/.netrc is never overwritten.
work="$(mktemp -d)"
trap 'rm -r -f "$work"' EXIT
export HOME="$work"

settings="set cmd:fail-exit yes; set net:max-retries 5; set net:timeout 30; set net:reconnect-interval-base 10; set net:connection-limit 2;"
[ "${DEPLOY_DEBUG:-}" = "1" ] && settings="$settings debug -o /dev/stderr 5;"
port_part=""
[ -n "${DEPLOY_PORT:-}" ] && port_part=":${DEPLOY_PORT}"

case "$protocol" in
  ftps)
    settings="$settings set ftp:ssl-force true; set ftp:ssl-protect-data true; set ssl:verify-certificate yes;"
    url="ftp://${DEPLOY_HOST}${port_part}" ;;
  ftp)
    echo "Warning: plain FTP sends the password unencrypted." >&2
    url="ftp://${DEPLOY_HOST}${port_part}" ;;
  *)
    echo "Unknown DEPLOY_PROTOCOL '$protocol' (use sftp, ftps or ftp)." >&2
    exit 1 ;;
esac

dry_run=""
[ "${DEPLOY_DRY_RUN:-}" = "1" ] && dry_run="--dry-run"

# The credentials go to ~/.netrc (read by lftp), so they never appear on a command line.
umask 077
printf 'machine %s login %s password %s\n' "$DEPLOY_HOST" "$DEPLOY_USER" "${DEPLOY_PASSWORD:?DEPLOY_PASSWORD is not set}" > ~/.netrc

# Server-managed folders are left alone.
lftp -c "$settings
open $url
mirror --reverse --delete --verbose --no-perms --parallel=${DEPLOY_PARALLEL:-1} $dry_run \
  --exclude-glob .well-known/ --exclude-glob cgi-bin/ --exclude-glob .ftpquota \
  out/ \"$DEPLOY_PATH\"
bye"
echo "Deploy finished${dry_run:+ (dry run: nothing was uploaded)}."
