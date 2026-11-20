import Database from 'better-sqlite3';
import { PLANT } from '../config.js';

const db = new Database('control_system.db');

function initDatabase() {
    db.exec('CREATE TABLE IF NOT EXISTS PLANT (name TEXT PRIMARY KEY, value TEXT)');

    function insertTable(tableName, entries) {
        const stmt = db.prepare(`INSERT OR REPLACE INTO "${tableName}" (name, value) VALUES (?, ?)`);
        entries.forEach((entry) => {
            const obj = {};
            entry.keys.forEach(key => { obj[key] = 0; });
            stmt.run(entry.name, JSON.stringify(obj));
        });
    }

    insertTable('PLANT', PLANT);
}

initDatabase();