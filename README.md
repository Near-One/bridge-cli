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
rainbow-bridge/0.0.4 darwin-x64 node-v14.16.1
$ bridge --help [COMMAND]
USAGE
  $ bridge COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`bridge help [COMMAND]`](#bridge-help-command)
* [`bridge list`](#bridge-list)
* [`bridge monitor`](#bridge-monitor)
* [`bridge use BRIDGE_ID`](#bridge-use-bridge_id)
* [`bridge z:generate-config FILE`](#bridge-zgenerate-config-file)

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

_See code: [src/commands/list.ts](https://github.com/aurora-is-near/bridge-cli/blob/v0.0.4/src/commands/list.ts)_

## `bridge monitor`

Expose bridge information through prometheus metrics

```
USAGE
  $ bridge monitor

OPTIONS
  -h, --help  show CLI help
  -l, --list  List information tracked
```

_See code: [src/commands/monitor.ts](https://github.com/aurora-is-near/bridge-cli/blob/v0.0.4/src/commands/monitor.ts)_

## `bridge use BRIDGE_ID`

Select bridge to be used

```
USAGE
  $ bridge use BRIDGE_ID

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/use.ts](https://github.com/aurora-is-near/bridge-cli/blob/v0.0.4/src/commands/use.ts)_

## `bridge z:generate-config FILE`

Generate config/base.ts file from yml file automatically

```
USAGE
  $ bridge z:generate-config FILE

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/z/generate-config.ts](https://github.com/aurora-is-near/bridge-cli/blob/v0.0.4/src/commands/z/generate-config.ts)_
<!-- commandsstop -->
