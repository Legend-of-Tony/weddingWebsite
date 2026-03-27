import Database from 'better-sqlite3';

const db = new Database('./server/database/wedding.db');

export default db;