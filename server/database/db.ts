import Database from 'better-sqlite3';

const db = new Database('./database/wedding.db');

export default db;