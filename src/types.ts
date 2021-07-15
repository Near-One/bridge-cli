import { Result, Ok, Err } from '@hqoss/monads';

/// TODO: Implement isValidAccountId
function isValidAccountId(_accountId: string) {
  return true;
}

export type AccountId = string;

export function parseAccountId(accountId: string): Result<AccountId, string> {
  switch (isValidAccountId(accountId)) {
    case true:
      return Ok(accountId);
    case false:
      return Err(`Invalid Account Id ${accountId}`);
  }
}
