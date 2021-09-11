import { Command, flags } from '@oclif/command';
import { Logger, TLogLevelName } from 'tslog';
import { Config } from './config';

export abstract class BridgeNoConfigCommand extends Command {
  args: any;

  flags: any;

  _config: any;

  _logger: any;

  static flags = {
    help: flags.help({ char: 'h' })
  };

  static args: { name: string; required: boolean; default: string }[] = [];

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

    this._logger = new Logger();
  }

  async loadConfig(): Promise<void> {
    const selected = await Config.selectedConfig();
    const that = this;

    if (selected.isSome()) {
      that._config = await Config.loadConfig(selected.unwrap());
      console.log(that.conf);

      that._logger = new Logger({
        minLevel: that.conf.global.logLevel as TLogLevelName
      });
    } else {
      that.logger.error(
        'Bridge not selected. Run `bridge use <bridge_id>`. Run `bridge list` to see available bridges.'
      );
      process.exit(1);
    }
  }
}
export abstract class BridgeCommand extends BridgeNoConfigCommand {
  async init() {
    await super.init();

    await this.loadConfig();
  }
}
