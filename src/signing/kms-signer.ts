import {KMSClient, SignCommand, SignCommandInput} from '@aws-sdk/client-kms';
import {Signer} from '.';

export class KmsSigner extends Signer<string> {
  keyId: string;
  kmsClient: KMSClient;

  constructor(keyId: string) {
    super();
    this.keyId = keyId;
    this.kmsClient = new KMSClient();
  }

  async sign(data: string): Promise<string> {
    const input: SignCommandInput = {
      KeyId: this.keyId,
      Message: Buffer.from(data),
      MessageType: 'RAW',
      SigningAlgorithm: 'ECDSA_SHA_256',
    };

    const command = new SignCommand(input);
    const response = await this.kmsClient.send(command);

    if (response.Signature) {
      return Buffer.from(response.Signature).toString('base64');
    }

    throw new Error('An error occurred whislt signing using KMS');
  }
}
