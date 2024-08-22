import { KeyObject, createSign, generateKeyPairSync } from 'crypto';
import { Signer } from '.';
import { mkdirSync, writeFileSync } from 'fs';

export class LocalSigner extends Signer<string> {
    publicKey: KeyObject;
    privateKey: KeyObject;

    constructor() {
        super();
        const { publicKey, privateKey } = generateKeyPairSync('ec', {
            namedCurve: 'P-256',
        });
        this.publicKey = publicKey;
        this.privateKey = privateKey;

        mkdirSync('./keys', { recursive: true })
        writeFileSync(
            './keys/local_public.der',
            Buffer.from(
                publicKey.export({
                    format: 'der',
                    type: 'spki',
                })
            )
        );
    }

    async sign(data: string): Promise<string> {
        const signer = createSign('sha256');
        signer.update(data);
        signer.end();
        const signature = signer.sign(this.privateKey);
        return Buffer.from(signature).toString('base64');
    }
}
