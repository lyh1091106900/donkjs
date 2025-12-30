/*
 * @Author: lyh
 * @Github:
 * @FilePath: /InstanceServer/src/component/front/MongoComponent.ts
 * @Date: 2024-10-28 16:17:41
 * @LastEditors: lyh
 * @LastEditTime: 2025-01-09 18:00:36
 */
import {
  ComponentManager,
  EComName,
  IBaseComponent,
} from "../../common/BaseComponent";
import {
  getGlobalModelManager,
  initializeGlobalModel,
} from "../../dbservice/model/GlobalInfoDBModel";

import assert from "assert";
import * as mongoose from "mongoose";
import { DBCfg } from "../../common/CommonType";
import {
  getServerModelManager,
  initializeServerModel,
} from "../../dbservice/model/ServerDBModel";
import {
  initializeZoneModel,
  stopAllZoneConnection,
} from "../../dbservice/model/ZoneDBModel";
import { gameLogger as logger } from "../../util/logger";

export class MongoComponent implements IBaseComponent {
  init() {}

  async start() {
    const sysCfgComp = ComponentManager.instance.getComponent(
      EComName.SysCfgComponent
    );
    if (sysCfgComp.db_global) {
      await this.initDbConnection(sysCfgComp.db_global, initializeGlobalModel);
      logger.debug("sysCfgComp.db_server1");
    }

    const server = sysCfgComp.server.serverId;
    logger.debug("server ", server, sysCfgComp.db_server_map);
    const serverCfg = sysCfgComp.db_server_map.get(server);
    assert(
      serverCfg !== undefined,
      `Server config not found for serverId: ${server}`
    );
    await this.initDbConnection(serverCfg, initializeServerModel);
    logger.debug("sysCfgComp.db_server2");

    const zoneList = sysCfgComp.server.zoneIdList;
    logger.debug("zoneList ", zoneList);
    for (const zone of zoneList) {
      const zoneCfg = sysCfgComp.db_server_map.get(server);
      assert(
        zoneCfg !== undefined,
        `Server config not found for zone: ${zone}`
      );
      await this.initDbZoneConnection(zoneCfg, zone, initializeZoneModel);
      logger.debug("sysCfgComp.db_server3");
    }
  }

  async afterStart() {}

  async stop() {
    await getGlobalModelManager().stopConnection();
    await getServerModelManager().stopConnection();
    await stopAllZoneConnection();
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-explicit-any
  initDbConnection(dbConfig: DBCfg, callback: Function): Promise<any> {
    logger.debug("initDbConnection", dbConfig);
    return new Promise((resolve, reject) => {
      const url = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.db}`;
      logger.debug("initDbConnection", url);
      const connection = mongoose.createConnection(url);

      // 监听连接成功事件
      connection.on("connected", () => {
        const result = callback(connection);
        resolve(result);
        logger.debug("initialized", dbConfig);
      });

      // 监听连接错误事件
      connection.on("error", (error: Error) => {
        logger.error("Connection error:", error);
        reject(error);
      });

      // 可选：处理其他连接关闭等事件
      connection.on("disconnected", () => {
        logger.debug("Connection disconnected");
      });
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-explicit-any
  initDbZoneConnection(
    dbConfig: DBCfg,
    zone: string,
    callback: Function
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.db}`;
      logger.debug("initDbConnection", url);
      const connection = mongoose.createConnection(url);

      // 监听连接成功事件
      connection.on("connected", () => {
        const result = callback(connection, zone);
        resolve(result);
        logger.debug("initialized", dbConfig);
      });

      // 监听连接错误事件
      connection.on("error", (error: Error) => {
        logger.error("Connection error:", error);
        reject(error);
      });

      // 可选：处理其他连接关闭等事件
      connection.on("disconnected", () => {
        logger.debug("Connection disconnected");
      });
    });
  }
}
