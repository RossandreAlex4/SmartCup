import { db } from "../database/database.js";

export class AlertaModel {
  static listarAtivos() {
    return new Promise((resolve, reject) => {
      db.all(
        `
        SELECT a.id, a.tipo, a.resolvido, a.data, a.mesa_id, m.nome AS mesa_nome
        FROM alertas a
        LEFT JOIN mesas m ON a.mesa_id = m.id
        WHERE a.resolvido = 0
        ORDER BY a.id DESC
        `,
        (error, rows) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(rows);
        }
      );
    });
  }

  static resolver(id: number) {
    return new Promise<number>((resolve, reject) => {
      db.run(
        "UPDATE alertas SET resolvido = 1 WHERE id = ?",
        [id],
        function (error) {
          if (error) {
            return reject(error);
          }

          resolve(this.changes);
        }
      );
    });
  }

  static criar(mesaId: number, tipo: string) {
    return new Promise((resolve, reject) => {
      const data = new Date().toISOString();
      db.run(
        "INSERT INTO alertas (mesa_id, tipo, data) VALUES (?, ?, ?)",
        [mesaId, tipo, data],
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
}
