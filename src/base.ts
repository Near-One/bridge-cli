import { Command, flags } from '@oclif/command';
import * as fs from 'fs';
import * as YAML from 'yaml';
import { join } from 'path';
import { homedir } from 'os';
import { Logger } from 'tslog';
import { Config } from './config';

export default abstract class BridgeCommand extends Command {
  args: any;

  flags: any;

  _config: any;

  _logger: any;

  static flags = {
    help: flags.help({ char: 'h' }),
    config: flags.string({ description: 'Path to config file' })
  };

  static args = [{ name: 'bridgeId' }];

  get logger(): Logger {
    return this._logger as Logger;
  }

  get conf(): Config {
    return this._config as Config;
  }

  async init(): Promise<void> {
    this._logger = new Logger();

    // @ts-ignore
    const { args, flags } = this.parse(this.constructor);

    this.args = args;
    this.flags = flags;

    if (this.flags.config === undefined) {
      const bridges = await findConfigs(join(homedir(), '.rainbow'));

      if (bridges.length === 0) {
        throw new Error('No configuration found');
      } else if (bridges.length === 1) {
        this.flags.config = bridges[0];
      } else {
        throw new Error('Multiple configurations found');
      }
    }

    const content = await fs.promises.readFile(this.flags.config, 'utf8');
    this._config = new Config(YAML.parse(content));
    this.logger.info('Config file', this.conf.config);
  }
}

/// Find list with all valid configuration files.
async function findConfigs(path: string): Promise<string[]> {
  const result: string[] = [];
  (await fs.promises.readdir(path)).forEach((folder) => {
    const config = join(path, folder, 'config.yml');
    if (fs.existsSync(config)) result.push(config);
  });
  return result;
}
