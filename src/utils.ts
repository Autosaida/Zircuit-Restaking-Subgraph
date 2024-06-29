import { BigInt, Address, Bytes, ethereum } from "@graphprotocol/graph-ts"
import { ERC20 } from "../generated/ZtakingPool/ERC20"
import * as constants from "./constants"
import { Token } from "../generated/schema"

export class TokenParams {
  name: string
  symbol: string
  decimals: i32

  constructor(name: string, symbol: string, decimals: i32) {
    this.name = name
    this.symbol = symbol
    this.decimals = decimals
  }
}

export interface TokenInitializer {
  getTokenParams(address: Address): TokenParams
}

export class TokenInit implements TokenInitializer {
  getTokenParams(address: Address): TokenParams {
    const contract = ERC20.bind(address)
    let default_name = ""
    let default_symbol = ""
    let default_decimals = 0

    if (address == Bytes.fromHexString(constants.ETH_ADDRESS)) {
      default_name = constants.ETH_NAME
      default_symbol = constants.ETH_SYMBOL
      default_decimals = constants.DEFAULT_DECIMALS as i32
    }

    const name = readValue<string>(contract.try_name(), default_name)
    const symbol = readValue<string>(contract.try_symbol(), default_symbol)
    const decimals = readValue<i32>(contract.try_decimals(), default_decimals)

    return new TokenParams(name, symbol, decimals)
  }
}

// Helper function to read value or return default
function readValue<T>(result: ethereum.CallResult<T>, defaultValue: T): T {
  return result.reverted ? defaultValue : result.value
}

// Helper function to get the Unix day from a block timestamp
export function getUnixDays(timestamp: BigInt): i32 {
  return timestamp.toI32() / constants.SECONDS_PER_DAY;
}

// Helper function to get the Unix hour from a block timestamp
export function getUnixHours(timestamp: BigInt): i32 {
  return timestamp.toI32() / constants.SECONDS_PER_HOUR;
}


export function getDateString(timestamp: number): string {
  // Constants for time calculations
  const SECONDS_IN_A_DAY = 86400;
  const DAYS_IN_A_YEAR = 365;
  const DAYS_IN_A_LEAP_YEAR = 366;
  const SECONDS_IN_A_YEAR = SECONDS_IN_A_DAY * DAYS_IN_A_YEAR;
  const SECONDS_IN_A_LEAP_YEAR = SECONDS_IN_A_DAY * DAYS_IN_A_LEAP_YEAR;

  // Starting point: Unix epoch time (January 1, 1970)
  let year = 1970;
  let month = 0;
  let day = 1;

  // Days in each month
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Check for leap years and calculate the current year
  while (timestamp >= (isLeapYear(year) ? SECONDS_IN_A_LEAP_YEAR : SECONDS_IN_A_YEAR)) {
    timestamp -= isLeapYear(year) ? SECONDS_IN_A_LEAP_YEAR : SECONDS_IN_A_YEAR;
    year += 1;
  }

  // Adjust for leap year
  daysInMonth[1] = isLeapYear(year) ? 29 : 28;

  // Calculate the current month
  while (timestamp >= SECONDS_IN_A_DAY * daysInMonth[month]) {
    timestamp -= SECONDS_IN_A_DAY * daysInMonth[month];
    month += 1;
  }

  // Calculate the current day
  day += <i32>Math.floor(timestamp / SECONDS_IN_A_DAY);

  // Format the month and day to be two digits
  const formattedMonth = (month + 1).toString().padStart(2, '0');
  const formattedDay = day.toString().padStart(2, '0');

  // Return the formatted date
  return `${year}-${formattedMonth}-${formattedDay}`;
}

// Helper function to check if a year is a leap year
function isLeapYear(year: number): boolean {
  if (year % 4 === 0) {
    if (year % 100 === 0) {
      if (year % 400 === 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  } else {
    return false;
  }
}

export function getOrCreateToken(tokenAddress: Address, timestamp: BigInt): Token {
  let token = Token.load(tokenAddress.toHex());
  if (token == null) {
    let tokenInit = new TokenInit();
    let tokenParams = tokenInit.getTokenParams(Address.fromBytes(tokenAddress));

    token = new Token(tokenAddress.toHex());
    token.address = tokenAddress;
    token.enabled = false;
    token.name = tokenParams.name;
    token.symbol = tokenParams.symbol;
    token.decimals = tokenParams.decimals;
    token.depositCount = BigInt.fromI32(0);
    token.withdrawCount = BigInt.fromI32(0);
    token.totalDepositAmount = BigInt.fromI32(0);
    token.totalWithdrawalAmount = BigInt.fromI32(0);
    token.currentStakedAmount = BigInt.fromI32(0);
    token.lastActivityAt = timestamp;
    token.uniqueStakerCount = BigInt.fromI32(0);
    token.save();
  }
  return token as Token;
}