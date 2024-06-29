import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Deposit as DepositEvent, Withdraw as WithdrawEvent, TokenStakabilityChanged as TokenStakabilityChangedEvent } from "../generated/ZtakingPool/ZtakingPool";
import { Token, Staker, StakerTokenMetrics } from "../generated/schema";
import { getOrCreateToken } from "./utils";
import { SnapshotManager } from "./SnapshotManager";

function processToken(tokenAddress: Address, amount: BigInt, timestamp: BigInt, isDeposit: boolean): Token {
  let token = getOrCreateToken(tokenAddress, timestamp);
  if (isDeposit) {
    token.depositCount = token.depositCount.plus(BigInt.fromI32(1));
    token.totalDepositAmount = token.totalDepositAmount.plus(amount);
    token.currentStakedAmount = token.currentStakedAmount.plus(amount);
  } else {
    token.withdrawCount = token.withdrawCount.plus(BigInt.fromI32(1));
    token.totalWithdrawalAmount = token.totalWithdrawalAmount.plus(amount);
    token.currentStakedAmount = token.currentStakedAmount.minus(amount);
  }
  token.lastActivityAt = timestamp;
  token.save();

  return token as Token;
}

function processStaker(token: Token, stakerAddress: Address, amount: BigInt, isDeposit: boolean): void {
  let staker = Staker.load(stakerAddress.toHex());
  if (staker == null) {
    staker = new Staker(stakerAddress.toHex());
    staker.address = stakerAddress;
    staker.tokenMetrics = new Array<string>();

    token.uniqueStakerCount = token.uniqueStakerCount.plus(BigInt.fromI32(1));
    token.save();
  }
  
  let stakerTokenMetricsId = stakerAddress.toHex() + "-" + token.symbol;
  let stakerTokenMetrics = StakerTokenMetrics.load(stakerTokenMetricsId);
  if (stakerTokenMetrics == null) {
    stakerTokenMetrics = new StakerTokenMetrics(stakerTokenMetricsId);
    stakerTokenMetrics.staker = staker.id;
    stakerTokenMetrics.token = token.address;
    stakerTokenMetrics.depositCount = BigInt.fromI32(0);
    stakerTokenMetrics.depositAmount = BigInt.fromI32(0);
    stakerTokenMetrics.withdrawCount = BigInt.fromI32(0);
    stakerTokenMetrics.withdrawAmount = BigInt.fromI32(0);

    // Add to staker's tokenMetrics field
    let metrics = staker.tokenMetrics;
    if (metrics != null) {
      metrics.push(stakerTokenMetricsId);
      staker.tokenMetrics = metrics;
    }
  }
  
  if (isDeposit) {
    stakerTokenMetrics.depositCount = stakerTokenMetrics.depositCount.plus(BigInt.fromI32(1));
    stakerTokenMetrics.depositAmount = stakerTokenMetrics.depositAmount.plus(amount);
  } else {
    stakerTokenMetrics.withdrawCount = stakerTokenMetrics.withdrawCount.plus(BigInt.fromI32(1));
    stakerTokenMetrics.withdrawAmount = stakerTokenMetrics.withdrawAmount.plus(amount);
  }
  stakerTokenMetrics.save();
  staker.save();
}

function processSnapshot(token: Token, amount: BigInt, timestamp: BigInt, isDeposit: boolean): void {
  const snapshotManager = new SnapshotManager(timestamp);
  snapshotManager.updateDailyData(token, amount, isDeposit);
}

// Handle Deposit event
export function handleDeposit(event: DepositEvent): void {
  let tokenAddress = event.params.token;
  let stakerAddress = event.params.depositor;
  let amount = event.params.amount;
  let timestamp = event.block.timestamp;
  let token = processToken(tokenAddress, amount, timestamp, true);
  processStaker(token, stakerAddress, amount, true);
  processSnapshot(token, amount, timestamp, true);
}

// Handle Withdraw event
export function handleWithdraw(event: WithdrawEvent): void {
  let tokenAddress = event.params.token;
  let stakerAddress = event.params.withdrawer;
  let amount = event.params.amount;
  let timestamp = event.block.timestamp;
  let token = processToken(tokenAddress, amount, timestamp, false);
  processStaker(token, stakerAddress, amount, false);
  processSnapshot(token, amount, timestamp, false);
}

// Handle TokenStakabilityChanged event
export function handleTokenStakabilityChanged(event: TokenStakabilityChangedEvent): void {
  let token = getOrCreateToken(event.params.token, event.block.timestamp);
  token.enabled = event.params.enabled;
  token.lastActivityAt = event.block.timestamp;
  token.save();
}
