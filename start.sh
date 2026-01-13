#!/bin/bash
set -e

echo "=== Running migrations ==="
php artisan migrate --force

echo "=== Caching config ==="
php artisan config:cache

echo "=== Caching routes ==="
php artisan route:cache

echo "=== Starting server ==="
php artisan serve --host=0.0.0.0 --port=$PORT
