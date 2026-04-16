import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bundledDbPath = path.resolve(__dirname, "./wedding.db");
const dbPath = process.env.DATABASE_PATH
  ? path.resolve(process.env.DATABASE_PATH)
  : bundledDbPath;

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

if (process.env.DATABASE_PATH && !fs.existsSync(dbPath)) {
  fs.copyFileSync(bundledDbPath, dbPath);
  console.log(`Copied bundled SQLite database to persistent path ${dbPath}.`);
}

const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

console.log(`Connected to SQLite database with better-sqlite3 at ${dbPath}.`);

export default db;
