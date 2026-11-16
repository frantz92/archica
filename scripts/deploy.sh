#!/usr/bin/env bash
# Uploads out/ to the web host (SeoHost) with lftp over SFTP, FTPS or FTP.
# Used by .github/workflows/deploy.yml; can be run locally with the same environment variables:
#   DEPLOY_HOST, DEPLOY_USER, DEPLOY_PATH         (required)
#   DEPLOY_PASSWORD (no spaces) or DEPLOY_SSH_KEY (one of them)
#   DEPLOY_PROTOCOL = sftp (default) | ftps | ftp
#   DEPLOY_PORT, DEPLOY_KNOWN_HOSTS (pins the SFTP host key), DEPLOY_DRY_RUN=1 (lists, uploads nothing)
set -euo pipefail

: "${DEPLOY_HOST:?DEPLOY_HOST is not set}"
: "${DEPLOY_USER:?DEPLOY_USER is not set}"
: "${DEPLOY_PATH:?DEPLOY_PATH is not set}"
protocol="$(printf '%s' "${DEPLOY_PROTOCOL:-sftp}" | tr '[:upper:]' '[:lower:]')"

# `mirror --delete` removes everything in the target that is not in out/. Refuse paths that
# would reach beyond the web root of the site.
case "$DEPLOY_PATH" in
  "" | "/" | "." | "./" | "~" | "~/" | ".." )
    echo "Refusing to deploy to '$DEPLOY_PATH': set DEPLOY_PATH to the site's own directory." >&2
    exit 1 ;;
esac
[ -f out/index.html ] || [ -f out/404.html ] || { echo "out/ is missing: run npm run build." >&2; exit 1; }
[ -f out/.htaccess ] || { echo "out/.htaccess is missing: the build did not finish." >&2; exit 1; }

settings="set cmd:fail-exit yes; set net:max-retries 3; set net:timeout 20; set net:reconnect-interval-base 5;"
port_part=""
[ -n "${DEPLOY_PORT:-}" ] && port_part=":${DEPLOY_PORT}"

case "$protocol" in
  sftp)
    key_option=""
    if [ -n "${DEPLOY_SSH_KEY:-}" ]; then
      install -d -m 700 ~/.ssh
      printf '%s\n' "$DEPLOY_SSH_KEY" > ~/.ssh/deploy_key
      chmod 600 ~/.ssh/deploy_key
      key_option="-i $HOME/.ssh/deploy_key"
    fi
    host_check="-o StrictHostKeyChecking=accept-new"
    if [ -n "${DEPLOY_KNOWN_HOSTS:-}" ]; then
      install -d -m 700 ~/.ssh
      printf '%s\n' "$DEPLOY_KNOWN_HOSTS" > ~/.ssh/deploy_known_hosts
      host_check="-o StrictHostKeyChecking=yes -o UserKnownHostsFile=$HOME/.ssh/deploy_known_hosts"
    fi
    settings="$settings set sftp:connect-program \"ssh -a -x $key_option $host_check\";"
    url="sftp://${DEPLOY_HOST}${port_part}" ;;
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
# The password must not contain spaces.
umask 077
printf 'machine %s login %s password %s\n' "$DEPLOY_HOST" "$DEPLOY_USER" "${DEPLOY_PASSWORD:-unused}" > ~/.netrc

# Server-managed folders are left alone.
lftp -c "$settings
open $url
mirror --reverse --delete --verbose --parallel=4 $dry_run \
  --exclude-glob .well-known/ --exclude-glob cgi-bin/ --exclude-glob .ftpquota \
  out/ \"$DEPLOY_PATH\"
bye"
echo "Deploy finished${dry_run:+ (dry run: nothing was uploaded)}."
