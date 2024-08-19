import { randomUUID } from 'crypto';
import { execSync } from 'child_process';
import { FileHandler } from '../../src/file-handler';

const testDirectory = `/tmp/${randomUUID()}/remote-config-file-handler-test`;

beforeEach(() => {
    execSync(`rm -rf ${testDirectory}`);
    execSync(`mkdir -p ${testDirectory}`);
});

afterEach(() => {
    execSync(`rm -rf ${testDirectory}`);
});

describe('FileHandler#buildTree', () => {
    it('builds a tree of files to be processed', () => {
        const handler = new FileHandler({
            inputDirectory: './test/file-handler/fixtures',
            outputDirectory: testDirectory,
            fileExtension: ".toml"
        });

        const output = handler.buildTree();

        expect(output).toEqual({
            "appinfo": "1.0.1.toml",
            "some/nested/information": "2.1.1.toml",
            "topics": "2.0.5.toml"
        })
    });

});
