import type { Request, Response } from "express";
import { AlertaModel } from "../models/alertaModel.js";

export class AlertasController {
  static async listar(req: Request, res: Response) {
    try {
      const alertas = await AlertaModel.listarAtivos();
      return res.json({ sucesso: true, alertas });
    } catch (error: any) {
      return res.status(500).json({ sucesso: false, mensagem: error.message });
    }
  }

  static async resolver(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await AlertaModel.resolver(Number(id));
      return res.json({ sucesso: true, mensagem: "Alerta resolvido" });
    } catch (error: any) {
      return res.status(500).json({ sucesso: false, mensagem: error.message });
    }
  }

  static async criar(req: Request, res: Response) {
    try {
      const { mesa_id, tipo } = req.body;
      if (!mesa_id || !tipo) {
        return res.status(400).json({ sucesso: false, mensagem: "mesa_id e tipo sao obrigatorios" });
      }
      const alertaId = await AlertaModel.criar(Number(mesa_id), tipo);
      return res.status(201).json({ sucesso: true, alertaId });
    } catch (error: any) {
      return res.status(500).json({ sucesso: false, mensagem: error.message });
    }
  }
}
