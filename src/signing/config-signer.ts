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

  static kms(): ConfigSigner {
    return new ConfigSigner(new KmsSigner());
  }

  static noop(): ConfigSigner {
    return new ConfigSigner(new DummySigner());
  }

  sign(data: Env): Env {
    Object.values(Platform).forEach(plt => {
      const signData = JSON.stringify(data[plt].config);
      const signature = this.signer.sign(signData);
      data[plt].signature = signature;
    });
    return data;
  }
}
