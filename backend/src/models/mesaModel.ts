import { db } from "../database/database.js";

export class MesaModel {
    static listar() {
        return new Promise((resolve, reject) => {
        db.all("SELECT * FROM mesas", (error, rows) => {
            if (error) reject(error);
            resolve(rows);
        });
        });
    }

    static buscarPorId(id: number) {
        return new Promise((resolve, reject) => {
        db.get("SELECT * FROM mesas WHERE id = ?", [id], (error, row) => {
            if (error) reject(error);
            resolve(row);
        });
        });
    }

    static criar(nome: string, zona: string, status: string) {
        return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO mesas (nome, zona, status) VALUES (?, ?, ?)",
            [nome, zona, status],
            function (error) {
            if (error) reject(error);
            resolve(this.lastID);
            }
        );
        });
    }

    static atualizar(id: number, nome: string, zona: string, status: string) {
        return new Promise((resolve, reject) => {
        db.run(
            "UPDATE mesas SET nome = ?, zona = ?, status = ? WHERE id = ?",
            [nome, zona, status, id],
            (error) => {
            if (error) reject(error);
            resolve(true);
            }
        );
        });
    }

    static deletar(id: number) {
        return new Promise((resolve, reject) => {
        db.run("DELETE FROM mesas WHERE id = ?", [id], (error) => {
            if (error) reject(error);
            resolve(true);
        });
        });
    }

    static buscarSmartcupsDaMesa(mesaId: number) {
        return new Promise((resolve, reject) => {
        db.all(
            "SELECT * FROM smartcups WHERE mesa_id = ?",
            [mesaId],
            (error, rows) => {
            if (error) reject(error);
            resolve(rows);
            }
        );
        });
    }
}