import Pause from './pause';

export default class Unpause extends Pause {
  static description = 'Unpause factory';

  static flags = {
    ...Pause.flags
  };

  static args = [...Pause.args];

  async run(): Promise<void> {
    super.run(false);
  }
}
