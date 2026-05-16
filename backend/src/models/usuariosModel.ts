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
}