import { loadProjectEnv, requireEnv } from "./lib/env.mjs";

async function main() {
  loadProjectEnv();
  const apiKey = requireEnv("VITE_FIREBASE_API_KEY");

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
