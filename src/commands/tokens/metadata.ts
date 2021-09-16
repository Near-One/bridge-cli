import { BridgeCommand } from '../../base';
import { ethers } from 'ethers';
import { flags } from '@oclif/command';
import { remove0x } from '../../utils/common';
import { Result, Ok, Err } from '@hqoss/monads';

const ERC20_ABI = [
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)'
];

export default class GetMetadata extends BridgeCommand {
  static description = 'Check metadata from ERC20 tokens';

  static flags = {
    ...BridgeCommand.flags,

    erc20: flags.boolean({
      char: 'e',
      description: 'Show metadata from ERC20',
      default: false
    })
  };

  static args = [
    ...BridgeCommand.args,
    { name: 'tokenAddress', required: true, default: '' }
  ];

  async run(): Promise<void> {
    if (this.flags.erc20) {
      const metadata = await (
        await getMetadata(this.args.tokenAddress, this.conf.eth)
      ).unwrap();
      this.logger.info(metadata);
    } else {
      let targetAccount = this.args.tokenAddress;

      if (ethers.utils.isAddress(this.args.tokenAddress)) {
        targetAccount = this.conf.bridgeTokenAccountIdFromAddress(
          remove0x(targetAccount)
        );
      }

      const near = await this.conf.NEAR;
      const account = await near.account(targetAccount);
      const result = await account.viewFunction(
        account.accountId,
        'ft_metadata',
        {}
      );

      this.logger.info(result);
    }
  }
}

export class Metadata {
  decimals: number;
  symbol: string;
  name: string;

  constructor(decimals: number, symbol: string, name: string) {
    this.decimals = decimals;
    this.symbol = symbol;
    this.name = name;
  }
}

export async function getMetadata(
  token: string,
  provider: ethers.providers.Provider
): Promise<Result<Metadata, string>> {
  const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
  const promises = [erc20.decimals(), erc20.symbol(), erc20.name()];
  try {
    const result = await Promise.all(promises);
    return Ok(new Metadata(result[0], result[1], result[2]));
  } catch (e: any) {
    return Err(e.toString());
  }
}
