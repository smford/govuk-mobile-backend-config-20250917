import {Signer} from '.';

export class KmsSigner extends Signer<string> {
  sign(): string {
    throw new Error('Method not implemented.');
  }
}
