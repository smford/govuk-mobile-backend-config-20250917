#!/bin/dash
set -eu

for file in "$@"; do
    jq -r . "$file" >/dev/null 2>&1 || (echo "$file has invalid JSON" && exit 1)
done
