import * as fs from 'fs';
import { BridgeCommand } from '../../base';
import { ethers } from 'ethers';

export default class UseKey extends BridgeCommand {
  static description = 'Add Ethereum Key into the Key Store.';

  static flags = {
    ...BridgeCommand.flags
  };

  static args = [
    ...BridgeCommand.args,
    { name: 'contractPath', required: true, default: '' }
  ];

  async run(): Promise<void> {
    const signer = await this.conf.ethereumSigner();

    const contractRaw = JSON.parse(
      (await fs.promises.readFile(this.args.contractPath)).toString()
    );

    const factory = new ethers.ContractFactory(
      contractRaw.abi,
      contractRaw.bytecode,
      signer
    );

    const contract = await factory.deploy();
    this.logger.info(
      'Deploying to:',
      this.conf.etherscan.address(contract.address)
    );

    const res = await contract.deployTransaction.wait();
    this.logger.info(
      'Deployed successfully in:',
      this.conf.etherscan.transaction(res.transactionHash)
    );
  }
}
