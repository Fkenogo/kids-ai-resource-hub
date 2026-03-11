import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const projectRoot = path.resolve(__dirname, "..", "..");

const stripWrappingQuotes = (value) => {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
};

const parseEnvFile = (contents) => {
  const entries = {};

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const delimiterIndex = line.indexOf("=");
    if (delimiterIndex <= 0) continue;

    const key = line.slice(0, delimiterIndex).trim();
    const value = stripWrappingQuotes(line.slice(delimiterIndex + 1).trim());
    entries[key] = value;
  }

  return entries;
};

export const loadProjectEnv = ({
  files = [".env", ".env.local", ".env.migration"],
} = {}) => {
  const shellDefinedKeys = new Set(Object.keys(process.env));

  for (const relativePath of files) {
    const filePath = path.resolve(projectRoot, relativePath);
    if (!fs.existsSync(filePath)) continue;

    const entries = parseEnvFile(fs.readFileSync(filePath, "utf8"));
    for (const [key, value] of Object.entries(entries)) {
      if (shellDefinedKeys.has(key)) continue;
      process.env[key] = value;
    }
  }
};

export const optionalEnv = (key, fallbacks = []) => {
  for (const candidate of [key, ...fallbacks]) {
    const value = process.env[candidate];
    if (value) return value;
  }
  return undefined;
};

export const requireEnv = (key, fallbacks = []) => {
  const value = optionalEnv(key, fallbacks);
  if (!value) {
    const fallbackText = fallbacks.length > 0 ? ` (fallbacks: ${fallbacks.join(", ")})` : "";
    throw new Error(`Missing required env var: ${key}${fallbackText}`);
  }
  return value;
};

export const getFirebaseWebConfig = () => ({
  apiKey: requireEnv("VITE_FIREBASE_API_KEY"),
  authDomain: requireEnv("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: requireEnv("VITE_FIREBASE_PROJECT_ID", ["FIREBASE_PROJECT_ID"]),
  storageBucket: requireEnv("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: requireEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: requireEnv("VITE_FIREBASE_APP_ID"),
  measurementId: optionalEnv("VITE_FIREBASE_MEASUREMENT_ID"),
});

export const getFirebaseProjectId = () =>
  requireEnv("FIREBASE_PROJECT_ID", ["VITE_FIREBASE_PROJECT_ID"]);

export const getFirebaseAdminServiceAccountEnv = () => ({
  projectId: getFirebaseProjectId(),
  privateKeyId: requireEnv("FIREBASE_PRIVATE_KEY_ID"),
  privateKey: requireEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
  clientEmail: requireEnv("FIREBASE_CLIENT_EMAIL"),
  clientId: requireEnv("FIREBASE_CLIENT_ID"),
  clientX509CertUrl: requireEnv("FIREBASE_CLIENT_X509_CERT_URL"),
});
