#!/usr/bin/env bash
# Builds the production site and uploads it from this computer (same upload as the GitHub
# "Deploy" workflow). Use it when GitHub Actions is slow or unavailable: `npm run deploy`.
# Settings come from .env.deploy (git-ignored), one KEY=value per line:
#   DEPLOY_HOST=...  DEPLOY_USER=...  DEPLOY_PATH=...
#   DEPLOY_PROTOCOL=sftp  DEPLOY_PORT=57185  DEPLOY_SSH_KEY_FILE=/path/to/private_key
#   (sftp needs only Python 3 and the sftp that ships with macOS; ftps/ftp need lftp and DEPLOY_PASSWORD)
# Add DEPLOY_DRY_RUN=1 to list what would be uploaded without uploading.
#
# A review copy with the other logo goes to its own folder:
#   DEPLOY_ENV_FILE=.env.deploy.preview NEXT_PUBLIC_LOGO=2 npm run deploy
# where .env.deploy.preview has the preview DEPLOY_PATH and SITE_ENV=preview.
set -euo pipefail
cd "$(dirname "$0")/.."

env_file="${DEPLOY_ENV_FILE:-.env.deploy}"
[ -f "$env_file" ] || { echo "Missing $env_file (see the header of scripts/deploy-local.sh)." >&2; exit 1; }

set -a
# shellcheck disable=SC1091
. "./$env_file"
set +a

SITE_ENV="${SITE_ENV:-production}" npm run build
bash scripts/deploy.sh
