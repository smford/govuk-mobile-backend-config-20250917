#!/bin/bash

set -e

# make a temporary directory
rand_dir=$(openssl rand -base64 12)
temp_dir="/tmp/$rand_dir"
mkdir -p "$temp_dir"

# ensure temp directory gets deleted on exit
trap "rm -rf $temp_dir" EXIT

config_file=$1
key_file=$2

# grab out the relevant parts from the config file
signature=$(cat $config_file | jq -r .signature)
message=$(cat $config_file | jq .config | jq -r '@json')

# create a couple of temp files to perform verification
echo -n "$signature" | base64 --decode > "$temp_dir/sig.der"
echo -n "$message" > "$temp_dir/msg.txt"

# use openssl to verify signature
openssl dgst -sha256 -verify "$key_file" -signature "$temp_dir/sig.der" "$temp_dir/msg.txt"
