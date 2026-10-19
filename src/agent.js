import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { collectCases } from "./collector.js";
import { scoreCases } from "./scorer.js";
import { summarizeCases } from "./summarizer.js";
import { renderMarkdownReport } from "./reporter.js";
import { pushReport } from "./notifiers/index.js";

export async function runAgent(options = {}) {
  const configPath = options.config ?? "config/sources.example.json";
  const minScore = Number(options.minScore ?? process.env.MIN_SCORE ?? 60);
  const sources = JSON.parse(await readFile(configPath, "utf8"));

  const collected = await collectCases(sources);
  const scored = scoreCases(collected, { minScore });
  const summarized = await summarizeCases(scored, {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
    dryRun: options.dryRun
  });

  const report = renderMarkdownReport(summarized, {
    title: options.title ?? "案例报告 Agent 日报",
    timezone: process.env.REPORT_TIMEZONE ?? "Asia/Shanghai"
  });

  const reportPath = await saveReport(report);

  if (!options.dryRun) {
    await pushReport(report, {
      dingtalkWebhook: process.env.DINGTALK_WEBHOOK,
      dingtalkSecret: process.env.DINGTALK_SECRET,
      feishuWebhook: process.env.FEISHU_WEBHOOK
    });
  }

  return { reportPath, report, cases: summarized };
}

async function saveReport(report) {
  const dir = path.resolve("reports");
  await mkdir(dir, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  const reportPath = path.join(dir, `${stamp}.md`);
  await writeFile(reportPath, report, "utf8");
  return reportPath;
}

