import { BridgeCommand } from '../../base';
import { remove0x } from '../../utils/common';
import { getMetadata } from './metadata';
import { BN } from 'bn.js';
import { flags } from '@oclif/command';
import * as fs from 'fs';

export default class SetMetadata extends BridgeCommand {
  static description = 'Set metadata of bridged ERC20 (NEP141) tokens';

  static flags = {
    ...BridgeCommand.flags,

    bulk: flags.boolean({
      char: 'b',
      description: 'Set metadata from file',
      default: false
    })
  };

  static args = [
    ...BridgeCommand.args,
    { name: 'token', required: true, default: '' }
  ];

  async run(): Promise<void> {
    const near = await this.conf.NEAR;
    const factory = await near.account(this.conf.contracts.near.metadataToken);

    let tokens = [this.args.token];

    if (this.flags.bulk) {
      const content = await fs.promises.readFile(this.args.token);
      tokens = content.toString('utf8').trim().split('\n');
    }

    let count = 0;
    let total = tokens.length;

    for (let token of tokens) {
      count += 1;

      this.logger.info(`Setting metadata (${count}/${total})`);
      this.logger.info(token);

      this.logger.info('Fetching metadata from Ethereum...');
      const metadataR = await getMetadata(token, this.conf.eth);

      if (metadataR.isErr()) {
        this.logger.warn('Failed to fetch metadata');
        this.logger.warn(metadataR.unwrapErr());
        continue;
      }

      const metadata = metadataR.unwrap();

      this.logger.info('Metadata:');
      this.logger.info(metadata);

      this.logger.info('Submitting metadata to NEAR...');
      const res = await factory.functionCall({
        contractId: this.conf.contracts.near.tokenFactory,
        methodName: 'set_metadata',
        args: {
          address: remove0x(token),
          name: metadata.name,
          symbol: metadata.symbol,
          decimals: metadata.decimals
        },
        gas: new BN('20000000000000')
      });

      this.logger.info(
        'DONE',
        this.conf.nearExplorer.transaction(res.transaction.hash)
      );
    }
  }
}
