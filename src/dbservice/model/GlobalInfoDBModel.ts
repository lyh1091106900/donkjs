/*
 * @Author: lyh
 * @Github:
 * @FilePath: /InstanceServer/src/dbservice/model/GlobalInfoDBModel.ts
 * @Date: 2024-10-25 09:22:33
 * @LastEditors: lyh
 * @LastEditTime: 2024-11-28 10:35:50
 */
import { Connection } from "mongoose";
// import { IAccount } from "../../entity/account.entity";
// import { IMail } from "../../entity/mail.entity";

class GlobalModelManager {
  private connection: Connection;
  // private accountModel!: Model<IAccount>;
  // private mailModel!: Model<IMail>;

  constructor(connection: Connection) {
    this.connection = connection;
    this.registerModels();
  }

  // 注册所有的模型
  private registerModels() {
    // 注册 Account 模型
    // this.accountModel = this.connection.model<IAccount>('Account', AccountSchema);
    // this.mailModel = this.connection.model<IMail>('Mail', MailSchema);
  }

  // // 获取 Account 模型
  // public getAccountModel(): Model<IAccount> {
  //   return this.accountModel;
  // }
  // public getMailModel(): Model<IMail> {
  //   return this.mailModel;
  // }

  public async stopConnection() {
    return this.connection.destroy();
  }
  // 如果有其他模型，可以添加类似的方法
}

let globalModelManager: GlobalModelManager;

// 导出一个函数用于初始化 GlobalModelManager
export function initializeGlobalModel(connection: Connection) {
  if (!globalModelManager) {
    globalModelManager = new GlobalModelManager(connection);
  }
  return globalModelManager;
}

// 导出一个方法用于获取 GlobalModelManager 实例
export function getGlobalModelManager(): GlobalModelManager {
  if (!globalModelManager) {
    throw new Error(
      "GlobalModelManager is not initialized. Please call initializeGlobalModel first."
    );
  }
  return globalModelManager;
}
