import { BridgeNoConfigCommand } from '../base';
import fetch from 'cross-fetch';
import { Config } from '../config';

const CONFIG_LIST =
  'https://api.github.com/repos/aurora-is-near/bridge-cli/contents/configuration';

export default class List extends BridgeNoConfigCommand {
  static description = 'List all bridges available';

  static flags = {
    ...BridgeNoConfigCommand.flags
  };

  static args = [...BridgeNoConfigCommand.args];

  async run(): Promise<void> {
    const selected = (await Config.selectedConfig()).unwrapOr('');

    (await listBridges()).forEach((bridge) => {
      if (bridge === selected) {
        bridge += ' <--';
      }
      console.log(`* ${bridge}`);
    });
  }
}

export async function listBridges(): Promise<string[]> {
  const response = await fetch(CONFIG_LIST);
  const data = await response.json();

  const result: string[] = [];

  data.forEach((config: any) => {
    let name: string = config.name;
    if (name.endsWith('.yml')) {
      name = name.substr(0, name.length - 4);
      result.push(name);
    }
  });

  return result;
}
