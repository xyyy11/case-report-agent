export async function collectCases(sources) {
  const allItems = [];

  for (const source of sources) {
    if (source.type === "manual") {
      allItems.push(...collectManual(source));
      continue;
    }

    if (source.type === "rss") {
      allItems.push(...await collectRss(source));
      continue;
    }

    throw new Error(`Unsupported source type: ${source.type}`);
  }

  return dedupeByUrl(allItems);
}

function collectManual(source) {
  return (source.items ?? []).map((item) => ({
    sourceId: source.id,
    sourceName: source.name,
    title: item.title,
    url: item.url,
    summary: item.summary ?? "",
    tags: item.tags ?? []
  }));
}

async function collectRss(source) {
  const response = await fetch(source.url);
  if (!response.ok) {
    throw new Error(`Failed to fetch RSS source ${source.id}: ${response.status}`);
  }

  const xml = await response.text();
  return parseRss(xml).map((item) => ({
    sourceId: source.id,
    sourceName: source.name,
    title: item.title,
    url: item.link,
    summary: item.description,
    tags: source.keywords ?? []
  }));
}

function parseRss(xml) {
  const items = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)];
  return items.map(([item]) => ({
    title: textBetween(item, "title"),
    link: textBetween(item, "link"),
    description: textBetween(item, "description")
  })).filter((item) => item.title && item.link);
}

function textBetween(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return decodeXml(match?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, "").trim() ?? "");
}

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'");
}

function dedupeByUrl(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

