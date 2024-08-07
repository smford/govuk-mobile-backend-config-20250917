import {ConfigVersionDocument} from '../types/config-version-document';
import {ValidationResult} from './validation-result';
import {SemVer} from 'semver';

export class VersionValidator {
  validate(result: ValidationResult, version: string, document: ConfigVersionDocument) {
    const versionFromFile = new SemVer(version);
    const versionFromDocument = new SemVer(document.metadata.configVersion);
    if (versionFromFile.compare(versionFromDocument) !== 0) {
      result.putError(
        `File version ${versionFromFile} does not match config version ${versionFromDocument}`
      );
    }
    return result;
  }
}
