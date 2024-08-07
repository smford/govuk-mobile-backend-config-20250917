import {Transformer} from '../../src/transformer';
import {ConfigVersionDocument} from '../utils/version-document';

const transformer = new Transformer();

describe('Transformer', () => {
  it('emits a key/value map of environment names to config objects', () => {
    const res = transformer.transform('0.0.1', ConfigVersionDocument.VALID);
    expect(res.production.android.platform).toEqual('Android');
    expect(res.production.ios.platform).toEqual('iOS');
  });

  it('does not include the platform as part of the config object', () => {
    const res = transformer.transform('0.0.1', ConfigVersionDocument.VALID);
    expect(res.production.android.config.platform).toBeUndefined();
    expect(res.production.ios.config.platform).toBeUndefined();
  });

  it('allows overriding of the platform name if needed', () => {
    const res = transformer.transform('0.0.1', ConfigVersionDocument.VALID);
    expect(res.integration.android.platform).toEqual('Android');
    expect(res.integration.ios.platform).toEqual('IOS_INT');
  });

  it('includes all environments listed in the version document', () => {
    const res = transformer.transform('0.0.1', ConfigVersionDocument.VALID);
    expect(res.bananas).toBeDefined();
  });

  it('contains the config version number in the output', () => {
    const res = transformer.transform('0.0.1', ConfigVersionDocument.VALID);
    expect(res.integration.android.config.version).toEqual('0.0.1');
  });

  it('timestamps the config in the output', () => {
    const res = transformer.transform('0.0.1', ConfigVersionDocument.VALID);
    expect(Date.parse(res.integration.ios.config.lastUpdated)).toBeDefined();
  });

  it('correctly overrides default values', () => {
    const res = transformer.transform('0.0.1', ConfigVersionDocument.VALID);
    expect(res.integration.ios.config.minimumVersion).toEqual('9.9.9');
    expect(res.production.ios.config.minimumVersion).toEqual('1.0.0');
  });

  it('correctly merges nested default values with overrides', () => {
    const res = transformer.transform('0.0.1', ConfigVersionDocument.VALID);
    expect(res.production.android.config.releaseFlags).toEqual({
      featureOne: false, // this has been overridden
      featureTwo: false,
    });
  });

  it('supports turning off a platform in a specific env', () => {
    const res = transformer.transform('0.0.1', ConfigVersionDocument.VALID);
    expect(res.test.ios.config.available).toBe(false);
    expect(res.production.ios.config.available).toBe(true);
  });
});
