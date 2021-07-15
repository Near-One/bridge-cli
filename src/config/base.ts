/// This code was generated automatically.
/// Do not change it manually
///
/// To generate this code again use:
/// `bridge z:generate-config ~/.rainbow/ropsten/config.yml > config/base.ts`
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

  get ethNodeUrl(): string {
    this.has('eth_node_url', 'string');
    return this.config.eth_node_url;
  }

  get nearNodeUrl(): string {
    this.has('near_node_url', 'string');
    return this.config.near_node_url;
  }

  get logLevel(): string {
    this.has('log_level', 'string');
    return this.config.log_level;
  }
}
export class ethereum2 extends BaseConfig {
  get client(): string {
    this.has('client', 'string');
    return this.config.client;
  }

  get prover(): string {
    this.has('prover', 'string');
    return this.config.prover;
  }
}
export class near3 extends BaseConfig {
  get client(): string {
    this.has('client', 'string');
    return this.config.client;
  }

  get prover(): string {
    this.has('prover', 'string');
    return this.config.prover;
  }
}
export class contracts4 extends BaseConfig {
  get ethereum(): ethereum2 {
    this.has('ethereum');
    return new ethereum2(this.config.ethereum);
  }

  get near(): near3 {
    this.has('near');
    return new near3(this.config.near);
  }
}
export class near2eth5 extends BaseConfig {
  get relayer(): string {
    this.has('relayer', 'string');
    return this.config.relayer;
  }

  get watchdog(): string {
    this.has('watchdog', 'string');
    return this.config.watchdog;
  }
}
export class eth2near6 extends BaseConfig {
  get relayer(): string {
    this.has('relayer', 'string');
    return this.config.relayer;
  }
}
export class monitor7 extends BaseConfig {
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

  get contracts(): contracts4 {
    this.has('contracts');
    return new contracts4(this.config.contracts);
  }

  get near2eth(): near2eth5 {
    this.has('near2eth');
    return new near2eth5(this.config.near2eth);
  }

  get eth2near(): eth2near6 {
    this.has('eth2near');
    return new eth2near6(this.config.eth2near);
  }

  get monitor(): monitor7 {
    this.has('monitor');
    return new monitor7(this.config.monitor);
  }
}
