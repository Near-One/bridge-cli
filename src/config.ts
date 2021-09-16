import { ethers } from 'ethers';
import * as nearAPI from 'near-api-js';
import { homedir } from 'os';
import GConfig from './config/base';
import * as fs from 'fs';
import * as YAML from 'yaml';
import { join } from 'path';
import { Option, None, Some } from '@hqoss/monads';
import { put0x, remove0x } from './utils/common';
import { EthereumKey, EthereumKeyStore } from './ethKeyStore';

class NearExplorerURL {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  transaction(txId: string) {
    return `${this.url}/transactions/${txId}`;
  }

  account(accountId: string) {
    return `${this.url}/accounts/${accountId}`;
  }
}
class EtherscanExplorerURL {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  transaction(txId: string) {
    return `${this.url}/tx/${put0x(txId)}`;
  }

  address(address: string) {
    return `${this.url}/address/${put0x(address)}`;
  }
}

export const CONFIG_PATH = join(homedir(), '.rainbow');

export const SELECTED_ETHEREUM_ADDRESS_FILENAME = 'ethereum-address';

export class Config extends GConfig {
  ethProvider?: ethers.providers.Provider;

  get keyStorePath(): string {
    return join(homedir(), '.near-credentials');
  }

  get nearKeyStore(): nearAPI.keyStores.KeyStore {
    return new nearAPI.keyStores.UnencryptedFileSystemKeyStore(
      this.keyStorePath
    );
  }

  get ethKeyStore(): EthereumKeyStore {
    return new EthereumKeyStore(join(homedir(), '.eth-credentials'));
  }

  get nearNodeUrl(): string {
    return this.near.nodeUrl;
  }

  get bridgeDataPath(): string {
    return join(CONFIG_PATH, this.global.bridgeId);
  }

  get selectedEthereumKeyFileName(): string {
    return join(this.bridgeDataPath, SELECTED_ETHEREUM_ADDRESS_FILENAME);
  }

  get selectedEthereumKey(): Promise<Option<EthereumKey>> {
    return fs.promises
      .readFile(this.selectedEthereumKeyFileName)
      .then(async (value) => {
        const identifier = value.toString('utf8').replace('\n', '');
        return Some(await this.ethKeyStore.getKey(identifier));
      })
      .catch((e) => {
        return None;
      });
  }

  // TODO: Add near network-id in configuration
  get nearNetworkId(): string {
    switch (this.global.bridgeId) {
      case 'mainnet':
        return 'mainnet';
      case 'ropsten':
        return 'testnet';
      case 'goerli':
        return 'testnet';
      default:
        return 'local';
    }
  }

  // TODO: Add ethereum network-id in configuration
  get ethereumNetworkId(): string {
    return this.global.bridgeId;
  }

  get nearExplorer(): NearExplorerURL {
    // TODO: Add NEAR Explorer URL in configuration
    return new NearExplorerURL(
      `https://explorer.${this.nearNetworkId}.near.org`
    );
  }

  get etherscan(): EtherscanExplorerURL {
    // TODO: Add Etherscan Explorer URL in configuration
    let url = `https://etherscan.io`;
    if (this.global.bridgeId !== 'mainnet') {
      url = `https://${this.global.bridgeId}.etherscan.io`;
    }
    return new EtherscanExplorerURL(url);
  }

  async ethereumSigner(): Promise<ethers.Wallet> {
    const key = await this.selectedEthereumKey;

    if (key.isNone()) {
      console.log('Set ethereum key using `bridge eth keys use <KEY_ID>`');
      process.exit(1);
    }

    return new ethers.Wallet(key.unwrap().privateKey, this.eth);
  }

  /// Return NEAR interface
  get NEAR(): Promise<nearAPI.Near> {
    return nearAPI.connect({
      nodeUrl: this.nearNodeUrl,
      networkId: this.nearNetworkId,
      deps: {
        keyStore: this.nearKeyStore
      }
    });
  }

  /// Return Ethereum JSON RPC provider
  get eth(): ethers.providers.Provider {
    if (this.ethProvider === undefined) {
      this.ethProvider = new ethers.providers.JsonRpcProvider(
        this.ethereum.nodeUrl
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
    return new Config(await Config.loadConfigRaw(path));
  }

  static async selectedBridge(): Promise<Option<string>> {
    if (!fs.existsSync(join(CONFIG_PATH, 'bridge'))) {
      return None;
    }

    return Some(
      (await fs.promises.readFile(join(CONFIG_PATH, 'bridge')))
        .toString()
        .replace('\n', '')
    );
  }

  /// Return path to the selected configuration path
  static async selectedConfig(): Promise<Option<string>> {
    const content = await Config.selectedBridge();

    if (content.isNone()) {
      return None;
    }

    const configPath = join(CONFIG_PATH, content.unwrap(), 'config.yml');

    if (!fs.existsSync(configPath)) {
      return None;
    }

    return Some(configPath);
  }

  bridgeTokenAccountIdFromAddress(address: string): string {
    address = remove0x(address);
    return `${address}.${this.contracts.near.tokenFactory}`;
  }
}
