#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_ROOT="${DEPLOY_ROOT:-/var/www/liminal-admin-web}"
DIST_DIR="$PROJECT_DIR/dist"
NGINX_SERVICE="${NGINX_SERVICE:-nginx}"

cd "$PROJECT_DIR"

echo "开始拉取最新代码..."
git pull

echo "开始安装依赖..."
npm install

echo "开始构建 admin-web..."
npm run build

if [ ! -d "$DIST_DIR" ]; then
  echo "构建失败，未找到 dist 目录: $DIST_DIR"
  exit 1
fi

echo "同步构建产物到 $DEPLOY_ROOT ..."
sudo mkdir -p "$DEPLOY_ROOT"
sudo rm -rf "$DEPLOY_ROOT/dist"
sudo cp -r "$DIST_DIR" "$DEPLOY_ROOT/"

echo "重载 Nginx ..."
sudo systemctl reload "$NGINX_SERVICE"

echo "admin-web 发布完成"
echo "静态目录: $DEPLOY_ROOT/dist"
