import {Command, Option} from 'commander';
import {Processor} from './processor';
import {configDotenv} from 'dotenv';

/**
 * This file is responsible for setting up and processing command line arguments and then calling the
 * relevant functions on the Processor which execute the logic
 */

configDotenv();
const program = new Command();
const processor = new Processor();

function validate(filename: string) {
  processor.validate(filename);
}

function generate(filename: string) {
  processor.generate(filename);
}

async function build(environment: string, opts: GenerateOpts) {
  const {inputDirectory, outputDirectory, omitSignature, localSignature, keyId} = opts;
  await processor.build(
    inputDirectory,
    outputDirectory,
    omitSignature,
    localSignature,
    environment,
    keyId
  );
}

program
  .name('govuk-mobile-backend-config')
  .description(
    'CLI tool to validate, build and publish static backend config for GOV.UK mobile apps'
  )
  .version('0.0.1');

program
  .command('validate')
  .description('Validate a config version document against the schema, includes integrity checks')
  .argument('<filename>', 'config version document to validate')
  .action(validate);

program
  .command('generate')
  .description(
    'Generate a deployable json from a config version document. Output is written to stdout'
  )
  .argument('<filename>', 'config version document to validate')
  .action(generate);

program
  .command('build')
  .description(
    'Generate an entire tree of config files using the latest detected config version documents'
  )
  .argument('<environment>', 'The GOV.UK environment for which to generate the build')
  .option(
    '--input-directory <input-directory>',
    'The input directory where config version documents are found',
    './versions'
  )
  .option(
    '--output-directory <output-directory>',
    'The directory to write the generated config to (WILL BE OVERWRITTEN)',
    './config.out'
  )
  .addOption(
    new Option('--omit-signature', 'skip the signing step')
      .default(false)
      .conflicts('local-signature')
  )
  .addOption(
    new Option('--local-signature', 'generate and use a local private key')
      .default(false)
      .conflicts('omit-signature')
  )
  .addOption(new Option('--key-id <key-id>', 'KeyId for an existing KMS key').env('KMS_KEY_ID'))
  .action(build);

interface GenerateOpts {
  inputDirectory: string;
  outputDirectory: string;
  omitSignature: boolean;
  localSignature: boolean;
  keyId?: string;
}

program.parse();
