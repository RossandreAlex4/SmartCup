import type { Request, Response } from "express";
import { AlertaModel } from "../models/alertaModel.js";
import type { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import { db } from "../database/database.js";

export class AlertasController {
  static async listar(req: Request, res: Response) {
    try {
      const usuario = (req as AuthenticatedRequest).usuario;
      const zona = usuario && usuario.tipo === "garcom" ? (usuario.zona || "NENHUMA_ZONA") : undefined;

      const alertas = await AlertaModel.listarAtivos(zona);
      return res.json({ sucesso: true, alertas });
    } catch (error: any) {
      return res.status(500).json({ sucesso: false, mensagem: error.message });
    }
  }

  static async resolver(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usuario = (req as AuthenticatedRequest).usuario;

      if (usuario && usuario.tipo === "garcom") {
        const alertMesa: any = await new Promise((resolve, reject) => {
          db.get("SELECT m.zona FROM alertas a JOIN mesas m ON a.mesa_id = m.id WHERE a.id = ?", [id], (err, row) => {
            if (err) reject(err);
            resolve(row);
          });
        });
        if (alertMesa && alertMesa.zona && alertMesa.zona !== usuario.zona) {
          return res.status(403).json({ sucesso: false, mensagem: "Acesso negado a alertas fora da sua zona" });
        }
      }

      await AlertaModel.resolver(Number(id));
      return res.json({ sucesso: true, mensagem: "Alerta resolvido" });
    } catch (error: any) {
      return res.status(500).json({ sucesso: false, mensagem: error.message });
    }
  }

  static async resolverTodos(req: Request, res: Response) {
    try {
      const usuario = (req as AuthenticatedRequest).usuario;
      const zona = usuario && usuario.tipo === "garcom" ? (usuario.zona || "NENHUMA_ZONA") : undefined;
      await AlertaModel.resolverTodos(zona);
      return res.json({ sucesso: true, mensagem: "Todos os alertas resolvidos" });
    } catch (error: any) {
      return res.status(500).json({ sucesso: false, mensagem: error.message });
    }
  }

  static async criar(req: Request, res: Response) {
    try {
      const { mesa_id, smartcup_id, tipo } = req.body;

      if (!mesa_id || !smartcup_id || !tipo) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "mesa_id, smartcup_id e tipo são obrigatórios"
        });
      }

      const alertaExistente = await AlertaModel.buscarAlertaAtivoSmartcup(Number(smartcup_id), tipo);
      if (alertaExistente) {
        return res.status(200).json({ sucesso: true, mensagem: "Alerta já ativo para este smartcup" });
      }

      const alertaId = await AlertaModel.criar(
        Number(mesa_id),
        Number(smartcup_id),
        tipo
      );

      return res.status(201).json({
        sucesso: true,
        mensagem: "Alerta cadastrado com sucesso",
        alertaId
      });
    } catch (error: any) {
      return res.status(500).json({
        sucesso: false,
        mensagem: error.message
      });
    }
  }
}
