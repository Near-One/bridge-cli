# Rainbow Bridge CLI

CLI to manage and verify the bridge between NEAR and Ethereum

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/rainbow-bridge.svg)](https://npmjs.org/package/rainbow-bridge)
[![Downloads/week](https://img.shields.io/npm/dw/rainbow-bridge.svg)](https://npmjs.org/package/rainbow-bridge)
[![License](https://img.shields.io/npm/l/rainbow-bridge.svg)](https://github.com/mfornet/bridge/blob/master/package.json)

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
rainbow-bridge/0.0.3 darwin-x64 node-v14.16.1
$ bridge --help [COMMAND]
USAGE
  $ bridge COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`bridge help [COMMAND]`](#bridge-help-command)
* [`bridge monitor [BRIDGEID]`](#bridge-monitor-bridgeid)
* [`bridge populate [BRIDGEID]`](#bridge-populate-bridgeid)
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

## `bridge monitor [BRIDGEID]`

Expose bridge information through prometheus metrics

```
USAGE
  $ bridge monitor [BRIDGEID]

OPTIONS
  -h, --help       show CLI help
  -l, --list       List information tracked
  --config=config  Path to config file
```

_See code: [src/commands/monitor.ts](https://github.com/mfornet/bridge-cli/blob/v0.0.3/src/commands/monitor.ts)_

## `bridge populate [BRIDGEID]`

Create configuration files for active rainbow bridges

```
USAGE
  $ bridge populate [BRIDGEID]

OPTIONS
  -f, --force      Write configuration files, even if they already exists.
  -h, --help       show CLI help
  -s, --show       Display the configuration file without writing.
  --config=config  Path to config file
```

_See code: [src/commands/populate.ts](https://github.com/mfornet/bridge-cli/blob/v0.0.3/src/commands/populate.ts)_

## `bridge z:generate-config FILE`

Generate config/base.ts file from yml file automatically

```
USAGE
  $ bridge z:generate-config FILE

OPTIONS
  -h, --help       show CLI help
  --config=config  Path to config file
```

_See code: [src/commands/z/generate-config.ts](https://github.com/mfornet/bridge-cli/blob/v0.0.3/src/commands/z/generate-config.ts)_
<!-- commandsstop -->
