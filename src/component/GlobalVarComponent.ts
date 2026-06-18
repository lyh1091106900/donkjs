/*
 * @Author: lyh
 * @Github:
 * @FilePath: /InstanceServer/src/component/GlobalVarComponent.ts
 * @Date: 2024-10-25 13:40:34
 * @LastEditors: lyh
 * @LastEditTime: 2025-01-06 18:28:57
 */

import { IBaseComponent } from "../common/BaseComponent";
import { ServerGlobals } from "../common/ServerGlobal";
import { TstatusString } from "../shared/type/Type";

import { stopFrontServer } from "../util/tool";
import { EComName } from "../common/CComponent";
export class GlobalVarComponent implements IBaseComponent {
  private _status: TstatusString = "normal";
  init(globalVar: ServerGlobals) {
    this._globalVar = globalVar;
  }
  async start() {}
  async afterStart() {}

  async stop() {}

  set status(v: TstatusString) {
    if (this._status !== v && v === "closing") {
      switch (this._globalVar.gameType) {
        case "front":
          stopFrontServer();
          break;
        default:
      }
    }
    this._status = v;
  }
  get status(): TstatusString {
    return this._status;
  }

  private _globalVar!: ServerGlobals;
  get globalVar(): ServerGlobals {
    return this._globalVar;
  }
  get globalVarEnvironment(): string {
    return this._globalVar.environment;
  }
}
