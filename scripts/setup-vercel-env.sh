#!/bin/bash
# Vercel環境変数を .env.local から一括設定するスクリプト
# 実行前に `npx vercel login` でログインしておくこと

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$PROJECT_DIR/.env.local"

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: .env.local not found at $ENV_FILE"
  exit 1
fi

echo "Setting Vercel environment variables from .env.local..."

while IFS='=' read -r key value; do
  [[ "$key" =~ ^#.*$ ]] && continue
  [[ -z "$key" ]] && continue
  echo "Setting $key ..."
  echo "$value" | npx vercel env add "$key" production --force < /dev/null || true
done < "$ENV_FILE"

echo "Done. Run 'npx vercel --prod' to deploy."
