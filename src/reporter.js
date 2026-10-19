export function renderMarkdownReport(cases, options = {}) {
  const now = new Date();
  const date = new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "full",
    timeZone: options.timezone ?? "Asia/Shanghai"
  }).format(now);

  const lines = [
    `# ${options.title ?? "案例报告"}`,
    "",
    `生成日期：${date}`,
    "",
    `本次筛选案例数：${cases.length}`,
    ""
  ];

  for (const [index, item] of cases.entries()) {
    lines.push(
      `## ${index + 1}. ${item.title}`,
      "",
      `- 来源：${item.sourceName}`,
      `- 链接：${item.url}`,
      `- 分数：${item.score}`,
      `- 标签：${(item.tags ?? []).join(", ") || "未标注"}`,
      "",
      `**洞察**：${item.insight}`,
      "",
      `**建议动作**：${item.action}`,
      ""
    );
  }

  return lines.join("\n");
}

