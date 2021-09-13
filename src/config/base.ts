/// This code was generated automatically.
/// DO NOT EDIT
///
/// Regenerate it with:
/// bridge z:generate-config ~/.rainbow/ropsten/config.yml > config/base.ts
import * as assert from 'assert';

class BaseConfig {
  config: any;

  constructor(config: unknown) {
    this.config = config;
  }

  has(key: string, type = '') {
    assert.ok(
      key in this.config,
      `Error: Key ${key} not found in ${this.config}`
    );

    if (type !== '') {
      assert.strictEqual(
        typeof this.config[key],
        type,
        `Error: Key ${key}. Expected type ${type}. Found ${typeof this.config[
          key
        ]}`
      );
    }
  }
}
export class global1 extends BaseConfig {
  get bridgeId(): string {
    this.has('bridge_id', 'string');
    return this.config.bridge_id;
  }

  get version(): string {
    this.has('version', 'string');
    return this.config.version;
  }

  get layoutVersion(): number {
    this.has('layout_version', 'number');
    return this.config.layout_version;
  }

  get logLevel(): string {
    this.has('log_level', 'string');
    return this.config.log_level;
  }
}
export class near2 extends BaseConfig {
  get networkId(): string {
    this.has('network_id', 'string');
    return this.config.network_id;
  }

  get nodeUrl(): string {
    this.has('node_url', 'string');
    return this.config.node_url;
  }

  get indexer(): string {
    this.has('indexer', 'string');
    return this.config.indexer;
  }
}
export class ethereum3 extends BaseConfig {
  get nodeUrl(): string {
    this.has('node_url', 'string');
    return this.config.node_url;
  }
}
export class ethereum4 extends BaseConfig {
  get client(): string {
    this.has('client', 'string');
    return this.config.client;
  }

  get prover(): string {
    this.has('prover', 'string');
    return this.config.prover;
  }
}
export class near5 extends BaseConfig {
  get client(): string {
    this.has('client', 'string');
    return this.config.client;
  }

  get prover(): string {
    this.has('prover', 'string');
    return this.config.prover;
  }

  get tokenFactory(): string {
    this.has('token_factory', 'string');
    return this.config.token_factory;
  }
}
export class contracts6 extends BaseConfig {
  get ethereum(): ethereum4 {
    this.has('ethereum');
    return new ethereum4(this.config.ethereum);
  }

  get near(): near5 {
    this.has('near');
    return new near5(this.config.near);
  }
}
export class near2eth7 extends BaseConfig {
  get relayer(): string {
    this.has('relayer', 'string');
    return this.config.relayer;
  }

  get watchdog(): string {
    this.has('watchdog', 'string');
    return this.config.watchdog;
  }
}
export class eth2near8 extends BaseConfig {
  get relayer(): string {
    this.has('relayer', 'string');
    return this.config.relayer;
  }
}
export class monitor9 extends BaseConfig {
  get port(): number {
    this.has('port', 'number');
    return this.config.port;
  }

  get timeout(): number {
    this.has('timeout', 'number');
    return this.config.timeout;
  }
}
export default class GConfig extends BaseConfig {
  get global(): global1 {
    this.has('global');
    return new global1(this.config.global);
  }

  get near(): near2 {
    this.has('near');
    return new near2(this.config.near);
  }

  get ethereum(): ethereum3 {
    this.has('ethereum');
    return new ethereum3(this.config.ethereum);
  }

  get contracts(): contracts6 {
    this.has('contracts');
    return new contracts6(this.config.contracts);
  }

  get near2eth(): near2eth7 {
    this.has('near2eth');
    return new near2eth7(this.config.near2eth);
  }

  get eth2near(): eth2near8 {
    this.has('eth2near');
    return new eth2near8(this.config.eth2near);
  }

  get monitor(): monitor9 {
    this.has('monitor');
    return new monitor9(this.config.monitor);
  }
}
