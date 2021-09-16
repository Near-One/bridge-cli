import * as fs from 'fs';
import { BridgeCommand } from '../../../base';

export default class UseKey extends BridgeCommand {
  static description = 'Add Ethereum Key into the Key Store.';

  static flags = {
    ...BridgeCommand.flags
  };

  static args = [
    ...BridgeCommand.args,
    { name: 'identifier', required: true, default: '' }
  ];

  async run(): Promise<void> {
    await fs.promises.writeFile(
      this.conf.selectedEthereumKeyFileName,
      this.args.identifier
    );
  }
}
