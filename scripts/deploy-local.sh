#!/usr/bin/env bash
# Builds the production site and uploads it from this computer (same upload as the GitHub
# "Deploy" workflow). Use it when GitHub Actions is slow or unavailable: `npm run deploy`.
# Settings come from .env.deploy (git-ignored), one KEY=value per line:
#   DEPLOY_HOST=...  DEPLOY_USER=...  DEPLOY_PATH=...
#   DEPLOY_PROTOCOL=sftp  DEPLOY_PORT=57185  DEPLOY_SSH_KEY_FILE=/path/to/private_key
#   (sftp needs only Python 3 and the sftp that ships with macOS; ftps/ftp need lftp and DEPLOY_PASSWORD)
# Add DEPLOY_DRY_RUN=1 to list what would be uploaded without uploading.
set -euo pipefail
cd "$(dirname "$0")/.."

[ -f .env.deploy ] || { echo "Missing .env.deploy (see the header of scripts/deploy-local.sh)." >&2; exit 1; }

set -a
# shellcheck disable=SC1091
. ./.env.deploy
set +a

SITE_ENV=production npm run build
bash scripts/deploy.sh
