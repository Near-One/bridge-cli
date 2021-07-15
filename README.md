bridge
======

CLI to manage and verify the bridge between NEAR and Ethereum

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/bridge.svg)](https://npmjs.org/package/bridge)
[![Downloads/week](https://img.shields.io/npm/dw/bridge.svg)](https://npmjs.org/package/bridge)
[![License](https://img.shields.io/npm/l/bridge.svg)](https://github.com/mfornet/bridge/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g bridge
$ bridge COMMAND
running command...
$ bridge (-v|--version|version)
bridge/0.0.1 darwin-x64 node-v14.16.1
$ bridge --help [COMMAND]
USAGE
  $ bridge COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bridge hello [FILE]`](#bridge-hello-file)
* [`bridge help [COMMAND]`](#bridge-help-command)

## `bridge hello [FILE]`

describe the command here

```
USAGE
  $ bridge hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ bridge hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/mfornet/bridge/blob/v0.0.1/src/commands/hello.ts)_

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
<!-- commandsstop -->
