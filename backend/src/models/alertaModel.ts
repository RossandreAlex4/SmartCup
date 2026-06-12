import { db } from "../database/database.js";

export class AlertaModel {
  static listarAtivos(zona?: string) {
    return new Promise((resolve, reject) => {
      db.all(
        `
        SELECT a.id, a.tipo, a.resolvido, a.data, a.mesa_id, a.smartcup_id, m.nome AS mesa_nome
        FROM alertas a
        INNER JOIN mesas m ON a.mesa_id = m.id
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

  static resolverTodos(zona?: string) {
    return new Promise((resolve, reject) => {
      if (!zona) {
        db.run("UPDATE alertas SET resolvido = 1 WHERE resolvido = 0", [], (error) => {
          if (error) { reject(error); return; }
          resolve(true);
        });
      } else {
        db.run(
          "UPDATE alertas SET resolvido = 1 WHERE resolvido = 0 AND mesa_id IN (SELECT id FROM mesas WHERE zona = ?)",
          [zona],
          (error) => {
            if (error) { reject(error); return; }
            resolve(true);
          }
        );
      }
    });
  }

  static resolverTodosDaMesa(mesaId: number) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE alertas SET resolvido = 1 WHERE mesa_id = ? AND resolvido = 0",
        [mesaId],
        (error) => {
          if (error) { reject(error); return; }
          resolve(true);
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
  static buscarAlertaAtivoSmartcup(smartcupId: number, tipo: string) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT id FROM alertas
         WHERE smartcup_id = ? AND tipo = ? AND resolvido = 0
         AND datetime(data) > datetime('now', '-15 minutes')`,
        [smartcupId, tipo],
        (error, row) => {
          if (error) { reject(error); return; }
          resolve(row);
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
