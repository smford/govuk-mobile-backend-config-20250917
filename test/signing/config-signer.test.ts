// eslint-disable-next-line n/no-unpublished-import
import {anything, instance, mock, resetCalls, verify, when} from '@typestrong/ts-mockito';
import {ConfigSigner} from '../../src/signing/config-signer';
import {Env} from '../../src/types/environment';
import {MockSigner} from '../utils/mocks';

const fakeSignature = 'FAKE_SIGNATURE';

const signer = mock(MockSigner);
when(signer.sign(anything())).thenReturn(fakeSignature);

const dummyEnv: Env = {
  ios: {
    platform: 'iOS',
    config: {
      someKey: 'some value',
    },
  },
  android: {
    platform: 'Android',
    config: {
      aNumber: 12345,
    },
  },
};

let configSigner: ConfigSigner;

beforeEach(() => {
  resetCalls(signer);
  configSigner = new ConfigSigner(instance(signer));
});

describe('ConfigSigner', () => {
  it('adds the signature in the correct place for iOS', () => {
    const output = configSigner.sign(dummyEnv);
    expect(output.ios).toEqual({
      platform: 'iOS',
      config: {
        someKey: 'some value',
      },
      signature: fakeSignature,
    });
  });

  it('adds the signature in the correct place for Android', () => {
    const output = configSigner.sign(dummyEnv);
    expect(output.android).toEqual({
      platform: 'Android',
      config: {
        aNumber: 12345,
      },
      signature: fakeSignature,
    });
  });

  it('uses a basic JSON.stringify on the config object to pass to the signer', () => {
    configSigner.sign(dummyEnv);
    const expectedString = '{"someKey":"some value"}';
    verify(signer.sign(expectedString)).called();
  });
});
