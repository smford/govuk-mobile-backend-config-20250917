#!/bin/dash
set -eu

for file in "$@"; do
    # create temp dir to put intermediate file
    mkdir -p $(dirname "/tmp/maxified/$file")

    # create maxified version and write to temp file
    jq --indent 4 . <  "$file" > "/tmp/maxified/$file"

    # overwrite original file with maxified version
    mv "/tmp/maxified/$file" "$file"
done
