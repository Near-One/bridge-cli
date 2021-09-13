import { BridgeCommand } from '../../base';

export default class SetMetadata extends BridgeCommand {
  static description = 'Set metadata of bridged ERC20 (NEP141) tokens';

  static flags = {
    ...BridgeCommand.flags
  };

  static args = [...BridgeCommand.args];

  async run(): Promise<void> {}
}
