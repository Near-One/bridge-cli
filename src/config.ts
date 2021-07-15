import { ethers } from 'ethers';
import * as nearAPI from 'near-api-js';
import { homedir } from 'os';
import { join } from 'path';
import GConfig from './config/base';

export class Config extends GConfig {
  ethProvider?: ethers.providers.Provider;

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

  /// Return NEAR interface
  get NEAR(): Promise<nearAPI.Near> {
    return nearAPI.connect({
      nodeUrl: this.nearNodeUrl,
      networkId: this.nearNetworkId,
      deps: {
        keyStore: this.keyStore
      }
    });
  }

  /// Return Ethereum JSON RPC provider
  get eth(): ethers.providers.Provider {
    if (this.ethProvider === undefined) {
      this.ethProvider = new ethers.providers.JsonRpcProvider(
        this.global.ethNodeUrl
      );
    }
    return this.ethProvider;
  }
}
