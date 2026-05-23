import { db } from "../database/database.js";

export class LeituraModel {
    static listar() {
        return new Promise((resolve, reject) => {
        db.all("SELECT * FROM leituras", (error, rows) => {
            if (error) reject(error);
            resolve(rows);
        });
        });
    }

    static buscarPorId(id: number) {
        return new Promise((resolve, reject) => {
        db.get("SELECT * FROM leituras WHERE id = ?", [id], (error, row) => {
            if (error) reject(error);
            resolve(row);
        });
        });
    }

    static criar(smartcupId: number, mesaId: number, peso: number, data: string) {
        return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO leituras (smartcup_id, mesa_id, peso, data) VALUES (?, ?, ?, ?)",
            [smartcupId, mesaId, peso, data],
            function (error) {
            if (error) reject(error);
            resolve(this.lastID);
            }
        );
        });
    }

    static buscarPorMesa(mesaId: number) {
        return new Promise((resolve, reject) => {
        db.all(
            "SELECT * FROM leituras WHERE mesa_id = ? ORDER BY data DESC",
            [mesaId],
            (error, rows) => {
            if (error) reject(error);
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
            if (error) reject(error);
            resolve(rows);
            }
        );
        });
    }
}