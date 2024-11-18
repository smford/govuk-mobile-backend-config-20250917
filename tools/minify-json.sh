#!/bin/dash
set -eu

for file in "$@"; do
    # create temp dir to put intermediate file
    mkdir -p $(dirname "/tmp/minified/$file")

    # create minified version and write to temp file
    jq -jc . <  "$file" > "/tmp/minified/$file"

    # overwrite original file with minified version
    mv "/tmp/minified/$file" "$file"
done
