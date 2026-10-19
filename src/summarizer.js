export async function summarizeCases(cases, options = {}) {
  if (options.dryRun || !options.apiKey) {
    return cases.map((item) => ({
      ...item,
      insight: item.summary || "该案例与 Agent、自动化或数据工作流相关，适合进入人工复盘。",
      action: "补充业务场景、技术架构、输入输出和可复用方法。"
    }));
  }

  return Promise.all(cases.map((item) => summarizeCase(item, options)));
}

async function summarizeCase(item, options) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${options.apiKey}`
    },
    body: JSON.stringify({
      model: options.model,
      messages: [
        {
          role: "system",
          content: "你是案例研究 Agent。用中文输出 JSON，字段为 insight 和 action。不要编造来源没有的信息。"
        },
        {
          role: "user",
          content: JSON.stringify({
            title: item.title,
            url: item.url,
            summary: item.summary,
            tags: item.tags
          })
        }
      ],
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI summarize failed: ${response.status}`);
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content);

  return {
    ...item,
    insight: parsed.insight ?? item.summary,
    action: parsed.action ?? "继续跟进该案例。"
  };
}

