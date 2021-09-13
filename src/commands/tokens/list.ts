import { BridgeCommand } from '../../base';
import { Connection } from 'postgresql-client';
import { flags } from '@oclif/command';
export default class List extends BridgeCommand {
  static description = 'List all tokens deployed';

  static flags = {
    ...BridgeCommand.flags,
    raw: flags.boolean({
      char: 'r',
      default: false,
      description: 'raw token address'
    }),
    near: flags.boolean({
      char: 'n',
      default: false,
      description: 'link to NEAR Explorer'
    }),
    etherscan: flags.boolean({
      char: 'e',
      default: false,
      description: 'link to etherscan'
    })
  };

  static args = [...BridgeCommand.args];

  async run(): Promise<void> {
    if (!this.flags.raw && !this.flags.etherscan && !this.flags.near)
      this.flags.raw = true;

    const conn = new Connection(this.conf.near.indexer);
    await conn.connect();

    const QUERY = `SELECT args FROM public.action_receipt_actions
    WHERE receipt_receiver_account_id = '${this.conf.contracts.near.tokenFactory}'
    AND args ->> 'method_name' = 'deploy_bridge_token'
    ORDER BY receipt_included_in_block_timestamp ASC`;

    const result = await conn.query(QUERY);

    result.rows?.forEach((row: Buffer[]) => {
      const text = row[0].slice(1, row[0].length).toString('utf8');
      const info = JSON.parse(text);
      this.printToken(info.args_json.address.toLowerCase());
    });

    await conn.close();
  }

  printToken(token: string) {
    const row = [];

    if (this.flags.raw) {
      row.push(token);
    }

    if (this.flags.near) {
      const contract = `${token}.${this.conf.contracts.near.tokenFactory}`;
      row.push(this.conf.nearExplorer.account(contract));
    }

    if (this.flags.etherscan) {
      row.push(this.conf.etherscan.address(token));
    }

    console.log(row.join(', '));
  }
}
