import sqlite3 from "sqlite3";

const sqlite = sqlite3.verbose();

export const db = new sqlite.Database("./src/database/smartcup.db", (error) => {
  if (error) {
    console.log(error.message);
    return;
  }

  console.log("Banco SQLite conectado");
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      tipo TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS mesas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      zona TEXT,
      status TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS smartcups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      identificador TEXT UNIQUE NOT NULL,
      mesa_id INTEGER,
      status TEXT,
      peso_atual REAL,
      ultima_comunicacao TEXT,
      FOREIGN KEY (mesa_id) REFERENCES mesas(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS leituras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      smartcup_id INTEGER NOT NULL,
      mesa_id INTEGER NOT NULL,
      peso REAL NOT NULL,
      porcentagem REAL NOT NULL,
      status TEXT NOT NULL,
      data TEXT NOT NULL,
      FOREIGN KEY (smartcup_id) REFERENCES smartcups(id),
      FOREIGN KEY (mesa_id) REFERENCES mesas(id)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS alertas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mesa_id INTEGER,
      smartcup_id INTEGER,
      tipo TEXT,
      resolvido BOOLEAN DEFAULT 0,
      data TEXT,
      FOREIGN KEY (mesa_id) REFERENCES mesas(id),
      FOREIGN KEY (smartcup_id) REFERENCES smartcups(id)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS tokens_acesso (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT UNIQUE NOT NULL,
      nome TEXT NOT NULL,
      criado_em TEXT NOT NULL,
      zona TEXT
    )
  `);

  db.run("ALTER TABLE tokens_acesso ADD COLUMN zona TEXT", (error) => {
  });

  console.log("Tabelas criadas");

db.run(`
  CREATE TABLE IF NOT EXISTS configuracoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_evento TEXT,
    volume_copo INTEGER,
    peso_copo_vazio INTEGER,
    status_configuracao BOOLEAN DEFAULT 0
  )
`);

});