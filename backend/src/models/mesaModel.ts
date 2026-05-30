import { db } from "../database/database.js";
import { SmartcupModel } from "./smartcupModel.js";

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
    static configurarEvento(qtdMesas: number, qtdZonas: number, volumeCopo: number, gatilhoAlerta: number, nomeEvento: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run("DELETE FROM mesas", (error) => {
                    if (error) return reject(error);
                });

                db.run("DELETE FROM alertas", (error) => {
                if (error) console.log("Aviso ao limpar alertas:", error.message);
            });

            db.run("DELETE FROM smartcups", (error) => {
                if (error) console.log("Aviso ao limpar smartcups:", error.message);
            });

                db.run("DELETE FROM tokens_acesso", (error) => {
                if (error) return reject(error);
            });

            db.run("DELETE FROM sqlite_sequence WHERE name IN ('mesas', 'tokens_acesso', 'smartcups', 'alertas', 'configuracoes')", (error) => {
                if (error) console.log("Aviso ao limpar sequencias:", error);
            });

            db.run(
                    "INSERT INTO configuracoes (nome_evento, volume_copo, gatilho_alerta) VALUES (?, ?, ?)",
                    [nomeEvento, volumeCopo, gatilhoAlerta],
                    (error) => {
                        if (error) return reject(error);
                    }
                );

            const inserirMesa = (nome: string, zona: string, status: string): Promise<number> => {
                    return new Promise((resolve, reject) => {
                        db.run(
                            "INSERT INTO mesas (nome, zona, status) VALUES (?, ?, ?)",
                            [nome, zona, status],
                            function (error) {
                                if (error) return reject(error);
                                resolve(this.lastID); 
                            }
                        );
                    });
                };
            

            async function gerarEstruturaDoEvento() {
                    try {
                        const letras = [
                            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 
                            "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

                const mesasPorZona = Math.ceil(qtdMesas / qtdZonas)

                for (let i = 1; i <= qtdMesas; i++) {
                    const nomeMesa = `Mesa ${i < 10 ? '0' + i : i}`;
                    const indiceZona = Math.floor((i - 1) / mesasPorZona) % qtdZonas;
                    const nomeZona = `Zona ${letras[indiceZona] || "Extra"}`;

                    const novaMesaId = await inserirMesa(nomeMesa, nomeZona, "Ativa");
                    await SmartcupModel.criarCoposDaMesa(novaMesaId, i);
                    }
                    
                    resolve(true);
                    } catch (error) {
                        reject(error);
                    }
                }
                gerarEstruturaDoEvento();
            });
        });
    }
}
              
