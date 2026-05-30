import { db } from "../database/database.js";

export class SmartcupModel {

    static listar() {

        return new Promise((resolve, reject) => {

            db.all(
                "SELECT * FROM smartcups ORDER BY id DESC",
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
                "SELECT * FROM smartcups WHERE id = ?",
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
        identificador: string,
        mesa_id: number | null,
        status: string,
        peso_atual: number,
        ultima_comunicacao: string
    ) {

        return new Promise((resolve, reject) => {

            db.run(
                `
                INSERT INTO smartcups
                (
                    identificador,
                    mesa_id,
                    status,
                    peso_atual,
                    ultima_comunicacao
                )
                VALUES (?, ?, ?, ?, ?)
                `,
                [
                    identificador,
                    mesa_id,
                    status,
                    peso_atual,
                    ultima_comunicacao
                ],
                function (error) {

                    if (error) {
                        return reject(error);
                    }

                    resolve(this.lastID);

                }
            );

        });

    }

    static atualizar(
        id: number,
        identificador: string,
        mesa_id: number,
        status: string,
        peso_atual: number,
        ultima_comunicacao: string
    ) {

        return new Promise((resolve, reject) => {

            db.run(
                `
                UPDATE smartcups
                SET
                    identificador = ?,
                    mesa_id = ?,
                    status = ?,
                    peso_atual = ?,
                    ultima_comunicacao = ?
                WHERE id = ?
                `,
                [
                    identificador,
                    mesa_id,
                    status,
                    peso_atual,
                    ultima_comunicacao,
                    id
                ],
                function (error) {

                    if (error) {
                        return reject(error);
                    }

                    resolve(this.changes);

                }
            );

        });

    }

    static deletar(id: number) {

        return new Promise((resolve, reject) => {

            db.run(
                "DELETE FROM smartcups WHERE id = ?",
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

    static buscarPorMesa(mesaId: number) {

        return new Promise((resolve, reject) => {

            db.all(
                "SELECT * FROM smartcups WHERE mesa_id = ?",
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

    static criarCoposDaMesa(mesaId: number, numeroMesa: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const stmtCup = db.prepare(
                "INSERT INTO smartcups (identificador, mesa_id, status, peso_atual, ultima_comunicacao) VALUES (?, ?, ?, ?, ?)"
            );

            const prefixoMesa = numeroMesa < 10 ? `0${numeroMesa}` : numeroMesa;
            const dataAtual = new Date().toISOString();

            for (let j = 1; j <= 4; j++) {
                const identificador = `SC-${prefixoMesa}-${j}`;
                stmtCup.run(identificador, mesaId, "ativo", 0, dataAtual);
            }

            stmtCup.finalize((error) => {
                if (error) return reject(error);
                resolve();
            });
        });
    }

}
