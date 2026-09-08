// db.js — SQLite using sql.js (pure JavaScript, no build tools needed)
const path = require('path');
const fs   = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const DB_PATH = path.join(dataDir, 'abinaya.db');

let db;
let _ready;

function init() {
  if (_ready) return _ready;
  _ready = (async () => {
    const initSqlJs = require('sql.js');
    const SQL = await initSqlJs();

    if (fs.existsSync(DB_PATH)) {
      const fileBuffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(fileBuffer);
      console.log('✅ Loaded existing database from disk');
    } else {
      db = new SQL.Database();
      console.log('✅ Created new database');
    }

    db.run(`
      CREATE TABLE IF NOT EXISTS applications (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name  TEXT DEFAULT '',
        email      TEXT NOT NULL,
        phone      TEXT DEFAULT '',
        service    TEXT NOT NULL,
        message    TEXT DEFAULT '',
        status     TEXT DEFAULT 'new',
        ip_address TEXT DEFAULT '',
        created_at TEXT DEFAULT (datetime('now','localtime'))
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS contacts (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        name       TEXT NOT NULL,
        email      TEXT NOT NULL,
        subject    TEXT DEFAULT '',
        message    TEXT NOT NULL,
        status     TEXT DEFAULT 'new',
        ip_address TEXT DEFAULT '',
        created_at TEXT DEFAULT (datetime('now','localtime'))
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS page_views (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        page       TEXT DEFAULT '',
        ip_address TEXT DEFAULT '',
        user_agent TEXT DEFAULT '',
        visited_at TEXT DEFAULT (datetime('now','localtime'))
      )
    `);

    saveToDisk();
    console.log('✅ Database tables ready at:', DB_PATH);
  })();
  return _ready;
}

function saveToDisk() {
  try {
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  } catch (err) {
    console.error('❌ DB save error:', err.message);
  }
}

function run(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.run(params);
  stmt.free();
  const idResult = db.exec('SELECT last_insert_rowid() as id');
  const lastId = (idResult[0] && idResult[0].values[0]) ? idResult[0].values[0][0] : null;
  saveToDisk();
  return { lastInsertRowid: lastId };
}

function all(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function get(sql, params = []) {
  const rows = all(sql, params);
  return rows[0] || null;
}

const stmts = {
  insertApplication(data) {
    console.log('💾 Inserting application for:', data.first_name, data.email);
    const result = run(
      `INSERT INTO applications (first_name, last_name, email, phone, service, message, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [data.first_name, data.last_name||'', data.email, data.phone||'', data.service, data.message||'', data.ip_address||'']
    );
    console.log('✅ Application saved with ID:', result.lastInsertRowid);
    return result;
  },
  getAllApplications() { return all('SELECT * FROM applications ORDER BY id DESC'); },
  getNewerApplications(sinceId) { return all('SELECT * FROM applications WHERE id > ? ORDER BY id DESC', [sinceId]); },
  updateApplicationStatus(status, id) { run('UPDATE applications SET status = ? WHERE id = ?', [status, id]); },
  deleteApplication(id) { run('DELETE FROM applications WHERE id = ?', [id]); },
  countApplications() { return get('SELECT COUNT(*) as count FROM applications'); },
  countNewApplications() { return get("SELECT COUNT(*) as count FROM applications WHERE status = 'new'"); },
  getMaxApplicationId() { return get('SELECT COALESCE(MAX(id),0) as id FROM applications'); },

  insertContact(data) {
    console.log('💾 Inserting contact from:', data.name, data.email);
    const result = run(
      `INSERT INTO contacts (name, email, subject, message, ip_address) VALUES (?, ?, ?, ?, ?)`,
      [data.name, data.email, data.subject||'', data.message, data.ip_address||'']
    );
    console.log('✅ Contact saved with ID:', result.lastInsertRowid);
    return result;
  },
  getAllContacts() { return all('SELECT * FROM contacts ORDER BY id DESC'); },
  getNewerContacts(sinceId) { return all('SELECT * FROM contacts WHERE id > ? ORDER BY id DESC', [sinceId]); },
  updateContactStatus(status, id) { run('UPDATE contacts SET status = ? WHERE id = ?', [status, id]); },
  deleteContact(id) { run('DELETE FROM contacts WHERE id = ?', [id]); },
  countNewContacts() { return get("SELECT COUNT(*) as count FROM contacts WHERE status = 'new'"); },
  getMaxContactId() { return get('SELECT COALESCE(MAX(id),0) as id FROM contacts'); },

  insertPageView(page, ip, ua) {
    run('INSERT INTO page_views (page, ip_address, user_agent) VALUES (?, ?, ?)', [page||'', ip||'', ua||'']);
  },
  getTotalViews() { return get('SELECT COUNT(*) as count FROM page_views'); },
  getRecentViews() { return get("SELECT COUNT(*) as count FROM page_views WHERE visited_at >= datetime('now', '-7 days')"); },
};

module.exports = { init, stmts };
