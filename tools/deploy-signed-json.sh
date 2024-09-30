#!/bin/dash
set -eu

for file in "$@"; do
    signature=$(cat "/tmp/signatures/$file")
    
    # upload to S3
    aws s3 cp \
    "$file" "s3://$BUCKET_NAME/$file" \
    --content-type application/json \
    --metadata "govuk-sig=$signature"

    # clean up signature file
    rm "/tmp/signatures/$file"
done
