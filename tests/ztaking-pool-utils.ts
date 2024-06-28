import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
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
} from "../generated/ZtakingPool/ZtakingPool"

export function createBlocklistChangedEvent(
  migrator: Address,
  blocked: boolean
): BlocklistChanged {
  let blocklistChangedEvent = changetype<BlocklistChanged>(newMockEvent())

  blocklistChangedEvent.parameters = new Array()

  blocklistChangedEvent.parameters.push(
    new ethereum.EventParam("migrator", ethereum.Value.fromAddress(migrator))
  )
  blocklistChangedEvent.parameters.push(
    new ethereum.EventParam("blocked", ethereum.Value.fromBoolean(blocked))
  )

  return blocklistChangedEvent
}

export function createDepositEvent(
  eventId: BigInt,
  depositor: Address,
  token: Address,
  amount: BigInt
): Deposit {
  let depositEvent = changetype<Deposit>(newMockEvent())

  depositEvent.parameters = new Array()

  depositEvent.parameters.push(
    new ethereum.EventParam(
      "eventId",
      ethereum.Value.fromUnsignedBigInt(eventId)
    )
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("depositor", ethereum.Value.fromAddress(depositor))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return depositEvent
}

export function createEIP712DomainChangedEvent(): EIP712DomainChanged {
  let eip712DomainChangedEvent = changetype<EIP712DomainChanged>(newMockEvent())

  eip712DomainChangedEvent.parameters = new Array()

  return eip712DomainChangedEvent
}

export function createMigrateEvent(
  eventId: BigInt,
  user: Address,
  tokens: Array<Address>,
  destination: Address,
  migrator: Address,
  amounts: Array<BigInt>
): Migrate {
  let migrateEvent = changetype<Migrate>(newMockEvent())

  migrateEvent.parameters = new Array()

  migrateEvent.parameters.push(
    new ethereum.EventParam(
      "eventId",
      ethereum.Value.fromUnsignedBigInt(eventId)
    )
  )
  migrateEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  migrateEvent.parameters.push(
    new ethereum.EventParam("tokens", ethereum.Value.fromAddressArray(tokens))
  )
  migrateEvent.parameters.push(
    new ethereum.EventParam(
      "destination",
      ethereum.Value.fromAddress(destination)
    )
  )
  migrateEvent.parameters.push(
    new ethereum.EventParam("migrator", ethereum.Value.fromAddress(migrator))
  )
  migrateEvent.parameters.push(
    new ethereum.EventParam(
      "amounts",
      ethereum.Value.fromUnsignedBigIntArray(amounts)
    )
  )

  return migrateEvent
}

export function createOwnershipTransferStartedEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferStarted {
  let ownershipTransferStartedEvent = changetype<OwnershipTransferStarted>(
    newMockEvent()
  )

  ownershipTransferStartedEvent.parameters = new Array()

  ownershipTransferStartedEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferStartedEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferStartedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createSignerChangedEvent(newSigner: Address): SignerChanged {
  let signerChangedEvent = changetype<SignerChanged>(newMockEvent())

  signerChangedEvent.parameters = new Array()

  signerChangedEvent.parameters.push(
    new ethereum.EventParam("newSigner", ethereum.Value.fromAddress(newSigner))
  )

  return signerChangedEvent
}

export function createTokenStakabilityChangedEvent(
  token: Address,
  enabled: boolean
): TokenStakabilityChanged {
  let tokenStakabilityChangedEvent = changetype<TokenStakabilityChanged>(
    newMockEvent()
  )

  tokenStakabilityChangedEvent.parameters = new Array()

  tokenStakabilityChangedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  tokenStakabilityChangedEvent.parameters.push(
    new ethereum.EventParam("enabled", ethereum.Value.fromBoolean(enabled))
  )

  return tokenStakabilityChangedEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}

export function createWithdrawEvent(
  eventId: BigInt,
  withdrawer: Address,
  token: Address,
  amount: BigInt
): Withdraw {
  let withdrawEvent = changetype<Withdraw>(newMockEvent())

  withdrawEvent.parameters = new Array()

  withdrawEvent.parameters.push(
    new ethereum.EventParam(
      "eventId",
      ethereum.Value.fromUnsignedBigInt(eventId)
    )
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam(
      "withdrawer",
      ethereum.Value.fromAddress(withdrawer)
    )
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return withdrawEvent
}
