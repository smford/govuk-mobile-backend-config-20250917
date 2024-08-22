import {Signer} from '../../src/signing';
import {Transformer} from '../../src/transformer';
import {ConfigOutput} from '../../src/types/config-output';
import {ConfigVersionDocumentBundle} from '../../src/types/config-version-document';
import {Validator} from '../../src/validator';
import {ValidationResult} from '../../src/validator/validation-result';

export class MockTransformer extends Transformer {
  transform(): ConfigOutput {
    return {};
  }
}

export class MockCvdValidator extends Validator<ConfigVersionDocumentBundle> {
  validate(): ValidationResult {
    return new ValidationResult();
  }
}

export class MockSigner extends Signer<string> {
  sign(data: string): Promise<string> {
    return Promise.resolve(`FAKE_SIGNATURE_${data}`);
  }
}
