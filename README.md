# Rainbow Bridge CLI

CLI to manage and verify the bridge between NEAR and Ethereum

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/rainbow-bridge.svg)](https://npmjs.org/package/rainbow-bridge)
[![Downloads/week](https://img.shields.io/npm/dw/rainbow-bridge.svg)](https://npmjs.org/package/rainbow-bridge)
[![License](https://img.shields.io/npm/l/rainbow-bridge.svg)](https://github.com/aurora-is-near/bridge/blob/master/package.json)

<!-- toc -->
* [Rainbow Bridge CLI](#rainbow-bridge-cli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g rainbow-bridge
$ bridge COMMAND
running command...
$ bridge (-v|--version|version)
rainbow-bridge/0.0.8 darwin-x64 node-v14.16.1
$ bridge --help [COMMAND]
USAGE
  $ bridge COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`bridge factory:pause`](#bridge-factorypause)
* [`bridge factory:unpause`](#bridge-factoryunpause)
* [`bridge help [COMMAND]`](#bridge-help-command)
* [`bridge list`](#bridge-list)
* [`bridge monitor`](#bridge-monitor)
* [`bridge tokens:list`](#bridge-tokenslist)
* [`bridge tokens:set_metadata`](#bridge-tokensset_metadata)
* [`bridge tools:generate-config FILE`](#bridge-toolsgenerate-config-file)
* [`bridge tools:migrate-icons TOKENS CONTRACT`](#bridge-toolsmigrate-icons-tokens-contract)
* [`bridge use BRIDGE_ID`](#bridge-use-bridge_id)

## `bridge factory:pause`

Pause factory

```
USAGE
  $ bridge factory pause

OPTIONS
  -d, --deposit  Pause deposits
  -h, --help     show CLI help
  -s, --status   Show the current paused status of the contract.
  -t, --deploy   Pause deploy token
```

_See code: [src/commands/factory/pause.ts](https://github.com/aurora-is-near/bridge-cli/blob/v0.0.8/src/commands/factory/pause.ts)_

## `bridge factory:unpause`

Unpause factory

```
USAGE
  $ bridge factory unpause

OPTIONS
  -d, --deposit  Pause deposits
  -h, --help     show CLI help
  -s, --status   Show the current paused status of the contract.
  -t, --deploy   Pause deploy token
```

_See code: [src/commands/factory/unpause.ts](https://github.com/aurora-is-near/bridge-cli/blob/v0.0.8/src/commands/factory/unpause.ts)_

## `bridge help [COMMAND]`

display help for bridge

```
USAGE
  $ bridge help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `bridge list`

List all bridges available

```
USAGE
  $ bridge list

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/list.ts](https://github.com/aurora-is-near/bridge-cli/blob/v0.0.8/src/commands/list.ts)_

## `bridge monitor`

Expose bridge information through prometheus metrics

```
USAGE
  $ bridge monitor

OPTIONS
  -h, --help  show CLI help
  -l, --list  List information tracked
```

_See code: [src/commands/monitor.ts](https://github.com/aurora-is-near/bridge-cli/blob/v0.0.8/src/commands/monitor.ts)_

## `bridge tokens:list`

List all tokens deployed

```
USAGE
  $ bridge tokens list

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/tokens/list.ts](https://github.com/aurora-is-near/bridge-cli/blob/v0.0.8/src/commands/tokens/list.ts)_

## `bridge tokens:set_metadata`

Set metadata of bridged ERC20 (NEP141) tokens

```
USAGE
  $ bridge tokens set_metadata

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/tokens/set_metadata.ts](https://github.com/aurora-is-near/bridge-cli/blob/v0.0.8/src/commands/tokens/set_metadata.ts)_

## `bridge tools:generate-config FILE`

Generate config/base.ts file from yml file automatically. This is used to have automatically fully typed config file.

```
USAGE
  $ bridge tools generate-config FILE

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/tools/generate-config.ts](https://github.com/aurora-is-near/bridge-cli/blob/v0.0.8/src/commands/tools/generate-config.ts)_

## `bridge tools:migrate-icons TOKENS CONTRACT`

Apply icon migration to all bridged tokens.

```
USAGE
  $ bridge tools migrate-icons TOKENS CONTRACT

ARGUMENTS
  TOKENS    List with all tokens address. Generate using `bridge tokens list`
  CONTRACT  New bridge token contract

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/tools/migrate-icons.ts](https://github.com/aurora-is-near/bridge-cli/blob/v0.0.8/src/commands/tools/migrate-icons.ts)_

## `bridge use BRIDGE_ID`

Select bridge to be used

```
USAGE
  $ bridge use BRIDGE_ID

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/use.ts](https://github.com/aurora-is-near/bridge-cli/blob/v0.0.8/src/commands/use.ts)_
<!-- commandsstop -->
