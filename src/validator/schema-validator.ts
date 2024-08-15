import {ConfigVersionDocument} from '../types/config-version-document';
import {ValidationResult} from './validation-result';
import Ajv, {ValidateFunction} from 'ajv/dist/2020';

import * as schema from '../schema/config-version-document.json';

export class VersionDocumentSchemaValidator {
  #validator: ValidateFunction;

  constructor() {
    const ajv = new Ajv({strict: true});
    this.#validator = ajv.compile(schema);
  }

  validate(result: ValidationResult, document: ConfigVersionDocument): ValidationResult {
    const isValid = this.#validator(document);
    if (!isValid) {
      this.#validator.errors?.forEach(e => {
        result.putError(e.message!);
      });
    }
    return result;
  }
}
