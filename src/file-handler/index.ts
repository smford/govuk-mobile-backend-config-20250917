import {ConfigVersionDocument} from '../types/config-version-document';
import path = require('path');
import {mkdirSync, readFileSync, writeFileSync} from 'fs';
import {parse} from 'yaml';
import TOML from '@ltd/j-toml';
import {FileTree, MultiFileTree} from '../types/config-file-tree';
import {readdirSync, statSync} from 'fs';
import {SemVer} from 'semver';
import merge = require('lodash.merge');
import {Env} from '../types/environment';
import {Platform} from '../types/config-output';

export interface FileHandlerOpts {
  inputDirectory: string;
  outputDirectory: string;
  fileExtension: string;
}

export class FileHandler {
  opts: FileHandlerOpts;

  constructor(opts: FileHandlerOpts) {
    this.opts = opts;
  }

  static forFile(fileName: string): FileHandler {
    const ext = path.extname(fileName);
    const inDir = path.dirname(fileName);
    return new FileHandler({
      inputDirectory: inDir,
      outputDirectory: '',
      fileExtension: ext,
    });
  }

  extractVersionFromFilename(filename: string): string {
    return path.basename(filename).replace(this.opts.fileExtension, '');
  }

  loadDocument(filename: string, inSubdir?: string): ConfigVersionDocument {
    filename = path.join(this.opts.inputDirectory, inSubdir ?? '', filename);
    const ext = path.extname(filename);
    switch (ext) {
      case '.yaml':
        return this.loadYaml(filename);
      case '.yml':
        return this.loadYaml(filename);
      case '.toml':
        return this.loadToml(filename);
      default:
        throw new Error(`Invalid extension: ${ext}`);
    }
  }

  loadYaml(filename: string): ConfigVersionDocument {
    const file = readFileSync(filename, 'utf-8');
    return parse(file);
  }

  loadToml(filename: string): ConfigVersionDocument {
    // enable parsing of multiline inline tables
    const opts = {
      bigint: false,
      x: {
        multi: true,
      },
    };

    const file = readFileSync(filename, 'utf-8');

    // there is some strangeness that needs further investigation
    // where what comes out of TOML.parse, whilst serializing to an
    // identical JSON object as yaml.load, behaves differently when
    // subjected to lodash.merge. the workaround is to serialize
    // to JSON and then parse back to an object
    return JSON.parse(JSON.stringify(TOML.parse(file, opts))) as unknown as ConfigVersionDocument;
  }

  buildTree(): FileTree {
    const opts = this.opts;

    // recursively look through `dir` for .`ext` files
    function findFilesWithExt(dir: string, ext: string) {
      const output: MultiFileTree = {};
      const files = readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const fileStat = statSync(filePath);
        if (fileStat.isDirectory()) {
          merge(output, findFilesWithExt(filePath, ext));
        } else if (file.endsWith(ext)) {
          const [directory, file] = sanitisePath(filePath);
          if (!output[directory]) {
            output[directory] = [];
          }
          output[directory].push(file);
        }
      }
      return output;
    }

    function sanitisePath(filePath: string): [string, string] {
      const relative = path.relative(opts.inputDirectory, filePath);
      const directory = path.dirname(relative);
      const file = path.basename(relative);
      return [directory, file];
    }

    function findLatest(tree: MultiFileTree) {
      const output: FileTree = {};
      Object.keys(tree).forEach(dir => {
        output[dir] = tree[dir].sort(sortBySemVer)[0];
      });
      return output;
    }

    function sortBySemVer(a: string, b: string): number {
      if (opts.fileExtension) {
        a = a.replace(opts.fileExtension, '');
        b = b.replace(opts.fileExtension, '');
      }
      return new SemVer(b).compare(new SemVer(a));
    }

    const allFiles = findFilesWithExt(this.opts.inputDirectory, opts.fileExtension);
    const latestTree = findLatest(allFiles);
    return latestTree;
  }

  writeTree(filePath: string, config: Env) {
    const platforms = Object.values(Platform);
    const outputDir = path.join(this.opts.outputDirectory, filePath);
    mkdirSync(outputDir, {recursive: true});
    platforms.forEach(plt => {
      const pathToWrite = path.join(outputDir, plt);
      const fileContents = JSON.stringify(config[plt], null, 2);
      writeFileSync(pathToWrite, fileContents);
    });
  }
}
