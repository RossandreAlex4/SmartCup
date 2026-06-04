import { db } from "./database.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "mudando123_dev";
const SALT_ROUNDS = 10;
const senhaHash = bcrypt.hashSync(ADMIN_PASSWORD, SALT_ROUNDS);

db.serialize(() => {
  db.get(`SELECT COUNT(*) AS total FROM usuarios`, (err, row: any) => {
    if (err) return console.error(err.message);

    if (!row || row.total === 0) {
      db.run(
        `INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)`,
        ["Organizador(a)", "organizador@smartcup.com", senhaHash, "admin"]
      );
    }
  });
  db.get(`SELECT COUNT(*) AS total FROM mesas`, (err, row: any) => {
    if (err) return console.error(err.message);

    if (!row || row.total === 0) {
      db.run(`INSERT INTO mesas (nome, zona, status) VALUES (?, ?, ?)`, ["Mesa 01", "Zona A", "Normal"]);
      db.run(`INSERT INTO mesas (nome, zona, status) VALUES (?, ?, ?)`, ["Mesa 02", "Zona A", "Alerta"]);
      db.run(`INSERT INTO mesas (nome, zona, status) VALUES (?, ?, ?)`, ["Mesa 03", "Zona B", "Normal"]);
      db.run(`INSERT INTO mesas (nome, zona, status) VALUES (?, ?, ?)`, ["Mesa 04", "Zona B", "Alerta"]);
      console.log("Mesas de teste criadas.");
    }
  });

  db.get(`SELECT COUNT(*) AS total FROM smartcups`, (err, row: any) => {
    if (err) return console.error(err.message);

    if (!row || row.total === 0) {
      db.run(`
        INSERT INTO smartcups (identificador, mesa_id, status, peso_atual) 
        VALUES (?, (SELECT id FROM mesas WHERE nome = 'Mesa 01' LIMIT 1), ?, ?)
      `, ["SC-001", "Ativo", 75]);

      db.run(`
        INSERT INTO smartcups (identificador, mesa_id, status, peso_atual) 
        VALUES (?, (SELECT id FROM mesas WHERE nome = 'Mesa 02' LIMIT 1), ?, ?)
      `, ["SC-002", "Ativo", 20]); 

      console.log("SmartCups de teste vinculados dinamicamente.");
    }
  });

  db.get(`SELECT COUNT(*) AS total FROM alertas`, (err, row: any) => {
    if (err) return console.error(err.message);

    if (!row || row.total === 0) {
      db.run(`
        INSERT INTO alertas (mesa_id, smartcup_id, tipo, resolvido, data) 
        VALUES (
          (SELECT id FROM mesas WHERE nome = 'Mesa 02' LIMIT 1), 
          (SELECT id FROM smartcups WHERE identificador = 'SC-002' LIMIT 1), 
          ?, ?, ?
        )
      `, ["Bebida baixa", 0, "2026-06-04"]);
      
      console.log("Alertas de teste gerados.");
    }
  });

  console.log("Seed executado com sucesso!");
});