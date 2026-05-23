import type { Request, Response } from "express";
import { LeituraModel } from "../models/leituraModel.js";

export class LeituraController {
    static async listar(req: Request, res: Response) {
        try {
        const leituras = await LeituraModel.listar();
        res.json({ sucesso: true, leituras });
        } catch (error: any) {
        res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    }

    static async obterPorId(req: Request, res: Response) {
        try {
        const { id } = req.params;
        const leitura = await LeituraModel.buscarPorId(Number(id));

        if (!leitura) {
            return res.status(404).json({ sucesso: false, mensagem: "Leitura não encontrada" });
        }

        res.json({ sucesso: true, leitura });
        } catch (error: any) {
        res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    }

    static async criar(req: Request, res: Response) {
        try {
        const { smartcup_id, mesa_id, peso, data } = req.body;

        if (!smartcup_id || !mesa_id || peso === undefined) {
            return res.status(400).json({ sucesso: false, mensagem: "smartcup_id, mesa_id e peso são obrigatórios" });
        }

        const leituraId = await LeituraModel.criar(
            smartcup_id,
            mesa_id,
            peso,
            data || new Date().toISOString()
        );

        res.status(201).json({ sucesso: true, leituraId });
        } catch (error: any) {
        res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    }

    static async obterPorMesa(req: Request, res: Response) {
        try {
        const { mesaId } = req.params;
        const leituras = await LeituraModel.buscarPorMesa(Number(mesaId));
        res.json({ sucesso: true, leituras });
        } catch (error: any) {
        res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    }

    static async obterPorSmartcup(req: Request, res: Response) {
        try {
        const { smartcupId } = req.params;
        const leituras = await LeituraModel.buscarPorSmartcup(Number(smartcupId));
        res.json({ sucesso: true, leituras });
        } catch (error: any) {
        res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    }
}