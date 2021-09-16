# Getting started

**Bridge-CLI** is a tool that allows easy interaction with all instances of the rainbow bridge.

## Installation

```
npm i -g rainbow-bridge
```

## Usage

Select the bridge instance you want to interact with:

```
bridge use goerli
```

All available instances can be listed using

```
bridge list
```

## Ethereum wallet

There is an unsafe implementation of an Ethereum Wallet. This is used mostly to interact with Ethereum blockchain, but important private keys are not required. Check the wallet with:

```
bridge eth keys --help
```
