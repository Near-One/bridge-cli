# Update metadata

Guide to set the metadata of one or more bridged tokens. The idea is that the name, symbol, and decimals can be used directly from the data that is available on Ethereum. Since icons are not available directly on ERC20 interface, but they are defined for NEP-141 (in particular in NEP-148 standard), there is a separate process to set the icon. In this guide we propose two ways to set the metadata of the tokens, one requiring admin privileges, and one that doesn't.

## Trustless

TODO: Write trustless section. Not implemented yet on bridge-cli

NOTE: Remember that metadata-emitter field on factory needs to be updated.

## Set Icon

Icons are not available on-chain. There exists some repositories with metadata from these contracts like [trustwallet/assets](https://github.com/trustwallet/assets/). To set icons on the rainbow bridge there is a fully trusted setup where icons needs to be submitted to [aurora-is-near/bridge-assets](https://github.com/aurora-is-near/bridge-assets) via a PR, and they will be updated automatically once the PR is merged. Notice that these PRs are merged by aurora team.

To set one icon use:

```
tokens set_icon --bulk tokens.txt
```

or to set several icons in bulk:

```
tokens set_icon --bulk tokens.txt
```

## Trusted setup

In the trusted setup the metadata is downloaded directly from Ethereum off chain. This should be done by a **trusted third party** that must have Full Access Keys for the contract factory. Use `bridge-cli` to update the metadata following the next steps:

**NOTE**: Remember to select to bridge id first.

1.  Generate a list with all deployed tokens

    ```
    bridge tokens list > tokens.txt
    ```

    See more details using:

    ```
    bridge tokens list -n -e
    ```

2.  Set the metadata using bulk mode:

    ```
    bridge tokens set_metadata --bulk tokens.txt
    ```
