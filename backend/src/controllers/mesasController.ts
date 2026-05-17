import type { Request, Response } from "express";
import { MesaModel } from "../models/mesaModel.js";

export class MesaController {
    static async listar(req: Request, res: Response) {
        try {
        const mesas = await MesaModel.listar();
        res.json({ sucesso: true, mesas });
        } catch (error: any) {
        res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    }

    static async obterPorId(req: Request, res: Response) {
        try {
        const { id } = req.params;
        const mesa = await MesaModel.buscarPorId(Number(id));

        if (!mesa) {
            return res.status(404).json({ sucesso: false, mensagem: "Mesa não encontrada" });
        }

        res.json({ sucesso: true, mesa });
        } catch (error: any) {
        res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    }

    static async criar(req: Request, res: Response) {
        try {
        const { nome, zona, status } = req.body;

        if (!nome || !zona || !status) {
            return res.status(400).json({ sucesso: false, mensagem: "Nome, zona e status são obrigatórios" });
        }

        const mesaId = await MesaModel.criar(nome, zona, status);
        res.status(201).json({ sucesso: true, mesaId });
        } catch (error: any) {
        res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    }

    static async atualizar(req: Request, res: Response) {
        try {
        const { id } = req.params;
        const { nome, zona, status } = req.body;

        if (!nome || !zona || !status) {
            return res.status(400).json({ sucesso: false, mensagem: "Nome, zona e status são obrigatórios" });
        }

        await MesaModel.atualizar(Number(id), nome, zona, status);
        res.json({ sucesso: true, mensagem: "Mesa atualizada com sucesso" });
        } catch (error: any) {
        res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    }

    static async deletar(req: Request, res: Response) {
        try {
        const { id } = req.params;
        await MesaModel.deletar(Number(id));
        res.json({ sucesso: true, mensagem: "Mesa deletada com sucesso" });
        } catch (error: any) {
        res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    }

    static async obterSmartcups(req: Request, res: Response) {
        try {
        const { id } = req.params;
        const smartcups = await MesaModel.buscarSmartcupsDaMesa(Number(id));
        res.json({ sucesso: true, smartcups });
        } catch (error: any) {
        res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    }
}