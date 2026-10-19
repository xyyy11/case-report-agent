export async function pushFeishu(markdown, options) {
  const response = await fetch(options.webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      msg_type: "text",
      content: {
        text: markdown
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Feishu push failed: ${response.status}`);
  }
}

