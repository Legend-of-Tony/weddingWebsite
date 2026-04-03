import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENV_FILE_PATH = path.resolve(__dirname, "../.env");

const parseEnvLine = (line: string) => {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith("#")) {
    return null;
  }

  const separatorIndex = trimmed.indexOf("=");

  if (separatorIndex === -1) {
    return null;
  }

  const key = trimmed.slice(0, separatorIndex).trim();
  let value = trimmed.slice(separatorIndex + 1).trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return { key, value };
};

export const loadServerEnv = () => {
  if (!fs.existsSync(ENV_FILE_PATH)) {
    return;
  }

  const envFile = fs.readFileSync(ENV_FILE_PATH, "utf8");
  const lines = envFile.split(/\r?\n/);

  for (const line of lines) {
    const entry = parseEnvLine(line);

    if (!entry) {
      continue;
    }

    if (!process.env[entry.key]) {
      process.env[entry.key] = entry.value;
    }
  }
};
