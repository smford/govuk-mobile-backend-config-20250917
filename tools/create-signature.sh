#!/bin/dash
set -eu

for file in "$@"; do
    # create required dirs
    mkdir -p $(dirname "/tmp/digests/$file")
    mkdir -p $(dirname "/tmp/signatures/$file")

    # create message digest - needed to support files larger than 4096 bytes
    openssl dgst -sha256 -binary "$file" > "/tmp/digests/$file"

    # sign using KMS - pass in digest created above
    aws kms sign \
    --key-id alias/config-signing-key \
    --signing-algorithm ECDSA_SHA_256 \
    --message "fileb:///tmp/digests/$file" \
    --message-type DIGEST \
    --output text \
    --query Signature > "/tmp/signatures/$file"

    # clean up digest file
    rm "/tmp/digests/$file"
done
