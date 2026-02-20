import fs from "node:fs";
import path from "node:path";

const envPath = path.resolve(process.cwd(), ".env");

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing .env file at ${filePath}`);
  }

  const entries = {};
  const lines = fs.readFileSync(filePath, "utf8").split("\n");
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const delimiterIndex = line.indexOf("=");
    if (delimiterIndex <= 0) continue;
    const key = line.slice(0, delimiterIndex).trim();
    const value = line.slice(delimiterIndex + 1).trim();
    entries[key] = value;
  }
  return entries;
}

async function main() {
  const env = readEnvFile(envPath);
  const apiKey = env.VITE_FIREBASE_API_KEY;

  if (!apiKey) {
    throw new Error("VITE_FIREBASE_API_KEY is missing in .env");
  }

  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ returnSecureToken: true }),
  });

  const payload = await response.json();
  const message = payload?.error?.message ?? "";

  if (message.includes("API_KEY_EXPIRED") || message.includes("INVALID_API_KEY")) {
    console.error("FAIL: Firebase API key is invalid/expired for Auth.");
    console.error(`Response: ${message}`);
    process.exit(1);
  }

  if (message.includes("MISSING_EMAIL") || message.includes("INVALID_EMAIL")) {
    console.log("PASS: Firebase API key is valid for Identity Toolkit (Auth).");
    process.exit(0);
  }

  if (!response.ok) {
    console.error(`FAIL: Firebase key check returned ${response.status}.`);
    console.error(`Response: ${message || JSON.stringify(payload)}`);
    process.exit(1);
  }

  console.log("PASS: Firebase key check completed.");
}

main().catch((error) => {
  console.error(`FAIL: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
