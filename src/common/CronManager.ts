/*
 * @Author: lyh
 * @Github:
 * @FilePath: /InstanceServer/src/common/CronManager.ts
 * @Date: 2024-11-28 10:10:35
 * @LastEditors: lyh
 * @LastEditTime: 2025-01-07 10:34:03
 */
import { CronCommand, CronJob } from "cron";

const jobList: CronJob[] = [];
export function registerJob(
  cronStr: string,
  func: CronCommand<null, boolean>,
  timeZone: string = "Asia/Shanghai"
) {
  const job = new CronJob(
    cronStr, // cronTime
    func, // onTick
    undefined, // onComplete
    true, // start
    timeZone // timeZone
  );
  jobList.push(job);
}
export function JobStop() {
  jobList.forEach((job) => job.stop());
}
