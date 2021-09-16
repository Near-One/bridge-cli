import * as fs from 'fs';
import { join } from 'path';
import { ethers } from 'ethers';

// TODO: Move to a separate + more secure project

export class EthereumKey {
  address: string;
  privateKey: string;
  name?: string;
  network?: string;

  constructor(privateKey: string, name?: string, network?: string) {
    this.privateKey = privateKey;
    this.address = ethers.utils.computeAddress(privateKey);
    this.name = name;
    this.network = network;
  }

  static async loadFromFile(path: string): Promise<EthereumKey> {
    const key = JSON.parse((await fs.promises.readFile(path)).toString('utf8'));
    return new EthereumKey(key.privateKey, key.name, key.network);
  }
}

export class EthereumKeyStore {
  path: string;

  constructor(path: string) {
    this.path = path;
  }

  async addKey(key: EthereumKey) {
    if (!fs.existsSync(this.path)) {
      await fs.promises.mkdir(this.path);
    }

    await fs.promises.writeFile(
      join(this.path, key.address + '.json'),
      JSON.stringify(key, null, 2)
    );

    if (key.name !== undefined) {
      await fs.promises.writeFile(
        join(this.path, key.name + '.json'),
        JSON.stringify(key, null, 2)
      );
    }
  }

  async getKey(identifier: string): Promise<EthereumKey> {
    return await EthereumKey.loadFromFile(
      join(this.path, identifier + '.json')
    );
  }
}
