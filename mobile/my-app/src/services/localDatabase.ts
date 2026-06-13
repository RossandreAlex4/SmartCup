import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase;
let initPromise: Promise<void> | null = null;

export function initDatabase(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      db = await SQLite.openDatabaseAsync("smartcup_local.db");
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS leituras (
          id INTEGER PRIMARY KEY,
          smartcup_id INTEGER NOT NULL,
          mesa_id INTEGER NOT NULL,
          peso REAL,
          porcentagem REAL,
          status TEXT,
          criado_em TEXT
        );
        CREATE TABLE IF NOT EXISTS configuracoes (
          chave TEXT PRIMARY KEY,
          valor TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS mesas_cache (
          id INTEGER PRIMARY KEY,
          dados TEXT NOT NULL
        );
      `);
    })();
  }
  return initPromise;
}

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  await initDatabase();
  return db;
}

export async function salvarLeituras(leituras: any[]) {
  const database = await getDb();
  for (const l of leituras) {
    await database.runAsync(
      `INSERT OR REPLACE INTO leituras (id, smartcup_id, mesa_id, peso, porcentagem, status, criado_em)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [l.id ?? null, l.smartcup_id, l.mesa_id, l.peso ?? null, l.porcentagem ?? null, l.status ?? null, l.criado_em ?? null]
    );
  }
}

export async function buscarLeiturasLocais(mesaId: number): Promise<any[]> {
  const database = await getDb();
  return await database.getAllAsync(
    `SELECT * FROM leituras WHERE mesa_id = ? ORDER BY id DESC`,
    [mesaId]
  );
}

export async function salvarConfiguracao(chave: string, valor: string) {
  const database = await getDb();
  await database.runAsync(
    `INSERT OR REPLACE INTO configuracoes (chave, valor) VALUES (?, ?)`,
    [chave, valor]
  );
}

export async function buscarConfiguracao(chave: string): Promise<string | null> {
  const database = await getDb();
  const row = await database.getFirstAsync<{ valor: string }>(
    `SELECT valor FROM configuracoes WHERE chave = ?`,
    [chave]
  );
  return row?.valor ?? null;
}

export async function salvarMesaCache(mesaId: number, dados: any) {
  const database = await getDb();
  await database.runAsync(
    `INSERT OR REPLACE INTO mesas_cache (id, dados) VALUES (?, ?)`,
    [mesaId, JSON.stringify(dados)]
  );
}

export async function buscarMesaCache(mesaId: number): Promise<any | null> {
  const database = await getDb();
  const row = await database.getFirstAsync<{ dados: string }>(
    `SELECT dados FROM mesas_cache WHERE id = ?`,
    [mesaId]
  );
  return row ? JSON.parse(row.dados) : null;
}
