import { ComponentManager } from "../common/BaseComponent";
import { JobStop } from "../common/CronManager";
import { websocketGameServer } from "../common/WebsocketGameServer";
import { UserInfo } from "../shared/type/Type";
import { gameLogger } from "./logger";

export async function stopFrontServer() {
  gameLogger.log("Stopping front server...");
  JobStop();
  websocketGameServer.server.gracefulStop(100).then(async () => {
    await ComponentManager.instance.stopAll();
    process.nextTick(() => {
      process.exit(0);
    });
  });
}

export function getUniqueID(user: UserInfo): string {
  return `${user.zone}:${user.uid}`;
}

export function getBaseConfigPath(
  environment: string,
  serverProvide: string
): string {
  if (serverProvide) {
    return `../sysconfig/${environment}/${serverProvide}/`;
  }
  return `../sysconfig/${environment}/`;
}
