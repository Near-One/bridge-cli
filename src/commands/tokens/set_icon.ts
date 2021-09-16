import { BN } from 'bn.js';
import { BridgeCommand } from '../../base';
import { flags } from '@oclif/command';
import { remove0x } from '../../utils/common';
import * as fs from 'fs';
import fetch from 'cross-fetch';

// TODO: Use bridge assets (https://github.com/aurora-is-near/bridge-assets/)
const ASSET_URL =
  'https://api.github.com/repos/trustwallet/assets/contents/blockchains/ethereum/assets';

export default class SetMetadata extends BridgeCommand {
  static description = 'Set icons of bridged ERC20 (NEP141) tokens';

  static flags = {
    ...BridgeCommand.flags,

    bulk: flags.boolean({
      char: 'b',
      description: 'Set icons from file',
      default: false
    })
  };

  static args = [
    ...BridgeCommand.args,
    { name: 'token', required: true, default: '' }
  ];

  async run(): Promise<void> {
    const near = await this.conf.NEAR;
    const factory = await near.account(this.conf.contracts.near.tokenFactory);

    let tokens = [this.args.token];

    if (this.flags.bulk) {
      const content = await fs.promises.readFile(this.args.token);
      tokens = content.toString('utf8').trim().split('\n');
    }

    let count = 0;
    let total = tokens.length;

    for (let token of tokens) {
      count += 1;

      this.logger.info(`---`);
      this.logger.info(`Setting icons (${count}/${total})`);
      this.logger.info(token);

      this.logger.info('Fetching icon...');

      // TODO: Use real address here (this is USDC)
      const HARDCODED_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F';

      const response = await fetch(ASSET_URL + '/' + HARDCODED_ADDRESS);
      const data = await response.json();

      let target = undefined;

      for (let item of data) {
        if (item.name === 'logo.png' || item.name === 'logo.svg') {
          target = item;
          break;
        }
      }

      if (target === undefined) {
        this.logger.warn('Icon not found');
        continue;
      }

      // See example of output from api.github.com:
      // https://api.github.com/repos/trustwallet/assets/contents/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F
      const imageResult = await fetch(target.download_url);
      const imageBytes = Buffer.from(await imageResult.arrayBuffer());
      const imageB64 = imageBytes.toString('base64');

      const extension = target.name.split('.').pop();

      // Using Data URLs
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
      let urlData = `data:image/${extension};base64,${imageB64}`;

      this.logger.info('Submitting icon to NEAR...');
      const res = await factory.functionCall({
        contractId: factory.accountId,
        methodName: 'set_metadata',
        args: {
          address: remove0x(token),
          icon: urlData
        },
        gas: new BN('35000000000000')
      });

      this.logger.info(
        'DONE:',
        this.conf.nearExplorer.transaction(res.transaction.hash)
      );
    }
  }
}
