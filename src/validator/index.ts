import {ConfigVersionDocumentBundle} from '../types/config-version-document';
import {VersionDocumentSchemaValidator} from './schema-validator';
import {ValidationResult} from './validation-result';
import {VersionValidator} from './version-validator';

export abstract class Validator<T> {
  abstract validate(item: T): ValidationResult;
}

export class ConfigVersionDocumentValidator extends Validator<ConfigVersionDocumentBundle> {
  #schemaValidator: VersionDocumentSchemaValidator;
  #versionValidator: VersionValidator;

  constructor() {
    super();
    this.#schemaValidator = new VersionDocumentSchemaValidator();
    this.#versionValidator = new VersionValidator();
  }

  validate(bundle: ConfigVersionDocumentBundle): ValidationResult {
    const result = new ValidationResult();

    if (!this.#schemaValidator.validate(result, bundle.versionDocument).isValid()) {
      return result;
    }

    if (
      !this.#versionValidator
        .validate(result, bundle.versionString, bundle.versionDocument)
        .isValid()
    ) {
      return result;
    }

    return result;
  }

  // validateVersionDocument(version: string, document: ConfigVersionDocument): ValidationResult {
  //     const schemaValidator = new VersionDocumentSchemaValidator();
  //     const versionValidator = new VersionValidator();

  //     const result = new ValidationResult();

  //     if (!schemaValidator.validate(result, document).isValid()) {
  //         return result;
  //     }

  //     if (!versionValidator.validate(result, version, document).isValid()) {
  //         return result;
  //     }

  //     return result;
  // }
}
