import { BridgeCommand } from '../../base';
import { keyStores } from 'near-api-js';
import { sha256 } from 'sha.js';
import * as bs58 from 'bs58';
import * as fs from 'fs';
import * as nearAPI from 'near-api-js';

export default class MigrateIcons extends BridgeCommand {
  static description = `Apply icon migration to all bridged tokens.`;

  static flags = {
    ...BridgeCommand.flags
  };

  static args = [
    ...BridgeCommand.args,
    {
      name: 'tokens',
      required: true,
      default: '',
      description:
        'List with all tokens address. Generate using `bridge tokens list`'
    },
    {
      name: 'contract',
      required: true,
      default: '',
      description: 'New bridge token contract'
    }
  ];

  async run(): Promise<void> {
    // load tokens from file
    const content = await fs.promises.readFile(this.args.tokens);
    const tokens = content.toString('utf8').trim().split('\n');

    const near = await this.conf.NEAR;
    const account = await near.account(this.conf.contracts.near.tokenFactory);

    // load contract
    const contractBinary = await fs.promises.readFile(this.args.contract);

    const hasher = new sha256();
    hasher.update(contractBinary);
    const hash = hasher.digest();
    const expected_contract_hash = bs58.encode(hash);

    this.logger.info('Expected contract:', expected_contract_hash);

    // The key for each bridge token is the same as the key for the factory.
    // Load the key to use it later.
    const key = await this.conf.nearKeyStore.getKey(
      this.conf.near.networkId,
      this.conf.contracts.near.tokenFactory
    );

    for (let token of tokens) {
      // Verify contract requires migration (check metadata)
      const targetContract = this.conf.bridgeTokenAccountIdFromAddress(token);

      this.logger.info(`>>> ${targetContract}`);

      let result;
      let requiresMigration = false;

      try {
        result = await account.viewFunction(targetContract, 'ft_metadata');
      } catch (e) {
        requiresMigration = true;
      }

      if (
        requiresMigration ||
        result.icon ===
          'https://near.org/wp-content/themes/near-19/assets/img/brand-icon.png'
      ) {
        this.logger.info('Migrating...');
      } else {
        this.logger.info('Already migrated');
        continue;
      }

      /// Set the key from the factory to sign tx on behalf of this account
      const keyStoreTmp = new keyStores.InMemoryKeyStore();
      keyStoreTmp.setKey(this.conf.nearNetworkId, targetContract, key);

      /// Use temporal near connection, in order to have access to temporal signer.
      const nearTmp = await nearAPI.connect({
        nodeUrl: this.conf.nearNodeUrl,
        networkId: this.conf.nearNetworkId,
        deps: {
          keyStore: keyStoreTmp
        }
      });

      const tokenAccount = await nearTmp.account(targetContract);
      const state = await tokenAccount.state();

      if (state.code_hash != expected_contract_hash) {
        this.logger.info(`Deploying bridge token...`);
        const res = await tokenAccount.deployContract(contractBinary);

        this.logger.info(
          this.conf.nearExplorer.transaction(res.transaction.hash)
        );
      }

      this.logger.info('Call migration method...');

      const res = await tokenAccount.functionCall({
        contractId: tokenAccount.accountId,
        methodName: 'migrate_nep_148_add_icon',
        args: {}
      });

      this.logger.info(
        this.conf.nearExplorer.transaction(res.transaction.hash)
      );
    }
  }
}
