import type { Request, Response, NextFunction } from "express";
import { UsuarioModel } from "../models/usuariosModel.js";

export interface AuthenticatedRequest extends Request {
  usuario?: {
    id: number;
    nome: string;
    tipo: "admin" | "garcom";
    token?: string;
    zona?: string;
  };
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    try {
      const garcom: any = await UsuarioModel.buscarToken(token);
      if (garcom) {
        (req as AuthenticatedRequest).usuario = {
          id: garcom.id,
          nome: garcom.nome,
          tipo: "garcom",
          token: garcom.token,
          zona: garcom.zona,
        };
      }
    } catch (error) {
      console.error("Erro ao autenticar token no authMiddleware:", error);
    }
  }
  next();
}
