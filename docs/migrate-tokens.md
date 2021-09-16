# Bridge Tokens Migration

Guide to migrate bridged tokens. This migration may involve code upgrade and state upgrade.

The migration involves changing all token contracts "atomically". It is important that while the tokens are being upgraded no transfer is started. The reason for this, is that the function in the factory `deposit` assumes that the cross contract call to `mint` will never fail, but it can fail during the migration. To avoid this the high level plan is the following: Pause all transfers, migrate all bridge tokens, and unpause all transfers again.

**NOTE**: If the migration involves upgrading the binary, then the factory needs to be updated as well. This needs to be done first, so all new bridge tokens deployed uses the new binary.

Here is step by step about how to run the migration using `bridge-cli`. In order to run these steps, it is required to have Full Access Keys (FAK) for factory.

**NOTE**: Remember to select to bridge id first.

1. Pause the contract factory:

   ```
   bridge factory pause --deposit
   ```

   Notice that this step requires factory FAK. After this step all transfers from Ethereum to NEAR will gracefully fail during the period the contract is PAUSED. They can be finished when the contract is unpaused.

2. Generate a list with all deployed tokens

   ```
   bridge tokens list > tokens.txt
   ```

   See more details using:

   ```
   bridge tokens list -n -e
   ```

3. Migrate all tokens. That is, for each token deploy the new code and call migrate functions. There is a script that can be used as a guide for future migrations.

   ```
   bridge tools migrate-icons
   ```

4. Unpause the contract factory:

   ```
   bridge factory unpause --deposit
   ```
