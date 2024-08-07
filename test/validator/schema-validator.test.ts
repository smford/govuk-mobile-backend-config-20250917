import {VersionDocumentSchemaValidator} from '../../src/validator/schema-validator';
import {ValidationResult} from '../../src/validator/validation-result';

const validator = new VersionDocumentSchemaValidator();

describe('VersionDocumentSchemaValidator', () => {
  it('considers a basic CVD to be valid', () => {
    const input = {
      metadata: {
        configVersion: '0.1.2',
      },
      environments: {
        default: {
          ios: {},
          android: {},
        },
      },
    };
    const result = new ValidationResult();
    validator.validate(result, input);
    expect(result.isValid()).toBe(true);
  });

  it('considers a CVD to be invalid if missing the configVersion field', () => {
    /* eslint-disable */
        const input = {
            metadata: {
                someOtherValue: 12345,
            },
        } as any;
        /* eslint-enable */
    const result = new ValidationResult();
    validator.validate(result, input);
    expect(result.isValid()).toBe(false);
  });

  it('is invalid if one of the platforms is missing', () => {
    /* eslint-disable */
        const input = {
            metadata: {
                configVersion: '0.1.2',
            },
            environments: {
                default: {
                    ios: {}, // no android
                },
            },
        } as any;
        /* eslint-enable */
    const result = new ValidationResult();
    validator.validate(result, input);
    expect(result.isValid()).toBe(false);
  });

  it('is still valid if one of the platforms is missing from another env', () => {
    const input = {
      metadata: {
        configVersion: '0.1.2',
      },
      environments: {
        default: {
          ios: {},
          android: {},
        },
        production: {
          ios: {},
        },
      },
    };
    const result = new ValidationResult();
    validator.validate(result, input);
    expect(result.isValid()).toBe(true);
  });
});
