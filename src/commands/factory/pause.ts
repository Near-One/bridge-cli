import { BridgeCommand } from '../../base';
import { flags } from '@oclif/command';
import { Account } from 'near-api-js';
import * as borsh from 'borsh';
import BN from 'bn.js';

export default class Pause extends BridgeCommand {
  static description = 'Pause factory';

  static flags = {
    ...BridgeCommand.flags,

    status: flags.boolean({
      char: 's',
      description: 'Show the current paused status of the contract.'
    }),

    deploy: flags.boolean({
      char: 't',
      description: 'Pause deploy token'
    }),

    deposit: flags.boolean({
      char: 'd',
      description: 'Pause deposits'
    })
  };

  static args = [...BridgeCommand.args];

  async run(isPause = true): Promise<void> {
    const near = await this.conf.NEAR;
    const factory = await near.account(this.conf.contracts.near.tokenFactory);

    const status = await getPaused(factory);

    this.logger.info('Deploy paused:', status.deploy);
    this.logger.info('Deposit paused:', status.deposit);

    if (this.flags.status) {
      return;
    }

    if (this.flags.deploy) {
      status.deploy = isPause;
    }

    if (this.flags.deposit) {
      status.deposit = isPause;
    }

    const newMask = status.toMask();

    const res = await factory.functionCall({
      contractId: factory.accountId,
      methodName: 'set_paused',
      args: new U128({
        value: newMask
      }),
      stringify: (input) => {
        return Buffer.from(borsh.serialize(u128Schema, input));
      }
    });

    this.logger.info(this.conf.nearExplorer.transaction(res.transaction.hash));
  }
}

class FactoryPausedStatus {
  deploy: boolean;
  deposit: boolean;

  constructor(mask: number) {
    this.deploy = (mask & 1) !== 0;
    this.deposit = (mask & 2) !== 0;
  }

  toMask(): number {
    return Number(this.deploy) | (Number(this.deposit) << 1);
  }
}

async function getPaused(factory: Account): Promise<FactoryPausedStatus> {
  return await factory.viewFunction(
    factory.accountId,
    'get_paused',
    {},
    { parse: parseMask }
  );
}

class Assignable {
  constructor(properties: any) {
    Object.keys(properties).map((key) => {
      // @ts-ignore
      this[key] = properties[key];
    });
  }
}

class U128 extends Assignable {
  value?: BN;
}

const u128Schema = new Map([
  [U128, { kind: 'struct', fields: [['value', 'u128']] }]
]);

function parseMask(response: Uint8Array) {
  const result: U128 = borsh.deserialize(
    u128Schema,
    U128,
    Buffer.from(response)
  );
  return new FactoryPausedStatus(result.value!.toNumber());
}
