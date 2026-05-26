import type { Request, Response } from "express";
import { SmartcupModel } from "../models/smartcupModel.js";

export class SmartcupController {

    static async listar(req: Request, res: Response) {
        try {
            const smartcups = await SmartcupModel.listar();

            res.json({
                sucesso: true,
                smartcups
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

            const smartcup = await SmartcupModel.buscarPorId(id);

            if (!smartcup) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: "SmartCup não encontrado"
                });
            }

            res.json({
                sucesso: true,
                smartcup
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

            const {
                identificador,
                mesa_id,
                status,
                peso_atual,
                ultima_comunicacao
            } = req.body;

            if (!identificador) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "identificador é obrigatório"
                });
            }

            const smartcupId = await SmartcupModel.criar(
                identificador,
                mesa_id || null,
                status || "ativo",
                peso_atual || 0,
                ultima_comunicacao || new Date().toISOString()
            );

            res.status(201).json({
                sucesso: true,
                mensagem: "SmartCup criado com sucesso",
                smartcupId
            });

        } catch (error: any) {

            res.status(500).json({
                sucesso: false,
                mensagem: error.message
            });

        }
    }

    static async atualizar(req: Request, res: Response) {

        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "ID inválido"
                });
            }

            const {
                identificador,
                mesa_id,
                status,
                peso_atual,
                ultima_comunicacao
            } = req.body;

            const smartcup = await SmartcupModel.buscarPorId(id);

            if (!smartcup) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: "SmartCup não encontrado"
                });
            }

            await SmartcupModel.atualizar(
                id,
                identificador,
                mesa_id,
                status,
                peso_atual,
                ultima_comunicacao
            );

            res.json({
                sucesso: true,
                mensagem: "SmartCup atualizado com sucesso"
            });

        } catch (error: any) {

            res.status(500).json({
                sucesso: false,
                mensagem: error.message
            });

        }
    }

    static async deletar(req: Request, res: Response) {

        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "ID inválido"
                });
            }

            const smartcup = await SmartcupModel.buscarPorId(id);

            if (!smartcup) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: "SmartCup não encontrado"
                });
            }

            await SmartcupModel.deletar(id);

            res.json({
                sucesso: true,
                mensagem: "SmartCup removido com sucesso"
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

            const smartcups = await SmartcupModel.buscarPorMesa(mesaId);

            res.json({
                sucesso: true,
                smartcups
            });

        } catch (error: any) {

            res.status(500).json({
                sucesso: false,
                mensagem: error.message
            });

        }
    }
}