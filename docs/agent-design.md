# 案例报告 Agent 设计

## 目标

把分散的信息源整理成可复用案例报告，并通过钉钉、飞书或其他 Webhook 推送给团队。

## 流程

1. 采集：从 RSS、手工清单或后续扩展的数据源获取候选案例。
2. 筛选：根据 Agent、自动化、数据、报告、推送等关键词打分。
3. 总结：调用模型生成中文洞察和建议动作。
4. 归档：输出 Markdown 报告到 `reports/`。
5. 推送：发送到钉钉机器人、飞书机器人或扩展 Webhook。

## Agent 模块

- `collector`：负责不同数据源接入。
- `scorer`：负责候选案例排序和阈值过滤。
- `summarizer`：负责模型调用和结构化总结。
- `reporter`：负责生成可读 Markdown。
- `notifiers`：负责不同平台推送。

## 钉钉推送

在钉钉群创建自定义机器人，复制 Webhook 到 `.env`：

```sh
DINGTALK_WEBHOOK=https://oapi.dingtalk.com/robot/send?access_token=xxx
DINGTALK_SECRET=SECxxx
```

如果机器人没有加签，可以不填 `DINGTALK_SECRET`。

## 飞书推送

在飞书群创建自定义机器人，复制 Webhook 到 `.env`：

```sh
FEISHU_WEBHOOK=https://open.feishu.cn/open-apis/bot/v2/hook/xxx
```

## 定时运行

本地可以用 cron：

```sh
0 9 * * * cd /path/to/case-report-agent && npm start
```

GitHub Actions 可以使用仓库 Secrets 存放 `OPENAI_API_KEY`、`DINGTALK_WEBHOOK` 和 `FEISHU_WEBHOOK`。

