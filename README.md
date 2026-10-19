# Case Report Agent

**Collect → score → summarize → report → push.** A small, dependency-free Node.js agent that turns scattered sources into a traceable daily report and delivers it to your team chat.

[中文说明](README.zh-CN.md)

```text
Sources → Collector → Scorer → Summarizer → Reporter → Notifiers
(RSS / manual)  (dedupe)  (relevance)  (LLM, optional)  (Markdown)  (DingTalk / Feishu)
```

## What it does

- **Collects** candidate cases from RSS feeds or a hand-curated JSON list, and de-duplicates them by URL.
- **Scores** each candidate for relevance and drops anything below a threshold (`MIN_SCORE`, default 60).
- **Summarizes** with an OpenAI chat model into an *insight* and a *suggested action*. The prompt forbids inventing facts the source does not contain. With no API key (or `--dry-run`) it falls back to the source's own summary, so the whole pipeline runs offline.
- **Reports** as one Markdown file per day under `reports/`.
- **Pushes** to a DingTalk or Feishu custom-bot webhook (DingTalk signing supported).

It has zero runtime dependencies — Node.js 20+ only.

## Quick start

```bash
git clone https://github.com/xyyy11/case-report-agent.git
cd case-report-agent
npm install
npm run dry-run        # uses config/demo.json; no API key, nothing is pushed
npm test
```

Use your own sources:

```bash
cp config/sources.example.json config/sources.json
cp .env.example .env   # fill in only what you need
node src/cli.js run --config config/sources.json --min-score 70
```

Source format (`type` is `manual` or `rss`):

```json
[
  {
    "id": "manual-cases",
    "name": "Manual Case Backlog",
    "type": "manual",
    "items": [
      { "title": "Case title", "url": "https://example.com/case", "summary": "One-paragraph summary", "tags": ["agent", "automation"] }
    ]
  },
  { "id": "feed", "name": "Some RSS feed", "type": "rss", "url": "https://example.com/rss.xml", "keywords": ["agent", "workflow"] }
]
```

## Configuration

All settings are environment variables (see `.env.example`):

| Variable | Purpose |
|---|---|
| `OPENAI_API_KEY`, `OPENAI_MODEL` | Optional LLM summaries (default model `gpt-4.1-mini`) |
| `DINGTALK_WEBHOOK`, `DINGTALK_SECRET` | DingTalk custom robot; leave the secret empty if signing is off |
| `FEISHU_WEBHOOK` | Feishu custom bot |
| `REPORT_TIMEZONE` | Report timestamp zone (default `Asia/Shanghai`) |
| `MIN_SCORE` | Relevance threshold (default `60`) |

If no webhook is configured the report is simply written locally.

## Scheduling

- **cron:** `0 9 * * * cd /path/to/case-report-agent && npm start`
- **GitHub Actions:** copy [`examples/github-actions/daily-report.yml`](examples/github-actions/daily-report.yml) to `.github/workflows/`, add your secrets, and set the repository variable `ENABLE_DAILY_REPORT=true`. The job stays skipped until you do.

## Layout

```text
src/collector.js     RSS + manual sources, URL de-duplication
src/scorer.js        relevance scoring and thresholding
src/summarizer.js    LLM summary with offline fallback
src/reporter.js      Markdown rendering
src/notifiers/       DingTalk and Feishu delivery
src/agent.js         pipeline orchestration, src/cli.js  command line
docs/agent-design.md design notes (Chinese)
```

## Limitations

- Relevance scoring is a **keyword heuristic** (a fixed signal list), not a learned ranker.
- No persistence: the same case can be pushed again on a later run.
- The summarizer calls OpenAI only, and summary faithfulness is not evaluated yet.
- Only RSS and manual sources are supported.
- Report labels and the LLM prompt/summaries are currently in Chinese (the report title is configurable); English localization is not done yet.

## Roadmap

- [ ] Embedding-based relevance ranking, compared against the keyword scorer (precision@k on a labelled sample)
- [ ] Faithfulness check for summaries (source-grounded citations, LLM-as-judge on a labelled set)
- [ ] Persistence to avoid duplicate pushes, plus a feedback loop ("useful / not useful") that adjusts ranking
- [ ] More collectors: web pages, GitHub search; more channels: email, Telegram, WeCom
- [ ] HTML report output and English / configurable report language

## License

MIT
