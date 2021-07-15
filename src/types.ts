import { Result, Ok, Err } from '@hqoss/monads';

/// TODO: Implement isValidAccountId
function isValidAccountId(_accountId: string) {
  return true;
}

export class AccountId {
  accountId: string;

  constructor(accountId: string) {
    this.accountId = accountId;
  }

  static parse(accountId: string): Result<AccountId, string> {
    switch (isValidAccountId(accountId)) {
      case true:
        return Ok(new AccountId(accountId));
      case false:
        return Err(`Invalid account id: ${accountId}`);
    }
  }
}
