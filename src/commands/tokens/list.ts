import { BridgeCommand } from '../../base';
import { Connection } from 'postgresql-client';

export default class List extends BridgeCommand {
  static description = 'List all tokens deployed';

  static flags = {
    ...BridgeCommand.flags
  };

  static args = [...BridgeCommand.args];

  async run(): Promise<void> {
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
      console.log(info.args_json.address.toLowerCase());
    });

    await conn.close();
  }
}
