export abstract class Signer<T> {
  abstract sign(data: T): T;
}

export class DummySigner extends Signer<string> {
  sign(): string {
    const msg = 'NOT A REAL SIGNATURE';
    const b64 = Buffer.from(msg).toString('base64');
    return b64;
  }
}
