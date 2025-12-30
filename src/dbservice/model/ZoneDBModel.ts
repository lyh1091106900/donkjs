/*
 * @Author: lyh
 * @Github:
 * @FilePath: /InstanceServer/src/dbservice/model/ZoneDBModel.ts
 * @Date: 2024-10-31 17:17:38
 * @LastEditors: lyh
 * @LastEditTime: 2025-01-03 11:56:32
 */
import { Connection } from "mongoose";
// import { Counter } from "../../entity/count.entity";
// import { IMail } from "../../entity/mail.entity";
// import { IPlayer } from "../../entity/player.entity";
// import { IFriend } from "../../entity/player.friend.entity";
// import { IPlayerGameInfoBase } from "../../entity/player.gameinfo.entity";
// import { IHeroBag } from "../../entity/player.hero.bag.entity";
// import { IMailStatus } from "../../entity/player.mail.status.entity";
// import { IPropBag } from "../../entity/player.props.entity";
import { gameLogger } from "../../util/logger";

export class ZoneModelManager {
  private connection: Connection;
  // private propBagModel!: Model<IPropBag>;
  // private playerModel!: Model<IPlayer>;
  // private mailModel!: Model<IMail>;
  // private mailStatusModel!: Model<IMailStatus>;
  // private friendModel!: Model<IFriend>;
  // private heroBagModel!: Model<IHeroBag>;
  // private counterModel!: Model<Counter>;
  // private gameInfoModel!: Model<IPlayerGameInfoBase>;

  constructor(connection: Connection) {
    this.connection = connection;
    this.registerModels();
  }
  public async stopConnection() {
    return this.connection.destroy();
  }
  // 注册所有的模型
  private registerModels() {
    // this.counterModel = this.connection.model<Counter>('Counter', CounterSchema);
    // this.counterModel.createIndexes();
    // this.propBagModel = this.connection.model<IPropBag>('PropBags', PropBagSchema);
    // this.playerModel = this.connection.model<IPlayer>('Player', PlayerSchema);
    // this.playerModel.createIndexes();
    // // MailSchema.plugin(AutoIncrement, { inc_field: 'mailId', start_seq: 10000000000 });
    // this.mailModel = this.connection.model<IMail>('Mail', MailSchema);
    // this.mailModel.createIndexes();
    // this.mailStatusModel = this.connection.model<IMailStatus>('MailStatus', MailStatusSchema);
    // this.mailStatusModel.createIndexes();
    // this.friendModel = this.connection.model<IFriend>('Friend', FriendSchema);
    // this.friendModel.createIndexes();
    // this.heroBagModel = this.connection.model<IHeroBag>('HeroBag', HeroBagSchema);
    // this.heroBagModel.createIndexes();
    // this.gameInfoModel = this.connection.model<IPlayerGameInfoBase>(
    //   'GameInfo',
    //   PlayerGameInfoSchema
    // );
    // this.gameInfoModel.createIndexes();
  }

  // // 获取模型
  // public getPropBagModel(): Model<IPropBag> {
  //   return this.propBagModel;
  // }
  // public getPlayerModel(): Model<IPlayer> {
  //   return this.playerModel;
  // }
  // public getMailModel(): Model<IMail> {
  //   return this.mailModel;
  // }
  // public getMailStatusModel(): Model<IMailStatus> {
  //   return this.mailStatusModel;
  // }
  // public getFriendModel(): Model<IFriend> {
  //   return this.friendModel;
  // }
  // public getGameInfoModel(): Model<IPlayerGameInfoBase> {
  //   return this.gameInfoModel;
  // }
  // public getHeroBagModel(): Model<IHeroBag> {
  //   return this.heroBagModel;
  // }

  // public getCounterModel(): Model<Counter> {
  //   return this.counterModel;
  // }

  // 如果有其他模型，可以添加类似的方法
}

const zoneModelManagerMap: Map<string, ZoneModelManager> = new Map();

// 导出一个函数用于初始化 zoneModelManager
export function initializeZoneModel(connection: Connection, zone: string) {
  gameLogger.info(`Initialize zone model for zone ${zone}.`);
  const zoneModelManager = new ZoneModelManager(connection);
  zoneModelManagerMap.set(zone, zoneModelManager);
  return zoneModelManager;
}

// 导出一个方法用于获取 zoneModelManager 实例
export function getZoneModelManager(zone: string): ZoneModelManager {
  const zoneModelManager = zoneModelManagerMap.get(zone);
  if (!zoneModelManager) {
    throw new Error(
      "getZoneModelManager is not initialized. Please call initializeGlobalModel first."
    );
  }
  return zoneModelManager;
}

export async function stopAllZoneConnection() {
  for (const key in zoneModelManagerMap) {
    await zoneModelManagerMap.get(key)?.stopConnection();
  }
}
