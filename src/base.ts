import { Command, flags } from '@oclif/command';
import * as fs from 'fs';
import * as YAML from 'yaml';
import { dirname, join } from 'path';
import { homedir } from 'os';
import { Logger, TLogLevelName } from 'tslog';
import { Config } from './config';

export const CONFIG_PATH = join(homedir(), '.rainbow');

export default abstract class BridgeCommand extends Command {
  args: any;

  flags: any;

  _config: any;

  _logger: any;

  static flags = {
    help: flags.help({ char: 'h' }),
    config: flags.string({ description: 'Path to config file' })
  };

  static args = [{ name: 'bridgeId', default: '_' }];

  get logger(): Logger {
    return this._logger as Logger;
  }

  get conf(): Config {
    return this._config as Config;
  }

  async init(): Promise<void> {
    // @ts-ignore
    const { args, flags } = this.parse(this.constructor);

    this.args = args;
    this.flags = flags;

    if (!(await this.loadConfig())) {
      throw new Error('Configuration not loaded');
    }
    if (this.conf === undefined) {
      this._logger = new Logger();
    } else {
      this._logger = new Logger({
        minLevel: this.conf.global.logLevel as TLogLevelName
      });
      this.logger.info('Config file', this.conf.config);
    }
  }

  async loadConfig(): Promise<boolean> {
    const initLog = new Logger();
    if (this.flags.config === undefined) {
      const bridges = await findConfigs();
      if (this.args.bridgeId === '_') {
        if (bridges.length >= 1) {
          this._config = new Config(await loadConfigRaw(bridges[0]));
          return true;
        }
        initLog.warn(
          'No bridge configuration found. Create new configuration file using:'
        );
        initLog.warn('bridge populate');
        return false;
      }
      if (this.args.bridgeId === undefined) {
        // TODO: Use default config file.
        // This case is when the command doesn't require bridge-id.
        initLog.warn('No config file loaded.');
        return true;
      }
      let found = false;

      /* eslint-disable no-await-in-loop */
      for (const configPath in bridges) {
        if (Object.prototype.hasOwnProperty.call(bridges, configPath)) {
          const config = new Config(await loadConfigRaw(bridges[configPath]));
          if (!found && config.global.bridgeId === this.args.bridgeId) {
            this._config = config;
            found = true;
            break;
          }
        }
      }
      /* eslint-enable no-await-in-loop */

      if (!found) {
        initLog.warn(
          `Bridge configuration for ${this.args.bridgeId} not found. Select one configuration:`
        );
        bridges.forEach(async (configPath) => {
          const config = new Config(await loadConfigRaw(configPath));
          initLog.warn(`- ${config.global.bridgeId}`);
        });
        return false;
      }
      return true;
    }
    this._config = new Config(await loadConfigRaw(this.flags.config));
    return true;
  }
}

/// Find list with all valid configuration files.
export async function findConfigs(path = CONFIG_PATH): Promise<string[]> {
  const result: string[] = [];
  (await fs.promises.readdir(path)).forEach((folder) => {
    const config = join(path, folder, 'config.yml');
    if (fs.existsSync(config)) result.push(config);
  });
  return result;
}

export async function loadConfigRaw(path: string): Promise<any> {
  const content = await fs.promises.readFile(path, 'utf8');
  return YAML.parse(content);
}

export function staticDir(): string {
  return join(dirname(__dirname), 'static');
}
