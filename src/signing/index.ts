export abstract class Signer<T> {
  abstract sign(data: T): Promise<T>;
}

export class DummySigner extends Signer<string> {
  async sign(): Promise<string> {
    const msg = 'NOT A REAL SIGNATURE';
    const b64 = Buffer.from(msg).toString('base64');
    return b64;
  }
}
