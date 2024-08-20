import {randomUUID} from 'crypto';
import {execSync} from 'child_process';
import {FileHandler} from '../../src/file-handler';
import {readFileSync} from 'fs';

const testDirectory = `/tmp/${randomUUID()}/remote-config-file-handler-test`;
console.log('writing to temp dir', testDirectory);

beforeEach(() => {
  execSync(`rm -rf ${testDirectory}`);
  execSync(`mkdir -p ${testDirectory}`);
});

afterEach(() => {
  execSync(`rm -rf ${testDirectory}`);
});

const handler = new FileHandler({
  inputDirectory: './test/file-handler/fixtures',
  outputDirectory: testDirectory,
  fileExtension: '.toml',
});

describe('FileHandler#buildTree', () => {
  it('builds a tree of files to be processed, choosing the latest version of each', () => {
    const output = handler.buildTree();

    expect(output).toEqual({
      appinfo: '1.0.1.toml',
      'some/nested/information': '2.1.1.toml',
      topics: '2.0.5.toml',
    });
  });
});

describe('FileHandler#writeTree', () => {
  it('writes a file for iOS with the given config', () => {
    const input = {
      ios: {
        someString: 'value',
        someNumber: 765,
      },
      android: {
        someOtherString: 'other value',
        someOtherNumber: 0.253,
      },
    };

    const expectedOutputPath = `${testDirectory}/appinfo/ios`;
    handler.writeTree('appinfo', input);
    const fileContent = readFileSync(expectedOutputPath, 'utf-8');
    expect(fileContent).toEqual(JSON.stringify(input.ios, null, 2));
  });

  it('writes a file for Android with the given config', () => {
    const input = {
      ios: {
        someString: 'value',
        someNumber: 765,
      },
      android: {
        someOtherString: 'other value',
        someOtherNumber: 0.253,
      },
    };

    const expectedOutputPath = `${testDirectory}/appinfo/android`;
    handler.writeTree('appinfo', input);
    const fileContent = readFileSync(expectedOutputPath, 'utf-8');
    expect(fileContent).toEqual(JSON.stringify(input.android, null, 2));
  });
});
