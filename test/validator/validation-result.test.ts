import {ValidationResult} from '../../src/validator/validation-result';

describe('ValidationResult', () => {
  it('is valid by default', () => {
    const result = new ValidationResult();
    expect(result.isValid()).toBe(true);
  });

  it('can be created with a static valid method', () => {
    const result = ValidationResult.valid();
    expect(result.isValid()).toBe(true);
  });

  it('is invalid if an error has been logged', () => {
    const result = new ValidationResult();
    result.putError('some kind of error happened');
    expect(result.isValid()).toBe(false);
  });

  it('returns the error message if one is logged', () => {
    const result = new ValidationResult();
    result.putError('some kind of error happened');
    expect(result.getMessage()).toEqual('some kind of error happened');
  });

  it('returns the empty string for the message if there are no errors', () => {
    const result = ValidationResult.valid();
    expect(result.getMessage()).toEqual('');
  });

  it('returns newline separated messages if there is more than one', () => {
    const result = new ValidationResult();
    result.putError('message one');
    result.putError('message two');
    expect(result.getMessage()).toEqual('message one\nmessage two');
  });
});
