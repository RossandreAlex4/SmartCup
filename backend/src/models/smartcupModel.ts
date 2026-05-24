import { db } from "../database/database.js";

export class SmartCupModel {
    static listar() {
        return new Promise((resolve, reject) => {
        db.all("SELECT * FROM smartcups", (error, rows) => {
            if (error) reject(error);
            resolve(rows);
        });
        });
    }

    static buscarPorId(id: number) {
        return new Promise((resolve, reject) => {
        db.get("SELECT * FROM smartcups WHERE id = ?", [id], (error, row) => {
            if (error) reject(error);
            resolve(row);
        });
        });
    }

    static criar(
        identificador: string,
        mesaId: number,
        status: string,
        pesoAtual: number,
        ultimaComunicacao: string
    ) {
        return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO smartcups (identificador, mesa_id, status, peso_atual, ultima_comunicacao) VALUES (?, ?, ?, ?, ?)",
            [identificador, mesaId, status, pesoAtual, ultimaComunicacao],
            function (error) {
            if (error) reject(error);
            resolve(this.lastID);
            }
        );
        });
    }

    static atualizar(
        id: number,
        status: string,
        pesoAtual: number,
        ultimaComunicacao: string
    ) {
        return new Promise<number>((resolve, reject) => {
        db.run(
            "UPDATE smartcups SET status = ?, peso_atual = ?, ultima_comunicacao = ? WHERE id = ?",
            [status, pesoAtual, ultimaComunicacao, id],
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
        return new Promise<number>((resolve, reject) => {
        db.run("DELETE FROM smartcups WHERE id = ?", [id], function (error) {
            if (error) {
            return reject(error);
            }

            resolve(this.changes);
        });
        });
    }

    static buscarLeiturasDoSmartcup(smartcupId: number) {
        return new Promise((resolve, reject) => {
        db.all(
            "SELECT * FROM leituras WHERE smartcup_id = ?",
            [smartcupId],
            (error, rows) => {
            if (error) reject(error);
            resolve(rows);
            }
        );
        });
    }
}
