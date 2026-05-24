import { db } from "../database/database.js";

export class UsuarioModel {
  static buscarPorEmail(email: string) {
    return new Promise((resolve, reject) => {
      db.get(
        `
        SELECT *
        FROM usuarios
        WHERE email = ?
        `,
        [email],
        (error, row) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(row);
        }
      );
    });
  }

  static criarTokenGarcom(nome: string, token: string) {
    return new Promise((resolve, reject) => {
      const criadoEm = new Date().toISOString();
      db.run(
        "INSERT INTO tokens_acesso (nome, token, criado_em) VALUES (?, ?, ?)",
        [nome, token, criadoEm],
        function (error) {
          if (error) {
            reject(error);
            return;
          }
          resolve(this.lastID);
        }
      );
    });
  }

  static buscarToken(token: string) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM tokens_acesso WHERE token = ?",
        [token],
        (error, row) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(row);
        }
      );
    });
  }

  static listarTokens() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM tokens_acesso ORDER BY id DESC", (error, rows) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(rows);
      });
    });
  }

  static deletarToken(id: number) {
    return new Promise<number>((resolve, reject) => {
      db.run("DELETE FROM tokens_acesso WHERE id = ?", [id], function (error) {
        if (error) {
          return reject(error);
        }

        resolve(this.changes);
      });
    });
  }

  static deletarTodosTokens() {
    return new Promise<number>((resolve, reject) => {
      db.run("DELETE FROM tokens_acesso", function (error) {
        if (error) {
          return reject(error);
        }

        resolve(this.changes);
      });
    });
  }
}
