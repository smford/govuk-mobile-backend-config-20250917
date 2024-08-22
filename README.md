# GOV.UK Mobile Backend Config
This repository contains static backend config for the GOV.UK mobile apps.

## How to use
There are several subprograms that can be run to process the config, allowing for a modular design and running in a variety of contexts - e.g. on CI or local laptop. All of the subcommands can expose help information by running `npm start help <subcommand>`.

There are some example config version documents in ./versions/appinfo

```shell
# it is recommended to start here
npm start help

# validate input (a single config version document)
npm start validate "<filename>"

# process a single config version document (outputs to stdout)
npm start generate "<filename>"

# if you want to pipe the output (e.g. to jq)
npm run --silent start generate "<filename>"

# generate a tree of config using the latest version detected
npm start build -- "[options]" "<environment>"

# to generate an output tree using the 'dummydata' directory
npm start build -- production --input-directory ./dummydata
```

### Running KMS locally to test signatures
First install LocalStack if not already installed:
`brew install localstack/tap/localstack-cli`

Start it running:
`localstack start -d`

Pop some LocalStack config in `~/.aws/config`:
```
[localstack]
region=us-east-1
output=json
endpoint_url=http://localhost:4566
```

Pop some LocalStack credentials in `~/.aws/credentials`:
```
[localstack]
aws_access_key_id=test
aws_secret_access_key=test
```

Create a KMS key:
`aws --profile localstack kms create-key --key-usage SIGN_VERIFY --key-spec ECC_NIST_P256`
Note the `KeyId` in the response

'Download' the public key using:
`aws --profile localstack kms get-public-key --key-id <KeyId from previous command>`

Store the public key in a `.der` file using:
```shell
mkdir -p ./keys # make sure the keys directory exists
aws --profile localstack kms get-public-key \
    --key-id <KeyId from previous command> \
    --output text \
    --query PublicKey | base64 --decode > ./keys/kms_public.der
```
(This is the same as using the previous command, then copying the public key, decoding it and storing the result in a file.)

In order to generate LocalStack KMS signatures, store the `KeyId` in an environment variable called `KMS_KEY_ID` (you can do this by creating a `.env` file in this directory).

### Verifying signatures

#### Local signing
Under this approach, the application will generate a new public/private key pair at runtime. This uses the Node.js `crypto` module. A file will be written to `./keys/local_public.der` which contains the public key that you can use for verification. To invoke local signing, pass the `--local-signature` flag to the `build` command - i.e. `npm start build -- production --local-signature --input-directory ./dummydata`

#### KMS signing (using LocalStack)
In order to use this, the you need to set the `AWS_PROFILE` environment variable in the `.env` file to `localstack`. The application will call the LocalStack KMS service to sign config. You can use the public key (retrieved as above and written to `./keys/kms_public.der`) to verify signatures locally.

#### Running the verification script
```shell
# format is ./verifysignature.sh <config-file-location> <public-key-file-location>
./verifysignature.sh ./config.out/appinfo/android ./keys/kms_public.der
```

The script uses OpenSSL under the hood, and can be used for both local and KMS signatures.

## Linting
You can run the linter using `npm run lint`. This will output a set of warnings. This will run on the CI server so it's important to fix any linting issues before pushing.

You can automagically fix linting issues with `npm run fix`.

## Testing
Run the tests with `npm test` which invokes Jest. Check code coverage with `npm test -- --coverage=true`.

## TODO
* automatically fix lint issues on pre-commit
* potentially a set of bash scripts that invoke the npm equivalents, or one big one
* improve test coverage of file handling (essentially becomes integration tests though)
