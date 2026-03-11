#!/usr/bin/env node

import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { projectRoot } from "./lib/env.mjs";

const EXCLUDED_FILES = new Set([
  ".env.example",
  "docs/SECURITY_AUDIT_REPORT.md",
]);

const PLACEHOLDER_MARKERS = [
  "your_api_key",
  "your_private_key_content",
  "your_project_id",
  "your_service_account_email",
  "/path/to/service-account.json",
];

const RULES = [
  { name: "Google API key", pattern: /AIza[0-9A-Za-z_-]{20,}/g },
  { name: "OpenAI-style key", pattern: /sk-[A-Za-z0-9]{16,}/g },
  { name: "Private key block", pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
  { name: "Firebase service account field", pattern: /"private_key"\s*:\s*"[^"]+/g },
  { name: "Generic bearer token", pattern: /bearer\s+[A-Za-z0-9._-]{20,}/gi },
];

const listFiles = () => {
  const output = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard"],
    { cwd: projectRoot, encoding: "utf8" },
  );

  return output
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((file) => !EXCLUDED_FILES.has(file));
};

const isPlaceholderOnly = (match) =>
  PLACEHOLDER_MARKERS.some((marker) => match.includes(marker));

const isAllowedPlaceholderContext = ({ file, lineIndex, lines, ruleName, match }) => {
  if (isPlaceholderOnly(match)) return true;

  if (
    ruleName === "Private key block" &&
    file.startsWith("docs/") &&
    lines
      .slice(Math.max(0, lineIndex - 1), Math.min(lines.length, lineIndex + 3))
      .some((line) => line.includes("your_private_key_content"))
  ) {
    return true;
  }

  return false;
};

const findings = [];
for (const relativePath of listFiles()) {
  let content;

  try {
    content = execFileSync("git", ["show", `:${relativePath}`], {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    try {
      content = fs.readFileSync(`${projectRoot}/${relativePath}`, "utf8");
    } catch {
      continue;
    }
  }

  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const rule of RULES) {
      const matches = line.match(rule.pattern);
      if (!matches) continue;

      for (const match of matches) {
        if (
          isAllowedPlaceholderContext({
            file: relativePath,
            lineIndex: index,
            lines,
            ruleName: rule.name,
            match,
          })
        ) {
          continue;
        }
        findings.push({
          file: relativePath,
          line: index + 1,
          rule: rule.name,
        });
      }
    }
  });
}

let trackedServiceAccounts = "";
try {
  trackedServiceAccounts = execFileSync(
    "git",
    ["ls-files", "*firebase-adminsdk*.json", "*service-account*.json"],
    { cwd: projectRoot, encoding: "utf8" },
  );
} catch {
  trackedServiceAccounts = "";
}

for (const file of trackedServiceAccounts.split(/\r?\n/).filter(Boolean)) {
  findings.push({
    file,
    line: 1,
    rule: "Tracked service account JSON",
  });
}

if (findings.length > 0) {
  console.error("Secret scan failed:");
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line} (${finding.rule})`);
  }
  process.exit(1);
}

console.log("Secret scan passed.");
