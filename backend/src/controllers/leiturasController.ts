import type { Request, Response } from "express";
import { LeituraModel } from "../models/leituraModel.js";

export class LeituraController {
    static async listar(req: Request, res: Response) {
        try {
            const leituras = await LeituraModel.listar();

            res.json({
                sucesso: true,
                leituras
            });
        } catch (error: any) {
            res.status(500).json({
                sucesso: false,
                mensagem: error.message
            });
        }
    }

    static async obterPorId(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "ID inválido"
                });
            }

            const leitura = await LeituraModel.buscarPorId(id);

            if (!leitura) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: "Leitura não encontrada"
                });
            }

            res.json({
                sucesso: true,
                leitura
            });
        } catch (error: any) {
            res.status(500).json({
                sucesso: false,
                mensagem: error.message
            });
        }
    }

    static async criar(req: Request, res: Response) {
        try {
            const { smartcup_id, mesa_id, peso, porcentagem, status, data } = req.body;

            if (!smartcup_id || !mesa_id || peso === undefined || porcentagem === undefined || status === undefined) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "smartcup_id, mesa_id, peso, porcentagem e status são obrigatórios"
                });
            }

            if (typeof peso !== "number") {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "O peso deve ser um número"
                });
            }

            if (typeof porcentagem !== "number") {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "A porcentagem deve ser um número"
                });
            }

            if (typeof status !== "string") {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "O status deve ser um texto"
                });

            }

            const leituraId = await LeituraModel.criar(
                Number(smartcup_id),
                Number(mesa_id),
                peso,
                porcentagem,
                status,
                data || new Date().toISOString()
            );

            res.status(201).json({
                sucesso: true,
                mensagem: "Leitura cadastrada com sucesso",
                leituraId
            });
        } catch (error: any) {
            res.status(500).json({
                sucesso: false,
                mensagem: error.message
            });
        }
    }

    static async obterPorMesa(req: Request, res: Response) {
        try {
            const mesaId = Number(req.params.mesaId);

            if (isNaN(mesaId)) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "ID da mesa inválido"
                });
            }

            const leituras = await LeituraModel.buscarPorMesa(mesaId);

            res.json({
                sucesso: true,
                leituras
            });
        } catch (error: any) {
            res.status(500).json({
                sucesso: false,
                mensagem: error.message
            });
        }
    }

    static async obterPorSmartcup(req: Request, res: Response) {
        try {
            const smartcupId = Number(req.params.smartcupId);

            if (isNaN(smartcupId)) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "ID do SmartCup inválido"
                });
            }

            const leituras = await LeituraModel.buscarPorSmartcup(smartcupId);

            res.json({
                sucesso: true,
                leituras
            });
        } catch (error: any) {
            res.status(500).json({
                sucesso: false,
                mensagem: error.message
            });
        }
    }
}