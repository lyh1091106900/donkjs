/*
 * @Author: lyh
 * @Github:
 * @FilePath: /InstanceServer/src/util/logger.ts
 * @Date: 2024-11-08 14:53:32
 * @LastEditors: lyh
 * @LastEditTime: 2024-11-11 15:22:48
 */
import * as fs from "fs";
import * as log4js from "log4js";
import path from "path";

(function init_logger() {
  const environment = process.env.environment || "development";
  const configFilePath = path.resolve(
    __dirname,
    `../sysconfig/${environment}/log_config.json`,
  );

  try {
    const configData = fs.readFileSync(configFilePath, "utf-8");
    const config = JSON.parse(configData);
    log4js.configure(config);
  } catch (error) {
    console.log("init_logger failed", error);
    process.exit(-1);
  }
})();

export const serverLogger = log4js.getLogger("server");
export const gameLogger = log4js.getLogger("game");
// export const csvLogger = log4js.getLogger("csv");
// export const prop_history_csvLogger = log4js.getLogger("prop_history_csv");
