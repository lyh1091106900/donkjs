import { UserInfo } from "../shared/type/Type";

export enum ETaskType {}

export type TTaskDelta = {
  userInfo: UserInfo;
  type: ETaskType;
  delta: number;
};

export type ZoneCfg = {
  gameType: string;
  registerServerUrl: string;
  version: number;
  serverId: string;
  zoneIdList: Array<string>;
};

export type DBCfg = {
  host: string;
  port: string;
  db: string;
  user?: string;
  password?: string;
};

//单位毫秒
export const ONE_MINITE_TIME = 60 * 1000;
export const THREE_DAYS_TIME = 3 * 30 * 24 * 60 * 60 * 1000;
export const ONE_HOUR_TIME = 60 * 1000 * 60;
export const ONE_DAY_TIME = ONE_HOUR_TIME * 24;
export const FIVE_SEC_TIME = 5 * 1000;
export const TEN_SEC_TIME = FIVE_SEC_TIME * 2;

export const CRON_EVERY_FIVE_SEC = "*/5 * * * * *"; // 每5秒运行一次
export const CRON_EVERY_ONE_SEC = "*/1 * * * * *"; // 每1秒运行一次
export const CRON_FIRST_SEC_PER_MINUTE = "0 * * * * *"; // 每分钟的第一秒运行一次
export const CRON_FIRST_SEC_PER_3MINUTE = "0 */3 * * * *"; // 每分钟的第一秒运行一次
export const CRON_FIRST_SEC_PER_HOUR = "0 0 * * * *"; // 每小时的第一分钟的第一秒运行一次
export const CRON_FIRST_SEC_PER_DAY = "5 0 0 * * *"; // 每天0点的第0分钟的第五秒运行一次
export const CRON_FIRST_DAY_FIRST_2_HOUR_PER_WEEK = "0 0 2 * * 1"; // 每周一凌晨2点（02:00:00）运行一次
export const CRON_FIRST_DAY_FIRST_3_HOUR_PER_MONTH = "0 0 3 1 * *"; // 每月的1号凌晨3点（03:00:00）运行一次
export const CRON_FIRST_MONTH_FIRST_DAY_5_HOUR_PER_YEAR = "0 0 5 1 1 *"; // 每年1月的1号凌晨5点（05:00:00）运行一次
