/*
 * @Author: lyh
 * @Github:
 * @FilePath: /InstanceServer/src/common/SysDecorate.ts
 * @Date: 2024-10-25 09:22:33
 * @LastEditors: lyh
 * @LastEditTime: 2025-01-03 11:39:09
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Subject, from } from "rxjs";
import { concatMap } from "rxjs/operators";
import { TsrpcError } from "tsrpc";

import { BadCode } from "../shared/type/Type";
import { ComponentManager, EComName } from "./BaseComponent";

const userQueues: Map<
  string,
  { queue: Subject<() => Promise<any>>; tasks: (() => Promise<any>)[] }
> = new Map();
const MAX_QUEUE_SIZE = 20;

function userIdGetterDefault(args: any[]): string {
  if (typeof args[0].uid === "string") {
    return args[0].uid;
  } else if (typeof args[0] === "string") {
    return args[0];
  }
  return "sys";
}
/**
 * 被修饰的函数处理同一个key的请求使用队列来处理
 * @param userIdGetter
 * @returns
 */
export function queueByUser(
  userIdGetter: (args: any[]) => string = userIdGetterDefault
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const userId = userIdGetter(args);
      let userQueue = userQueues.get(userId);

      if (!userQueue) {
        const queue = new Subject<() => Promise<any>>();
        userQueue = { queue, tasks: [] };
        userQueues.set(userId, userQueue);
        queue.pipe(concatMap((task) => from(task()))).subscribe(); // 订阅执行任务队列
      }

      if (userQueue!.tasks.length >= MAX_QUEUE_SIZE) {
        userQueue!.tasks = [];
        userQueue!.queue.complete(); // 完成当前队列，停止任务处理
        return Promise.reject(new TsrpcError(`TooBusy Now:${BadCode.TooBusy}`));
      }

      return new Promise((resolve, reject) => {
        const task = async () => {
          try {
            const result = await originalMethod.apply(this, args);
            resolve(result);
          } catch (error) {
            reject(error);
          } finally {
            // 从任务队列中移除已完成的任务
            userQueue!.tasks.shift();
          }
        };

        userQueue!.tasks.push(task); // 将任务添加到队列
        userQueue!.queue.next(task); // 将任务推入队列
      });
    };
  };
}

/**
 * 检测服务器状态，如果是关闭状态则不执行被修饰的函数
 * @returns
 */
export function ValidateServerStatus() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (req: any, ...args: any[]) {
      const globalVarComp = ComponentManager.instance.getComponent(
        EComName.GlobalVarComponent
      );
      if (globalVarComp.status === "closing") {
        return;
      }
      // 调用原方法，传递参数
      return originalMethod.apply(this, [req, ...args]);
    };

    return descriptor;
  };
}
