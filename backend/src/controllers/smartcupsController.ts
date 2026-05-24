import type { Request, Response } from "express";
import { SmartCupModel } from "../models/smartcupModel.js";

export class SmartCupController {
    static async listar(req: Request, res: Response) {
        try {
        const smartcups = await SmartCupModel.listar();
        res.json({ sucesso: true, smartcups });
        } catch (error: any) {
        res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    }

    static async obterPorId(req: Request, res: Response) {
        try {
        const { id } = req.params;
        const smartcup = await SmartCupModel.buscarPorId(Number(id));

        if (!smartcup) {
            return res.status(404).json({ sucesso: false, mensagem: "SmartCup não encontrado" });
        }

        res.json({ sucesso: true, smartcup });
        } catch (error: any) {
        res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    }

    static async criar(req: Request, res: Response) {
        try {
        const { identificador, mesa_id, status, peso_atual, ultima_comunicacao } = req.body;

        if (!identificador || !mesa_id) {
            return res.status(400).json({ sucesso: false, mensagem: "Identificador e mesa_id são obrigatórios" });
        }

        const smartcupId = await SmartCupModel.criar(
            identificador,
            mesa_id,
            status || "ativo",
            peso_atual || 0,
            ultima_comunicacao || new Date().toISOString()
        );

        res.status(201).json({ sucesso: true, smartcupId });
        } catch (error: any) {
        res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    }

    static async atualizar(req: Request, res: Response) {
        try {
        const { id } = req.params;
        const { status, peso_atual, ultima_comunicacao } = req.body;

        const linhasAfetadas = await SmartCupModel.atualizar(
            Number(id),
            status || "ativo",
            peso_atual || 0,
            ultima_comunicacao || new Date().toISOString()
        );

        if (linhasAfetadas === 0) {
            return res.status(404).json({ sucesso: false, mensagem: "SmartCup nÃ£o encontrado" });
        }

        return res.json({ sucesso: true, mensagem: "SmartCup atualizado com sucesso" });
        } catch (error: any) {
        return res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    }

    static async deletar(req: Request, res: Response) {
        try {
        const { id } = req.params;
        const linhasAfetadas = await SmartCupModel.deletar(Number(id));

        if (linhasAfetadas === 0) {
            return res.status(404).json({ sucesso: false, mensagem: "SmartCup nÃ£o encontrado" });
        }

        return res.json({ sucesso: true, mensagem: "SmartCup deletado com sucesso" });
        } catch (error: any) {
        return res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    }

    static async obterLeituras(req: Request, res: Response) {
        try {
        const { id } = req.params;
        const leituras = await SmartCupModel.buscarLeiturasDoSmartcup(Number(id));
        res.json({ sucesso: true, leituras });
        } catch (error: any) {
        res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    }
}
