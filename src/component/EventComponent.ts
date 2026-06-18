/*
 * @Author: lyh
 * @Github:
 * @FilePath: /InstanceServer/src/component/EventCompoent.ts
 * @Date: 2024-11-05 09:26:28
 * @LastEditors: lyh
 * @LastEditTime: 2024-11-11 16:49:29
 */
import { Subject } from "rxjs";
import { IBaseComponent } from "../common/BaseComponent";
import { TTaskDelta } from "../common/CommonType";
import { gameLogger } from "../util/logger";
import { EComName } from "../common/CComponent";
export class EventComponent implements IBaseComponent {
  private _taskEvent!: Subject<TTaskDelta>;

  // Getters
  public get taskEvent(): Subject<TTaskDelta> {
    return this._taskEvent;
  }

  init() {}

  async start() {
    this._taskEvent = new Subject<TTaskDelta>();
  }

  async afterStart() {
    this._taskEvent.subscribe(taskHandler);
  }

  async stop() {}
}

function taskHandler(v: TTaskDelta) {
  gameLogger.debug("API Not Implemented", v);
}
