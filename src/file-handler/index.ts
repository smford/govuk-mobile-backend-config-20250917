import {ConfigVersionDocument} from '../types/config-version-document';
import path = require('path');
import {readFileSync} from 'fs';
import {parse} from 'yaml';

export class FileHandler {
  // TODO consider if this should be moved elsewhere
  extractVersionFromFilename(filename: string): string {
    return path.basename(filename).replace('.yaml', '').replace('.yml', '');
  }

  loadYaml(filename: string): ConfigVersionDocument {
    const file = readFileSync(filename, 'utf-8');
    return parse(file);
  }
}
