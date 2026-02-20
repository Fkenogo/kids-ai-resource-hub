import { spawn } from "node:child_process";
import process from "node:process";

const host = process.env.SMOKE_HOST ?? "127.0.0.1";
const port = process.env.SMOKE_PORT ?? "4174";
const baseUrl = `http://${host}:${port}`;

const routes = [
  "/",
  "/login",
  "/signup",
  "/resources",
  "/resources/r_teachable_machine",
  "/blog",
  "/community",
  "/shopping",
  "/admin",
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Wait and retry until timeout.
    }
    await delay(500);
  }
  throw new Error(`Preview server did not become ready within ${timeoutMs}ms at ${url}`);
}

function startPreview() {
  return spawn(
    "npm",
    ["run", "preview", "--", "--host", host, "--port", port, "--strictPort"],
    {
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
    },
  );
}

async function checkRoutes() {
  const failures = [];
  for (const route of routes) {
    const url = `${baseUrl}${route}`;
    try {
      const response = await fetch(url);
      const body = await response.text();
      const looksLikeAppShell = body.includes('id="root"');

      if (!response.ok || !looksLikeAppShell) {
        failures.push(
          `${route} -> status=${response.status}, appShell=${looksLikeAppShell ? "yes" : "no"}`,
        );
      } else {
        console.log(`PASS ${route} (${response.status})`);
      }
    } catch (error) {
      failures.push(`${route} -> fetch error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (failures.length > 0) {
    throw new Error(`Smoke route checks failed:\n${failures.map((f) => `- ${f}`).join("\n")}`);
  }
}

async function main() {
  const preview = startPreview();

  preview.stdout.on("data", (chunk) => {
    process.stdout.write(chunk);
  });
  preview.stderr.on("data", (chunk) => {
    process.stderr.write(chunk);
  });

  try {
    await waitForServer(baseUrl);
    await checkRoutes();
    console.log("Smoke route checks passed.");
  } finally {
    preview.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
