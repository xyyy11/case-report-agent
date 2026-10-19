import { pushDingTalk } from "./dingtalk.js";
import { pushFeishu } from "./feishu.js";

export async function pushReport(report, options = {}) {
  const tasks = [];

  if (options.dingtalkWebhook) {
    tasks.push(pushDingTalk(report, {
      webhook: options.dingtalkWebhook,
      secret: options.dingtalkSecret
    }));
  }

  if (options.feishuWebhook) {
    tasks.push(pushFeishu(report, { webhook: options.feishuWebhook }));
  }

  if (tasks.length === 0) {
    console.log("No webhook configured. Report was generated locally only.");
    return;
  }

  await Promise.all(tasks);
}

