import { db } from "../database/database.js";

export class AlertaModel {
  static listarAtivos(zona?: string) {
    return new Promise((resolve, reject) => {
      db.all(
        `
        SELECT a.id, a.tipo, a.resolvido, a.data, a.mesa_id, m.nome AS mesa_nome
        FROM alertas a
        LEFT JOIN mesas m ON a.mesa_id = m.id
        WHERE a.resolvido = 0 AND (? IS NULL OR m.zona = ?)
        ORDER BY a.id DESC
        `,
        [zona || null, zona || null],
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
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE alertas SET resolvido = 1 WHERE id = ?",
        [id],
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

  static criar(mesaId: number, smartcupId: number, tipo: string) {
    return new Promise((resolve, reject) => {
      const data = new Date().toISOString();

      db.run(
        "INSERT INTO alertas (mesa_id, smartcup_id, tipo, data) VALUES (?, ?, ?, ?)",
        [mesaId, smartcupId, tipo, data],
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
  static buscarAlertaAtivo(mesaId: number) {
      return new Promise((resolve, reject) => {
        db.get(
          `
          SELECT *
          FROM alertas
          WHERE mesa_id = ?
          AND resolvido = 0
          `,
          [mesaId],
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
