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

  // db.get(`SELECT COUNT(*) AS total FROM mesas`, (err, row: any) => {
  //   if (err) return console.error(err.message);

  //   if (!row || row.total === 0) {
  //     db.run(
  //       `INSERT INTO mesas (nome, zona, status) VALUES (?, ?, ?)`, 
  //       ["Mesa 01", "Zona A", "Ativa"]
  //     );
  //     db.run(
  //       `INSERT INTO mesas (nome, zona, status) VALUES (?, ?, ?)`, 
  //       ["Mesa 02", "Zona B", "Ativa"]
  //     );
  //   }
  // });

  // db.get(`SELECT COUNT(*) AS total FROM smartcups`, (err, row: any) => {
  //   if (err) return console.error(err.message);

  //   if (!row || row.total === 0) {
  //     db.run(
  //       `INSERT INTO smartcups (identificador, mesa_id, status, peso_atual) VALUES (?, ?, ?, ?)`,
  //       ["SC-001", 1, "Ativo", 70]
  //     );
  //   }
  // });

  // db.get(`SELECT COUNT(*) AS total FROM alertas`, (err, row: any) => {
  //   if (err) return console.error(err.message);

  //   if (!row || row.total === 0) {
  //     db.run(
  //       `INSERT INTO alertas (mesa_id, smartcup_id, tipo, resolvido, data) VALUES (?, ?, ?, ?, ?)`,
  //       [1, 1, "Bebida baixa", 0, "2026-05-13"]
  //     );
  //   }
  // });
  console.log("Seed executado com sucesso!");
});