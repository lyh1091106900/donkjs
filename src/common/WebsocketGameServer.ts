/*
 * @Author: lyh
 * @Github:
 * @FilePath: /InstanceServer/src/common/WebsocketGameServer.ts
 * @Date: 2024-10-25 14:50:24
 * @LastEditors: lyh
 * @LastEditTime: 2025-01-15 15:40:02
 */
import chalk from "chalk";
import path from "path";
import { Logger, TsrpcError, WsConnection, WsServer } from "tsrpc";
import {
  serviceProto as serviceProto_Public,
  ServiceType as ServiceType_Public,
} from "../shared/public/instance/front_protocols/serviceProto";
import { NetworkUtil } from "./NetworkUtil";
import { ServerState } from "./ServerDef";
import { ServerGlobals } from "./ServerGlobal";

import { BadCode, eUserNotice, UserInfo } from "../shared/type/Type";
import { gameLogger } from "../util/logger";
import { getUniqueID } from "../util/tool";

export class WebsocketGameServer {
  public server!: WsServer<ServiceType_Public>;
  public logger!: Logger;
  public options!: ServerGlobals;

  disabled: boolean = false;
  userNum: number = 0;
  userId2Conn: { [key: string]: GameClientConn } = {};
  internalUrl: string = "";
  serverState: ServerState | undefined;

  // constructor() {

  // }

  addAnonymousConn(conn: GameClientConn) {
    conn.lastTickTime = Date.now();
    this.userId2Conn[`_anony_${conn.id}`] = conn;
  }

  removeAnonyousConn(conn: GameClientConn) {
    delete this.userId2Conn[`_anony_${conn.id}`];
  }

  async init(options: ServerGlobals) {
    this.options = options;
    this.server = new WsServer(serviceProto_Public, {
      port: this.options.port,
      logger: gameLogger,
      // Remove this to use binary mode (remove from the client too)
      json: true,
      logReqBody: true,
      logResBody: true,
    });
    // this.server.gracefulStop()
    this.logger = this.server.logger;

    const ip = this.options.internalIP || NetworkUtil.getLocalIPv4();

    this.internalUrl = `http://${ip}:${this.options.httpPort}`;

    this.server.flows.postConnectFlow.push((call) => {
      this.addAnonymousConn(call as GameClientConn);
      this.userNum++;
      return call;
    });

    // this.server.flows.preApiCallFlow.push((call) => {
    //   const decoded = getDecodeFromAccountToken(call.req.token);
    //   if (decoded) {
    //     return call;
    //   } else {
    //     call.error(
    //       new TsrpcError(`${BadCode.AuthError}`, { code: BadCode.AuthError }),
    //     );
    //     return;
    //   }
    // });

    this.server.flows.postDisconnectFlow.push((v) => {
      const conn = v.conn as GameClientConn;
      this.removeAnonyousConn(conn);
      // if (conn.user?.uid) StorageLayer.LogOutPlayerIdSet.add(getUniqueID(conn.user));
      if (conn.user && conn.user.uid) {
        // ComponentManager.instance
        //   .getComponent(EComName.RPCComponent)
        //   .updateZoneUserNum(conn.user, -1);
        delete this.userId2Conn[getUniqueID(conn.user)];
      }

      this.userNum--;
      return v;
    });

    this.serverState = {
      type: 1,
      ip: ip!,
      port: this.options.httpPort!,
      userNum: 0,
    };

    this.server.listenMsg("Ping", (call) => {
      (call.conn as GameClientConn).lastTickTime = Date.now();
    });

    this.reportServerState();

    await this.server.autoImplementApi(
      path.resolve(__dirname, "../api/public/front")
    );
  }

  async start() {
    await this.server.start();
    this.logger.log(
      chalk.green(`WebsocketGameServer started at ${this.options.port}`)
    );
  }

  reportServerState() {
    if (this.serverState) {
      this.serverState.userNum = this.userNum;
      // MasterSrvRPC.get().reportServer(this.serverState);
    }
  }

  checkConnectionState() {
    const keys = Object.keys(this.userId2Conn);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const conn = this.userId2Conn[key];
      const tickTimeout = this.options.connectionTickTimeout || 30000;
      if (Date.now() - conn.lastTickTime > tickTimeout) {
        this.kickUser(key, "tick_timeout");
      }
    }
  }

  kickUser(uid: string, reason: string) {
    const conn = this.userId2Conn[uid];
    conn?.close(reason);
  }
}

export type GameClientConn = WsConnection<ServiceType_Public> & {
  user: UserInfo;
  state: "" | "login" | "ready";
  lastTickTime: number;
};

export const websocketGameServer = new WebsocketGameServer();

export function sendUsersNotice(
  users: Array<UserInfo>,
  noticeType: eUserNotice
) {
  users.forEach((user) => {
    const deleteUserConn: GameClientConn =
      websocketGameServer.userId2Conn[getUniqueID(user)];
    if (deleteUserConn) deleteUserConn.sendMsg("UserNotice", { noticeType });
  });
}

export function sendOnlineUsersNotice(zone: string[], noticeType: eUserNotice) {
  const usersConn = Object.values(websocketGameServer.userId2Conn).filter(
    (item) => {
      if (item.user?.zone) return zone.includes(item.user.zone);
      return false;
    }
  );
  usersConn.forEach((conn) => conn.sendMsg("UserNotice", { noticeType }));
}
