/// This file contains all metrics that are being tracked.
/// To track new metrics read comment starting with [1] and [2]
import { flags } from '@oclif/command';
import * as fs from 'fs';
import { join } from 'path';
import BridgeCommand, {
  CONFIG_PATH,
  findConfigs,
  loadConfigRaw,
  staticDir
} from '../base';
import { Config } from '../config';

export default class Init extends BridgeCommand {
  static description = 'Create configuration files for active rainbow bridges';

  static flags = {
    ...BridgeCommand.flags,
    show: flags.boolean({
      char: 's',
      description: 'Display the configuration file without writing.'
    }),
    force: flags.boolean({
      char: 'f',
      description: 'Write configuration files, even if they already exists.'
    })
  };

  static args = [...BridgeCommand.args];

  async run(): Promise<void> {
    const configs = await Promise.all(
      (
        await findConfigs()
      ).map(async (path) => {
        const config = new Config(await loadConfigRaw(path));
        return {
          bridgeId: config.global.bridgeId,
          path: path
        };
      })
    );

    (await fs.promises.readdir(staticDir())).forEach(async (path) => {
      path = join(staticDir(), path);
      const config = new Config(await loadConfigRaw(path));
      if (
        this.args.bridgeId === config.global.bridgeId ||
        this.args.bridgeId === '_'
      ) {
        if (this.flags.show) {
          this.logger.info(config);
        } else if (
          this.flags.force ||
          configs.find((value) => {
            return value.bridgeId === config.global.bridgeId;
          }) === undefined
        ) {
          let curPath = CONFIG_PATH;
          if (!fs.existsSync(curPath)) {
            await fs.promises.mkdir(curPath);
          }

          curPath = join(curPath, config.global.bridgeId);
          if (!fs.existsSync(curPath)) {
            await fs.promises.mkdir(curPath);
          }

          curPath = join(curPath, 'config.yml');
          await fs.promises.copyFile(path, curPath);
          this.logger.info(`Copied: ${path} to ${curPath}`);
        }
      }
    });
  }
}
