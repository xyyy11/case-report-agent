import crypto from "node:crypto";

export async function pushDingTalk(markdown, options) {
  const webhook = buildSignedWebhook(options.webhook, options.secret);
  const response = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      msgtype: "markdown",
      markdown: {
        title: "案例报告",
        text: markdown
      }
    })
  });

  if (!response.ok) {
    throw new Error(`DingTalk push failed: ${response.status}`);
  }
}

function buildSignedWebhook(webhook, secret) {
  if (!secret) return webhook;

  const timestamp = Date.now();
  const sign = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}\n${secret}`)
    .digest("base64");

  const url = new URL(webhook);
  url.searchParams.set("timestamp", String(timestamp));
  url.searchParams.set("sign", sign);
  return url.toString();
}

