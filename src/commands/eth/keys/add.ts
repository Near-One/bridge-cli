import { BridgeCommand } from '../../../base';
import { EthereumKey } from '../../../ethKeyStore';

export default class AddKey extends BridgeCommand {
  static description = 'Add Ethereum Key into the Key Store.';

  static flags = {
    ...BridgeCommand.flags
  };

  static args = [
    ...BridgeCommand.args,
    { name: 'privateKey', required: true, default: '' },
    { name: 'name', required: false, default: '' }
  ];

  async run(): Promise<void> {
    let name = undefined;
    if (this.args.name !== '') {
      name = this.args.name;
    }

    const key = new EthereumKey(
      this.args.privateKey,
      name,
      this.conf.ethereumNetworkId
    );

    await this.conf.ethKeyStore.addKey(key);
  }
}
