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

  static buscarConfiguracao() {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM configuracoes WHERE id = 1", (error, row) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(row);
    });
  });
}

  static criarTokenGarcom(nome: string, token: string, avatar: string | null = null) {
    return new Promise((resolve, reject) => {
      const criadoEm = new Date().toISOString();
      db.run(
        "INSERT INTO tokens_acesso (nome, token, criado_em, avatar) VALUES (?, ?, ?, ?)",
        [nome, token, criadoEm, avatar],
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

  static atualizarAvatarToken(token: string, avatar: string | null) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE tokens_acesso SET avatar = ? WHERE token = ?",
        [avatar, token],
        (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(true);
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
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM tokens_acesso WHERE id = ?", [id], (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(true);
      });
    });
  }

  static marcarOnline(id: number) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE tokens_acesso SET online = 1, ultimo_acesso = ? WHERE id = ?",
        [new Date().toISOString(), id],
        (error) => { if (error) reject(error); else resolve(true); }
      );
    });
  }

  static marcarOffline(token: string) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE tokens_acesso SET online = 0, ultimo_acesso = ? WHERE token = ?",
        [new Date().toISOString(), token],
        (error) => { if (error) reject(error); else resolve(true); }
      );
    });
  }

  static marcarTodosOffline() {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE tokens_acesso SET online = 0, ultimo_acesso = ?",
        [new Date().toISOString()],
        (error) => { if (error) reject(error); else resolve(true); }
      );
    });
  }

  static deletarTodosTokens() {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM tokens_acesso", (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(true);
      });
    });
  }
}