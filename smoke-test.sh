#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
rm -rf .smoke-profile
chromium \
  --headless=new \
  --no-sandbox \
  --disable-gpu \
  --disable-dev-shm-usage \
  --disable-extensions-except="$PWD/dist" \
  --load-extension="$PWD/dist" \
  --user-data-dir="$PWD/.smoke-profile" \
  --virtual-time-budget=8000 \
  --dump-dom 'https://www.mixamo.com/#/?page=1&type=Motion%2CMotionPack' > smoke-dom.html
if grep -q 'id="mixamo-batch"' smoke-dom.html; then
  echo 'extension smoke test: iframe mounted'
else
  echo 'extension smoke test: iframe not mounted'
  exit 1
fi
