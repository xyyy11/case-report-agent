#!/usr/bin/env node
import { runAgent } from "./agent.js";

const [, , command = "run", ...args] = process.argv;

if (command !== "run") {
  console.error("Usage: case-report-agent run [--dry-run] [--config path] [--min-score 60]");
  process.exit(1);
}

const options = parseArgs(args);

try {
  const result = await runAgent(options);
  console.log(`Report written: ${result.reportPath}`);
  console.log(`Cases selected: ${result.cases.length}`);
  if (options.dryRun) {
    console.log(result.report);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

function parseArgs(args) {
  const options = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--dry-run") options.dryRun = true;
    if (arg === "--config") options.config = args[++index];
    if (arg === "--min-score") options.minScore = args[++index];
  }

  return options;
}

