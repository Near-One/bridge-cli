import { BN } from 'bn.js';
import { BridgeCommand } from '../../base';
import { remove0x } from '../../utils/common';
import * as fs from 'fs';
import { join } from 'path';

export default class SetMetadata extends BridgeCommand {
  static description =
    'Set icons of bridged ERC20 (NEP141) tokens. Pass the path to https://github.com/aurora-is-near/bridge-assets/tree/master/tokens on your local machine.';

  static flags = {
    ...BridgeCommand.flags
  };

  static args = [
    ...BridgeCommand.args,
    { name: 'tokens', required: true, default: '' }
  ];

  async run(): Promise<void> {
    const near = await this.conf.NEAR;
    const metadata = await near.account(this.conf.contracts.near.metadataToken);

    let files = await fs.promises.readdir(this.args.tokens);

    let count = 0;
    for (let file of files) {
      if (file.endsWith('.json') && !file.startsWith('EXAMPLE')) {
        count += 1;

        this.logger.info(`---`);
        this.logger.info(`Setting icons (${count})`);

        const jsonContent = (
          await fs.promises.readFile(join(this.args.tokens, file))
        ).toString('utf8');

        const info = JSON.parse(jsonContent);

        const address = remove0x(info.ethereum_address.toLowerCase());
        const dataUrl = info.icon;

        this.logger.info('Submitting icon to NEAR...');
        const res = await metadata.functionCall({
          contractId: this.conf.contracts.near.tokenFactory,
          methodName: 'set_metadata',
          args: {
            address: address,
            icon: dataUrl
          },
          gas: new BN('35000000000000')
        });

        this.logger.info(
          this.conf.nearExplorer.transaction(res.transaction.hash)
        );
      }
    }
  }
}
