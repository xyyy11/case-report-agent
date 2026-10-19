export function scoreCases(items, options = {}) {
  const minScore = Number(options.minScore ?? 60);

  return items
    .map((item) => ({ ...item, score: scoreCase(item) }))
    .filter((item) => item.score >= minScore)
    .sort((left, right) => right.score - left.score);
}

function scoreCase(item) {
  const text = `${item.title} ${item.summary} ${(item.tags ?? []).join(" ")}`.toLowerCase();
  const signals = [
    "agent",
    "automation",
    "workflow",
    "case",
    "report",
    "ai",
    "数据",
    "案例",
    "自动化",
    "智能体",
    "推送"
  ];

  const matched = signals.filter((signal) => text.includes(signal)).length;
  return Math.min(100, 40 + matched * 12);
}

