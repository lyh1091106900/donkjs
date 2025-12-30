/*
 * @Author: lyh
 * @Github:
 * @FilePath: /InstanceServer/src/component/SysCfgComponent.ts
 * @Date: 2024-10-28 16:17:41
 * @LastEditors: lyh
 * @LastEditTime: 2025-01-07 14:09:33
 */
import {
  ComponentManager,
  EComName,
  IBaseComponent,
} from "../common/BaseComponent";
import { DBCfg, ZoneCfg as ServerCfg } from "../common/CommonType";
import { ServerGlobals } from "../common/ServerGlobal";
import { gameLogger as logger } from "../util/logger";
// import { schema as DBConfig } from '../json_schemas/db_config';
import { loadSysConfigJson } from "../util/load_json";

export class SysCfgComponent implements IBaseComponent {
  private _db_global!: DBCfg;
  private _db_server_map: Map<string, DBCfg> = new Map();
  private _db_zone_map: Map<string, DBCfg> = new Map();
  private _server!: ServerCfg;
  init() {}

  async start() {
    const globalVarComp = ComponentManager.instance.getComponent(
      EComName.GlobalVarComponent
    );
    const globalVar = globalVarComp.globalVar;
    this.setZoneConfig(globalVar);
    this.setDbConfig();
  }

  async afterStart() {}

  async stop() {}

  setZoneConfig(globalVar: ServerGlobals): void {
    const [data, error] = loadSysConfigJson("zone_config.json");
    if (!data) {
      logger.error(`load zone_config.json failed: ${error}`);
      return;
    }

    // const config = ZoneConfig.parse(data);
    let zoneList = data[globalVar.id]?.zoneList as Array<string>;
    zoneList = zoneList ? zoneList : [];
    this._server = {
      gameType: globalVar.gameType,
      version: data.version,
      serverId: globalVar.id,
      registerServerUrl: data.RegisterServerUrl as string,
      zoneIdList: zoneList,
    };
  }

  setDbConfig(): void {
    const [data, error] = loadSysConfigJson("db_config.json");
    if (!data) {
      logger.error(`load db_config.json failed: ${error}`);
      return;
    }

    const config = data;

    // 假设配置文件包含 `db_global` 和 `db_server` 信息
    this._db_global = config.db_global as DBCfg;
    if (this._server.serverId) {
      for (const [zone, dbConfig] of Object.entries(config.db_server)) {
        this._db_server_map.set(zone, dbConfig as DBCfg);
      }
    }
    // 如果包含多个区的配置，假设是 `db_zones`
    if (config.db_zones) {
      for (const [zone, dbConfig] of Object.entries(config.db_zones)) {
        this._db_zone_map.set(zone, dbConfig as DBCfg);
      }
    }
    logger.log("Configuration loaded DB successfully:", config);
  }
  /**
   * 获取账号数据库的配置
   */
  public get db_global(): DBCfg {
    return this._db_global;
  }
  /**
   * 获取游服数据库的配置
   */
  public get db_server_map(): Map<string, DBCfg> {
    return this._db_server_map;
  }
  /**
   * 获取区服数据库的配置
   */
  public get db_zone_map(): Map<string, DBCfg> {
    return this._db_zone_map;
  }
  /**
   * 获取某个区服数据库的配置
   */
  public db_zone(zone: string): DBCfg | undefined {
    return this._db_zone_map.get(zone);
  }

  /**
   * 获取某个区服的配置
   */
  public get server(): ServerCfg {
    return this._server;
  }
}
