# Case Report Agent

[English](README.md)

案例报告 Agent 是一个从信息采集到消息推送的完整项目模板。它可以从 RSS 或手工配置的数据源收集候选案例，按相关性筛选，调用模型生成中文洞察，输出 Markdown 报告，并推送到钉钉或飞书。

## 能做什么

- 采集案例：支持 RSS 和手工案例清单
- 筛选排序：根据 Agent、自动化、数据、报告、推送等信号评分
- AI 总结：调用 OpenAI API 生成洞察和建议动作
- 报告归档：每天生成一份 Markdown 报告
- 消息推送：支持钉钉机器人、飞书机器人
- 定时运行：支持本地 cron 和 GitHub Actions

## 快速开始

```sh
npm install
cp .env.example .env
npm run dry-run
```

`dry-run` 使用 `config/demo.json`，不需要 OpenAI API Key，也不会推送消息。

## 配置数据源

复制示例配置：

```sh
cp config/sources.example.json config/sources.json
```

然后运行：

```sh
node src/cli.js run --config config/sources.json
```

数据源格式：

```json
[
  {
    "id": "manual-cases",
    "name": "Manual Case Backlog",
    "type": "manual",
    "items": [
      {
        "title": "案例标题",
        "url": "https://example.com/case",
        "summary": "案例摘要",
        "tags": ["agent", "automation"]
      }
    ]
  }
]
```

## 配置 AI 总结

在 `.env` 中填写：

```sh
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini
```

没有 `OPENAI_API_KEY` 时，项目会使用原始摘要生成报告，适合本地调试。

## 配置钉钉推送

在钉钉群里创建自定义机器人，复制 Webhook：

```sh
DINGTALK_WEBHOOK=https://oapi.dingtalk.com/robot/send?access_token=xxx
DINGTALK_SECRET=SECxxx
```

如果机器人没有开启加签，`DINGTALK_SECRET` 可以留空。

## 配置飞书推送

在飞书群里创建自定义机器人，复制 Webhook：

```sh
FEISHU_WEBHOOK=https://open.feishu.cn/open-apis/bot/v2/hook/xxx
```

## Agent 设计

核心流程：

```text
Sources -> Collector -> Scorer -> Summarizer -> Reporter -> Notifiers
```

模块说明：

- `src/collector.js`：采集 RSS 或手工案例
- `src/scorer.js`：相关性评分和排序
- `src/summarizer.js`：调用模型生成洞察
- `src/reporter.js`：生成 Markdown 报告
- `src/notifiers/`：钉钉、飞书等推送渠道

更完整的设计说明见 [docs/agent-design.md](docs/agent-design.md)。

## 定时运行

本地 cron：

```sh
0 9 * * * cd /path/to/case-report-agent && npm start
```

GitHub Actions：

- 将 `examples/github-actions/daily-report.yml` 复制到 `.github/workflows/`
- 在仓库 Secrets 中配置 `OPENAI_API_KEY`、`DINGTALK_WEBHOOK`、`DINGTALK_SECRET`、`FEISHU_WEBHOOK`（按需）
- 在仓库 Variables 中设置 `ENABLE_DAILY_REPORT=true` 后才会运行
- 默认每天 UTC 01:00 运行，即北京时间 09:00

## 命令

```sh
npm start
npm run dry-run
npm test
node src/cli.js run --config config/sources.json --min-score 70
```

## 后续扩展

- 增加网页抓取器、GitHub 搜索、公众号文章输入
- 增加数据库持久化，避免重复推送
- 增加企业微信、邮件、Telegram 推送
- 增加 HTML 报告输出

