import * as nearAPI from 'near-api-js';
import { homedir } from 'os';
import { join } from 'path';
import GConfig from './config/base';

export class Config extends GConfig {
  get keyStorePath(): string {
    return join(homedir(), '.near-credentials');
  }

  get keyStore(): nearAPI.keyStores.KeyStore {
    return new nearAPI.keyStores.UnencryptedFileSystemKeyStore(
      this.keyStorePath
    );
  }

  get nearNodeUrl(): string {
    return this.global.nearNodeUrl;
  }

  get nearNetworkId(): string {
    switch (this.global.bridgeId) {
      case 'mainnet':
        return 'mainnet';
      case 'ropsten':
        return 'testnet';
      default:
        return 'local';
    }
  }

  get NEAR(): Promise<nearAPI.Near> {
    return nearAPI.connect({
      nodeUrl: this.nearNodeUrl,
      networkId: this.nearNetworkId,
      deps: {
        keyStore: this.keyStore
      }
    });
  }
}
