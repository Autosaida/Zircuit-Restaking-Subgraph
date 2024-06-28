import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { BlocklistChanged } from "../generated/schema"
import { BlocklistChanged as BlocklistChangedEvent } from "../generated/ZtakingPool/ZtakingPool"
import { handleBlocklistChanged } from "../src/ztaking-pool"
import { createBlocklistChangedEvent } from "./ztaking-pool-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let migrator = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let blocked = "boolean Not implemented"
    let newBlocklistChangedEvent = createBlocklistChangedEvent(
      migrator,
      blocked
    )
    handleBlocklistChanged(newBlocklistChangedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("BlocklistChanged created and stored", () => {
    assert.entityCount("BlocklistChanged", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "BlocklistChanged",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "migrator",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "BlocklistChanged",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "blocked",
      "boolean Not implemented"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
