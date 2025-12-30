import * as fs from "fs";
import path from "path";
import { gameLogger } from "./logger";
import { getBaseConfigPath } from "./tool";
export function loadSysConfigJson(filename: string): [any, string] {
  const basePath = getBaseConfigPath(
    process.env.environment!,
    process.env.serverProvide!
  );
  const configFilePath = path.resolve(__dirname, basePath + filename);
  gameLogger.log(configFilePath);
  try {
    const configData = fs.readFileSync(configFilePath, "utf-8");
    const data = JSON.parse(configData);
    gameLogger.debug(`${filename} content: ${data}`);
    return [data, "load succuss"];
  } catch (error) {
    gameLogger.error(error);
    return [undefined, "error"];
  }
}
