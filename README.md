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
npm start build "[options]"
```

## Linting
You can run the linter using `npm run lint`. This will output a set of warnings. This will run on the CI server so it's important to fix any linting issues before pushing.

You can automagically fix linting issues with `npm run fix`.

## Testing
Run the tests with `npm test` which invokes Jest. Check code coverage with `npm test -- --coverage=true`.

## TODO
* automatically fix lint issues on pre-commit
* potentially a set of bash scripts that invoke the npm equivalents, or one big one
* improve test coverage of file handling (essentially becomes integration tests though)
