/*
 * @Author: lyh
 * @Github:
 * @FilePath: /InstanceServer/src/dbservice/model/ServerDBModel.ts
 * @Date: 2024-10-31 17:14:34
 * @LastEditors: lyh
 * @LastEditTime: 2024-12-04 16:08:40
 */
import { Connection } from "mongoose";
// import { IMail, MailSchema } from '../../entity/mail.entity';

// const AutoIncrement = require('mongoose-sequence')(mongoose);

export class ServerModelManager {
  private connection: Connection;
  // private mailModel!: Model<IMail>;

  constructor(connection: Connection) {
    this.connection = connection;
    this.registerModels();
  }
  /**
   * Stops the database connection
   * @returns A Promise that resolves when the connection is successfully destroyed
   */
  public async stopConnection() {
    return this.connection.destroy();
  }
  /**
   * Registers all models for the server
   * This method is called in the constructor to set up the database models
   */
  private registerModels() {
    // MailSchema.plugin(AutoIncrement, { inc_field: 'mailId', start_seq: 10000000000 });
    // this.mailModel = this.connection.model<IMail>("Mail", MailSchema);
  }

  /**
   * Retrieves the Mail model
   * @returns The Mongoose Model for Mail documents
   */
  // public getMailModel(): Model<IMail> {
  //   return this.mailModel;
  // }
  // 如果有其他模型，可以添加类似的方法
}

let serverModelManager: ServerModelManager;

// 导出一个函数用于初始化 ServerModelManager
export function initializeServerModel(connection: Connection) {
  if (!serverModelManager) {
    serverModelManager = new ServerModelManager(connection);
  }
  return serverModelManager;
}

// 导出一个方法用于获取 GlobalModelManager 实例
export function getServerModelManager(): ServerModelManager {
  if (!serverModelManager) {
    throw new Error(
      "GlobalModelManager is not initialized. Please call initializeGlobalModel first."
    );
  }
  return serverModelManager;
}
