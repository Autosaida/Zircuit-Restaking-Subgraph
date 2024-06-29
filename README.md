# Zircuit Restaking Subgraph

## Introduction

[Zircuit](https://docs.zircuit.com/) is a fully EVM-compatible zero-knowledge rollup that leverages the potential of web3. By combining proven infrastructure with zero-knowledge proofs, Zircuit offers developers high performance and security. Currently in its Testnet phase, Zircuit enables restaking of assets such as ETH, BTC, LSTs, and LRTs, allowing users to earn yields while enhancing liquidity.

To effectively track and analyze Zircuit's restaking activities, I have published a subgraph for the [Zircuit restaking contract](https://etherscan.io/address/0xf047ab4c75cebf0eb9ed34ae2c186f3611aeafa6) using [The Graph](https://thegraph.com/). You can use the [QUERY URL](https://gateway-arbitrum.network.thegraph.com/api/[api-key]/subgraphs/id/3mYuBS8TjpdsUBeRaUcBS4E6ayM6puUFNgisiQLzXUPF) to request data or test it directly in the [Playground](https://thegraph.com/explorer/subgraphs/3mYuBS8TjpdsUBeRaUcBS4E6ayM6puUFNgisiQLzXUPF?view=Query&chain=arbitrum-one).

## Core Events

Despite containing many other events like `SignerChanged`, `OwnershipTransferred`, etc., we focus on the following core events:

- **Deposit**: Represents a deposit of a token into the staking contract.
  
- **Withdraw**: Represents a withdrawal of a token from the staking contract.
  
- **TokenStakabilityChanged**: Represents the change in stakability status of a token.

## Entities

Based on these events, we further construct the following entities:

- **Staker**
  - Represents a user who participates in staking.
  - Fields:
    - `id`: Unique identifier.
    - `address`: Address of the staker.
    - `tokenMetrics`: List of StakerTokenMetrics IDs representing deposit and withdraw metrics for each token by this staker.
    
- **StakerTokenMetrics**
  - Represents metrics for a specific token staked by a staker.
  - Fields:
    - `id`: Unique identifier.
    - `staker`: Reference to the Staker entity.
    - `token`: Token address.
    - `depositCount`: Deposit count for the token by this staker.
    - `depositAmount`: Deposit amount for the token by this staker.
    - `withdrawCount`: Withdraw count for the token by this staker.
    - `withdrawAmount`: Withdraw amount for the token by this staker.

- **Token**
  - Represents a token that can be staked.
  - Fields:
    - `id`: Unique identifier.
    - `address`: Smart contract address of the token.
    - `enabled`: Indicates whether the token is enabled for staking now.
    - `name`: Name of the token.
    - `symbol`: Symbol of the token.
    - `decimals`: The number of decimal places this token uses.
    - `depositCount`: Total count of deposit transactions involving this token.
    - `withdrawCount`: Total count of withdrawal transactions involving this token.
    - `totalDepositAmount`: Total amount of this token deposited.
    - `totalWithdrawalAmount`: Total amount of this token withdrawn.
    - `currentStakedAmount`: Current staked amount of this token.
    - `lastActivityAt`: Timestamp of the last activity involving this token.
    - `uniqueStakerCount`: Number of unique stakers that have staked this token.

- **DailySnapshot**
  - Represents daily snapshots of staking activities.
  - Fields:
    - `id`: Unique identifier.
    - `date`: Date in YYYY-MM-DD format.
    - `tokenData`: List of TokenDailyData IDs representing daily metrics for each token.

- **TokenDailyData**
  - Represents daily metrics for a specific token.
  - Fields:
    - `id`: Unique identifier.
    - `snapshot`: Reference to the DailySnapshot entity.
    - `token`: Token address.
    - `dailyDepositAmount`: Total deposit amount for this token on this day.
    - `dailyDepositCount`: Total deposit count for this token on this day.
    - `dailyWithdrawAmount`: Total withdraw amount for this token on this day.
    - `dailyWithdrawCount`: Total withdraw count for this token on this day.

## Examples

### Query Token Information

To get information about the token `pufETH`, you can use the following query:

```graphql
{
  tokens(where: {symbol: "pufETH"}) {
    address
    name
    symbol
    decimals
    enabled
    currentStakedAmount
    uniqueStakerCount
    lastActivityAt
    depositCount
    totalDepositAmount
    withdrawCount
    totalWithdrawalAmount
  }
}
```

Example response:

```json
{
  "data": {
    "tokens": [
      {
        "address": "0xd9a442856c234a39a81a089c06451ebaa4306a72",
        "currentStakedAmount": "65032632061864136684525",
        "decimals": 18,
        "depositCount": "9055",
        "enabled": true,
        "lastActivityAt": "1713590051",
        "name": "pufETH",
        "symbol": "pufETH",
        "totalDepositAmount": "70823122337214915269247",
        "totalWithdrawalAmount": "5790490275350778584722",
        "uniqueStakerCount": "6433",
        "withdrawCount": "450"
      }
    ]
  }
}
```

This response shows detailed information about the `pufETH` token, including its address, name, symbol, decimals, enabled status, current staked amount, unique staker count, last activity timestamp, deposit count, total deposit amount, withdrawal count, and total withdrawal amount. Because token data is updated in real-time, it may not match your query results.

### Query Staker Information

To query a specific user's staking activities, use the following query:

```graphql
{
  stakers(where: {address: "0x000ac1c7454fb12372e3fcfab2a36335db5e8e9e"}) {
    id
    address
    tokenMetrics
  }
}
```

Example response:

```json
{
  "data": {
    "stakers": [
      {
        "address": "0x000ac1c7454fb12372e3fcfab2a36335db5e8e9e",
        "id": "0x000ac1c7454fb12372e3fcfab2a36335db5e8e9e",
        "tokenMetrics": [
          "0x000ac1c7454fb12372e3fcfab2a36335db5e8e9e-ezETH",
          "0x000ac1c7454fb12372e3fcfab2a36335db5e8e9e-pufETH"
        ]
      }
    ]
  }
}
```

This shows that the user with address `0x000ac1c7454fb12372e3fcfab2a36335db5e8e9e` has participated in staking `ezETH` and `pufETH`.

To query the specific metrics for `ezETH`:

```graphql
{
  stakerTokenMetrics(where: {id: "0x000ac1c7454fb12372e3fcfab2a36335db5e8e9e-ezETH"}) {
    id
    depositAmount
    depositCount
    withdrawAmount
    withdrawCount
  }
}
```

Example response:

```json
{
  "data": {
    "stakerTokenMetrics": {
      "depositAmount": "1500000000000000000",
      "depositCount": "1",
      "id": "0x000ac1c7454fb12372e3fcfab2a36335db5e8e9e-ezETH",
      "withdrawAmount": "0",
      "withdrawCount": "0"
    }
  }
}
```

This shows that the user has deposited `1.5 ezETH` once and has not withdrawn any `ezETH` so far.

### Query Daily Snapshots

To query daily staking activities:

```graphql
{
  dailySnapshots(where: {date: "2024-04-01"}) {
    date
    tokenData
  }
}
```

Example response:

```json
{
  "data": {
    "dailySnapshots": [
      {
        "date": "2024-04-01",
        "tokenData": [
          "2024-04-01-rsETH",
          "2024-04-01-weETH",
          "2024-04-01-ezETH",
          "2024-04-01-rswETH",
          "2024-04-01-swETH",
          "2024-04-01-WETH",
          "2024-04-01-wstETH",
          "2024-04-01-mswETH",
          "2024-04-01-USDe",
          "2024-04-01-mstETH",
          "2024-04-01-mwBETH",
          "2024-04-01-cSTONE"
        ]
      }
    ]
  }
}
```

This shows the tokens involved in staking activities on April 1, 2024.

To query the specific daily metrics for `weETH` on that day:

```graphql
{
  tokenDailyDatas(where: {id: "2024-04-01-weETH"}) {
    id
    token
    dailyDepositCount
    dailyDepositAmount
    dailyWithdrawCount
    dailyWithdrawAmount
  }
}
```

Example response:

```json
{
  "data": {
    "tokenDailyDatas": [
      {
        "id": "2024-04-01-weETH",
        "token": "0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee",
        "dailyDepositCount": "340",
        "dailyDepositAmount": "3718732977896839109911",
        "dailyWithdrawCount": "38",
        "dailyWithdrawAmount": "279344676573155654633",
      }
    ]
  }
}
```

This response indicates that on April 1, 2024, `weETH` had 340 deposit transactions totaling `3718732977896839109911` units, and 38 withdrawal transactions totaling `279344676573155654633` units.


### Acknowledgments

Thanks to The Graph team for their support in bringing this subgraph to life. 🙏✨

