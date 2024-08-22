import {Env} from '../types/environment';
import {KmsSigner} from './kms-signer';
import {LocalSigner} from './local-signer';
import {Signer, DummySigner} from '.';
import {Platform} from '../types/config-output';

export class ConfigSigner extends Signer<Env> {
  signer: Signer<string>;

  constructor(signer: Signer<string>) {
    super();
    this.signer = signer;
  }

  static local(): ConfigSigner {
    return new ConfigSigner(new LocalSigner());
  }

  static kms(keyId: string): ConfigSigner {
    return new ConfigSigner(new KmsSigner(keyId));
  }

  static noop(): ConfigSigner {
    return new ConfigSigner(new DummySigner());
  }

  async sign(data: Env): Promise<Env> {
    for (const plt of Object.values(Platform)) {
      const signData = JSON.stringify(data[plt].config);
      const signature = await this.signer.sign(signData);
      data[plt].signature = signature;
    }
    return data;
  }
}
