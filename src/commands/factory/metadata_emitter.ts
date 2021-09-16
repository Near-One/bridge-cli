import { BridgeCommand } from '../../base';
import { put0x, remove0x } from '../../utils/common';
import { ethers } from 'ethers';

export default class Pause extends BridgeCommand {
  static description = 'Pause factory';

  static flags = {
    ...BridgeCommand.flags
  };

  static args = [
    ...BridgeCommand.args,
    { name: 'address', required: false, default: '' }
  ];

  async run(): Promise<void> {
    const near = await this.conf.NEAR;
    const factory = await near.account(this.conf.contracts.near.tokenFactory);

    if (this.args.address === '') {
      let result = await factory.viewFunction(
        factory.accountId,
        'metadata_emitter',
        {}
      );

      if (result === null) {
        result = 'Not set';
        this.logger.info('Metadata Emitter Address not set');
      } else {
        this.logger.info(
          'Metadata Emitter Address:',
          this.conf.etherscan.address(put0x(result))
        );
      }
    } else {
      if (!ethers.utils.isAddress(this.args.address)) {
        this.logger.error('Invalid address:', this.args.address);
        process.exit(1);
      }

      const res = await factory.functionCall({
        contractId: factory.accountId,
        methodName: 'use_metadata_emitter',
        args: {
          metadata_emitter: remove0x(this.args.address.toLowerCase())
        }
      });

      this.logger.info(
        this.conf.nearExplorer.transaction(res.transaction.hash)
      );
    }
  }
}
