import { ethers } from 'ethers';
import * as nearAPI from 'near-api-js';
import { homedir } from 'os';
import GConfig from './config/base';
import * as fs from 'fs';
import * as YAML from 'yaml';
import { dirname, join } from 'path';
import { Option, None, Some } from '@hqoss/monads';

export const CONFIG_PATH = join(homedir(), '.rainbow');
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

  static async findConfigs(path = CONFIG_PATH): Promise<string[]> {
    if (!fs.existsSync(path)) {
      return [];
    }

    const result: string[] = [];
    (await fs.promises.readdir(path)).forEach((folder) => {
      const config = join(path, folder, 'config.yml');
      if (fs.existsSync(config)) result.push(config);
    });
    return result;
  }

  static async loadConfigRaw(path: string): Promise<any> {
    const content = await fs.promises.readFile(path, 'utf8');
    return YAML.parse(content);
  }

  static async loadConfig(path: string): Promise<Config> {
    return new Config(Config.loadConfigRaw(path));
  }

  /// Return path to the selected configuration path
  static async selectedConfig(): Promise<Option<string>> {
    if (!fs.existsSync(join(CONFIG_PATH, 'bridge'))) {
      return None;
    }

    const content = (
      await fs.promises.readFile(join(CONFIG_PATH, 'bridge'))
    ).toString();

    const configPath = join(CONFIG_PATH, content, 'config.yml');

    if (!fs.existsSync(configPath)) {
      return None;
    }

    return Some(configPath);
  }
}
