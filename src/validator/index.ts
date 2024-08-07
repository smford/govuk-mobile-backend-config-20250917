import {ConfigVersionDocument} from '../types/config-version-document';
import {VersionDocumentSchemaValidator} from './schema-validator';
import {ValidationResult} from './validation-result';
import {VersionValidator} from './version-validator';

export class Validator {
  validateVersionDocument(version: string, document: ConfigVersionDocument): ValidationResult {
    const schemaValidator = new VersionDocumentSchemaValidator();
    const versionValidator = new VersionValidator();

    const result = new ValidationResult();

    if (!schemaValidator.validate(result, document).isValid()) {
      return result;
    }

    if (!versionValidator.validate(result, version, document).isValid()) {
      return result;
    }

    return result;
  }
}
