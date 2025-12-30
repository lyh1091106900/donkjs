/*
 * @Author: lyh
 * @Github:
 * @FilePath: /InstanceServer/src/common/BaseComponent.ts
 * @Date: 2024-10-28 16:17:41
 * @LastEditors: lyh
 * @LastEditTime: 2025-01-09 13:11:41
 */

import { GlobalVarComponent } from "../component/GlobalVarComponent";
import { SysCfgComponent } from "../component/SysCfgComponent";

export enum EComName {
  GlobalVarComponent = "GlobalVarComponent",
  SysCfgComponent = "SysCfgComponent",
}

export const EComNameType = {
  [EComName.GlobalVarComponent]: GlobalVarComponent,
  [EComName.SysCfgComponent]: SysCfgComponent,
};
export interface IBaseComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  init: (option: any) => void;

  /**
   * 服务器启动后执行不需要依赖其他组件的操作
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  start: () => Promise<any>;

  /**
   * 服务器启动后执行依赖其他组件的操作
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  afterStart: () => Promise<any>;

  /**
   * 服务器关闭后执行的操作
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stop: () => Promise<any>;
}

export class ComponentManager {
  private static _instance: ComponentManager;
  private components: Map<string, IBaseComponent> = new Map();

  // 私有构造函数，防止外部实例化
  private constructor() {}

  // 获取单例实例的方法
  public static get instance(): ComponentManager {
    if (!ComponentManager._instance) {
      ComponentManager._instance = new ComponentManager();
    }
    return ComponentManager._instance;
  }

  // 注册组件时，使用唯一的 key 进行注册
  register<T extends IBaseComponent>(key: string, component: T): void {
    this.components.set(key, component);
  }

  // 获取组件时，通过类型断言来访问具体组件的类型
  getComponent<K extends EComName>(
    key: K
  ): InstanceType<(typeof EComNameType)[K]> {
    return this.components.get(key) as InstanceType<(typeof EComNameType)[K]>;
  }

  // 启动所有组件
  async startAll(): Promise<void> {
    //这个values的元素和插入的顺序一致
    for (const component of this.components.values()) {
      await component.start();
    }
  }

  // 启动所有组件
  async afterStartAll(): Promise<void> {
    //这个values的元素和插入的顺序一致
    for (const component of this.components.values()) {
      await component.afterStart();
    }
  }

  // 停止所有组件
  async stopAll(): Promise<void> {
    //这个values的元素和插入的顺序一致
    for (const component of this.components.values()) {
      await component.stop();
    }
  }
}
