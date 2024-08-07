import {Validator} from '../../src/validator';
import {ConfigVersionDocument} from '../utils/version-document';

let validator: Validator = new Validator();

beforeEach(() => {
  validator = new Validator();
});

describe('Validator#validateVersionDocument', () => {
  it('returns true if version string and config object match', () => {
    const res = validator.validateVersionDocument('0.0.1', ConfigVersionDocument.VALID);
    expect(res.isValid()).toBe(true);
  });

  it("returns false if version string and config object don't match", () => {
    const res = validator.validateVersionDocument('1.0.1', ConfigVersionDocument.VALID);
    expect(res.isValid()).toBe(false);
  });

  it("contains a helpful error message if versions don't match", () => {
    const res = validator.validateVersionDocument('1.0.1', ConfigVersionDocument.VALID);
    const msg = 'File version 1.0.1 does not match config version 0.0.1';
    expect(res.getMessage()).toEqual(msg);
  });
});
