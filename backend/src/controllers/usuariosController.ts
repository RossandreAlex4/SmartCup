import type { Request, Response } from "express";
import bcrypt from "bcrypt";

import { UsuarioModel } from "../models/usuariosModel.js";

export class UsuarioController {
  static async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      const usuario: any = await UsuarioModel.buscarPorEmail(email);

      if (!usuario) {
        return res.status(401).json({
          sucesso: false,
          mensagem: "Email ou senha inválidos",
        });
      }

      const senhaCorreta = await bcrypt.compare(
        senha,
        usuario.senha
      );

      if (!senhaCorreta) {
        return res.status(401).json({
          sucesso: false,
          mensagem: "Email ou senha inválidos",
        });
      }

      return res.json({
        sucesso: true,

        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          tipo: usuario.tipo,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        sucesso: false,
        mensagem: error.message,
      });
    }
  }
}