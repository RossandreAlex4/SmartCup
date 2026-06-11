import { db } from "../database/database.js";

export class LeituraModel {
    static listar() {
        return new Promise((resolve, reject) => {
            db.all(
                "SELECT * FROM leituras ORDER BY data DESC LIMIT 100",
                (error, rows) => {
                    if (error) {
                        return reject(error);
                    }

                    resolve(rows);
                }
            );
        });
    }

    static buscarPorId(id: number) {
        return new Promise((resolve, reject) => {
            db.get(
                "SELECT * FROM leituras WHERE id = ?",
                [id],
                (error, row) => {
                    if (error) {
                        return reject(error);
                    }

                    resolve(row);
                }
            );
        });
    }

    static criar(
        smartcupId: number,
        mesaId: number,
        peso: number,
        porcentagem: number,
        status: string,
        data: string
        ) {
        return new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO leituras (smartcup_id, mesa_id, peso, porcentagem, status, data) VALUES (?, ?, ?, ?, ?, ?)",
                [smartcupId, mesaId, peso, porcentagem, status, data],
                function (error) {
                    if (error) {
                        return reject(error);
                    }

                    resolve(this.lastID);
                }
            );
        });
    }

    static buscarPorMesa(mesaId: number) {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT l.* FROM leituras l
                 INNER JOIN (
                   SELECT smartcup_id, MAX(id) as max_id
                   FROM leituras WHERE mesa_id = ?
                   GROUP BY smartcup_id
                 ) latest ON l.id = latest.max_id`,
                [mesaId],
                (error, rows) => {
                    if (error) {
                        return reject(error);
                    }

                    resolve(rows);
                }
            );
        });
    }

    static buscarPorSmartcup(smartcupId: number) {
        return new Promise((resolve, reject) => {
            db.all(
                "SELECT * FROM leituras WHERE smartcup_id = ? ORDER BY data DESC",
                [smartcupId],
                (error, rows) => {
                    if (error) {
                        return reject(error);
                    }

                    resolve(rows);
                }
            );
        });
    }
    static async deletarTodas() {
        return new Promise((resolve, reject) => {
        db.run("DELETE FROM leituras", (error) => {
            if (error) {
            reject(error);
            return;
            }

            db.run("DELETE FROM sqlite_sequence WHERE name='leituras'", (error) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(true);
            });
        });
        });
    }
}