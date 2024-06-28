import {
  BlocklistChanged as BlocklistChangedEvent,
  Deposit as DepositEvent,
  EIP712DomainChanged as EIP712DomainChangedEvent,
  Migrate as MigrateEvent,
  OwnershipTransferStarted as OwnershipTransferStartedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Paused as PausedEvent,
  SignerChanged as SignerChangedEvent,
  TokenStakabilityChanged as TokenStakabilityChangedEvent,
  Unpaused as UnpausedEvent,
  Withdraw as WithdrawEvent
} from "../generated/ZtakingPool/ZtakingPool"
import {
  BlocklistChanged,
  Deposit,
  EIP712DomainChanged,
  Migrate,
  OwnershipTransferStarted,
  OwnershipTransferred,
  Paused,
  SignerChanged,
  TokenStakabilityChanged,
  Unpaused,
  Withdraw
} from "../generated/schema"

export function handleBlocklistChanged(event: BlocklistChangedEvent): void {
  let entity = new BlocklistChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.migrator = event.params.migrator
  entity.blocked = event.params.blocked

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDeposit(event: DepositEvent): void {
  let entity = new Deposit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.eventId = event.params.eventId
  entity.depositor = event.params.depositor
  entity.token = event.params.token
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEIP712DomainChanged(
  event: EIP712DomainChangedEvent
): void {
  let entity = new EIP712DomainChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMigrate(event: MigrateEvent): void {
  let entity = new Migrate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.eventId = event.params.eventId
  entity.user = event.params.user
  entity.tokens = event.params.tokens
  entity.destination = event.params.destination
  entity.migrator = event.params.migrator
  entity.amounts = event.params.amounts

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferStarted(
  event: OwnershipTransferStartedEvent
): void {
  let entity = new OwnershipTransferStarted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePaused(event: PausedEvent): void {
  let entity = new Paused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSignerChanged(event: SignerChangedEvent): void {
  let entity = new SignerChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newSigner = event.params.newSigner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokenStakabilityChanged(
  event: TokenStakabilityChangedEvent
): void {
  let entity = new TokenStakabilityChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.enabled = event.params.enabled

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUnpaused(event: UnpausedEvent): void {
  let entity = new Unpaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdraw(event: WithdrawEvent): void {
  let entity = new Withdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.eventId = event.params.eventId
  entity.withdrawer = event.params.withdrawer
  entity.token = event.params.token
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
