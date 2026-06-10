import type { Request, Response } from "express";
import { MesaModel } from "../models/mesaModel.js";
import { ZonaService } from "../services/zonaService.js";
import type { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import { db } from "../database/database.js";

export class MesaController {
    static async listar(req: Request, res: Response) {
        try {
        const usuario = (req as AuthenticatedRequest).usuario;
        const zona = usuario && usuario.tipo === "garcom" ? (usuario.zona || "NENHUMA_ZONA") : undefined;

        const mesas = await MesaModel.listar(zona);
        res.json({ sucesso: true, mesas });
        } catch (error: any) {
        res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    }

    static async obterPorId(req: Request, res: Response) {
        try {
        const { id } = req.params;
        const mesa: any = await MesaModel.buscarPorId(Number(id));

        if (!mesa) {
            return res.status(404).json({ sucesso: false, mensagem: "Mesa não encontrada" });
        }

        const usuario = (req as AuthenticatedRequest).usuario;
        if (usuario && usuario.tipo === "garcom" && usuario.zona && mesa.zona !== usuario.zona) {
            return res.status(403).json({ sucesso: false, mensagem: "Acesso negado a mesas fora da sua zona" });
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

    static async configurarEvento(req: Request, res: Response) {
    try {
        
        const { qtd_mesas, qtd_zonas, volume_copo, peso_copo_vazio, nome_evento } = req.body;
        if (!qtd_mesas || !qtd_zonas || !volume_copo || !peso_copo_vazio || !nome_evento) {
            return res.status(400).json({ 
                sucesso: false, 
                mensagem: "Todos os campos são obrigatórios" 
            });
        }

        await MesaModel.configurarEvento(Number(qtd_mesas), Number(qtd_zonas), Number(volume_copo), Number(peso_copo_vazio), nome_evento);
        db.run("UPDATE configuracoes SET status_configuracao = 1 WHERE id = 1");
        await ZonaService.atribuirZonasSequencialmente();

        res.status(201).json({ 
            sucesso: true, 
            mensagem: "Evento configurado com sucesso" 
        });
    } catch (error: any) {
        res.status(500).json({ sucesso: false, mensagem: error.message });
    }
}

 static async resetarEvento(req: Request, res: Response) {
  try {
    await db.serialize(() => {
      db.run("DELETE FROM mesas");
      db.run("DELETE FROM smartcups");
      db.run("DELETE FROM leituras");
      db.run("DELETE FROM alertas");
      db.run("UPDATE configuracoes SET status_configuracao = 0, nome_evento = NULL WHERE id = 1");
    });

    return res.json({ sucesso: true, mensagem: "Evento encerrado e sistema resetado com sucesso!" });
  } catch (error: any) {
    return res.status(500).json({ sucesso: false, mensagem: error.message });
  }
}
}
