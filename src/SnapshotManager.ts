import { Bytes, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { TokenDailyData, DailySnapshot } from "../generated/schema";
import { getUnixDays, getDateString } from "./utils";
import { Token } from "../generated/schema";
  
export class SnapshotManager {
    dayID: string;
    timestamp: BigInt;
  
    constructor(timestamp: BigInt) {
      this.timestamp = timestamp;
      this.dayID = getUnixDays(timestamp).toString();
    }
  
    private createDailySnapshot(): void {
      const snapshot = new DailySnapshot(this.dayID);
      snapshot.date = getDateString(<i32>this.timestamp.toI32());
      snapshot.tokenData = new Array<string>();
      snapshot.save();
    }
  
    public getOrCreateDailySnapshot(): DailySnapshot {
      let snapshot = DailySnapshot.load(this.dayID);
      if (snapshot == null) {
        this.createDailySnapshot();
        snapshot = DailySnapshot.load(this.dayID);
      }
      return snapshot as DailySnapshot;
    }
  
    private getTokenDailyData(token: Token, snapshot: DailySnapshot): TokenDailyData | null {
      for (let i = 0; i < snapshot.tokenData.length; i++) {
        let tokenData = TokenDailyData.load(snapshot.tokenData[i]);
        if (tokenData != null && tokenData.token == token.address) {
          return tokenData;
        }
      }
      return null;
    }
  
    public updateDailyData(token: Token, amount: BigInt, isDeposit: boolean): void {
      const snapshot = this.getOrCreateDailySnapshot();
      let tokenData = this.getTokenDailyData(token, snapshot);
  
      if (tokenData == null) {
        tokenData = new TokenDailyData(`${snapshot.date}-${token.symbol}`);
        tokenData.snapshot = snapshot.id;
        tokenData.token = token.address;
        tokenData.dailyDepositAmount = BigInt.fromI32(0);
        tokenData.dailyDepositCount = BigInt.fromI32(0);
        tokenData.dailyWithdrawAmount = BigInt.fromI32(0);
        tokenData.dailyWithdrawCount = BigInt.fromI32(0);
        tokenData.save();

        let data = snapshot.tokenData;
        if (data != null) {
          data.push(tokenData.id);
          snapshot.tokenData = data;
        }
      }
  
      if (isDeposit) {
        tokenData.dailyDepositAmount = tokenData.dailyDepositAmount.plus(amount);
        tokenData.dailyDepositCount = tokenData.dailyDepositCount.plus(BigInt.fromI32(1));
      } else {
        tokenData.dailyWithdrawAmount = tokenData.dailyWithdrawAmount.plus(amount);
        tokenData.dailyWithdrawCount = tokenData.dailyWithdrawCount.plus(BigInt.fromI32(1));
      }
  
      tokenData.save();
      snapshot.save();
    }
}