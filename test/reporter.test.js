import test from "node:test";
import assert from "node:assert/strict";
import { renderMarkdownReport } from "../src/reporter.js";

test("renders selected cases as markdown", () => {
  const report = renderMarkdownReport([
    {
      title: "Agent case",
      sourceName: "Manual",
      url: "https://example.com",
      score: 88,
      tags: ["agent"],
      insight: "值得拆解。",
      action: "整理输入输出。"
    }
  ], { title: "测试报告", timezone: "Asia/Shanghai" });

  assert.match(report, /# 测试报告/);
  assert.match(report, /Agent case/);
  assert.match(report, /值得拆解/);
});

