import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import QRCode from "qrcode";

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

  static async criarGarcom(req: Request, res: Response) {
    try {
      const { nome } = req.body;
      if (!nome) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Nome e obrigatorio",
        });
      }

      const token = "tkn_" + crypto.randomBytes(16).toString("hex");
      const id = await UsuarioModel.criarTokenGarcom(nome, token);

      return res.status(201).json({
        sucesso: true,
        garcom: {
          id,
          nome,
          token,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        sucesso: false,
        mensagem: error.message,
      });
    }
  }

  static async listarGarcons(req: Request, res: Response) {
    try {
      const garcons = await UsuarioModel.listarTokens();
      return res.json({
        sucesso: true,
        garcons,
      });
    } catch (error: any) {
      return res.status(500).json({
        sucesso: false,
        mensagem: error.message,
      });
    }
  }

  static async deletarGarcom(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const linhasAfetadas = await UsuarioModel.deletarToken(Number(id));

      if (linhasAfetadas === 0) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Garcom nao encontrado",
        });
      }

      return res.json({
        sucesso: true,
        mensagem: "Garcom removido",
      });
    } catch (error: any) {
      return res.status(500).json({
        sucesso: false,
        mensagem: error.message,
      });
    }
  }

  static async deletarTodosGarcons(req: Request, res: Response) {
    try {
      const linhasAfetadas = await UsuarioModel.deletarTodosTokens();
      return res.json({
        sucesso: true,
        removidos: linhasAfetadas,
        mensagem: "Todos os garcons foram removidos",
      });
    } catch (error: any) {
      return res.status(500).json({
        sucesso: false,
        mensagem: error.message,
      });
    }
  }

  static async obterQrCode(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const list: any = await UsuarioModel.listarTokens();
      const garcom = list.find((item: any) => item.id === Number(id));

      if (!garcom) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Garcom nao encontrado",
        });
      }

      const qrPayload = JSON.stringify({
        smartcup_auth: true,
        token: garcom.token,
      });

      const qrImage = await QRCode.toDataURL(qrPayload);

      return res.json({
        sucesso: true,
        qrcode: qrImage,
      });
    } catch (error: any) {
      return res.status(500).json({
        sucesso: false,
        mensagem: error.message,
      });
    }
  }

  static async loginToken(req: Request, res: Response) {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Token e obrigatorio",
        });
      }

      const garcom: any = await UsuarioModel.buscarToken(token);
      if (!garcom) {
        return res.status(401).json({
          sucesso: false,
          mensagem: "Acesso expirado ou invalido",
        });
      }

      return res.json({
        sucesso: true,
        usuario: {
          id: garcom.id,
          nome: garcom.nome,
          tipo: "garcom",
          token: garcom.token,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        sucesso: false,
        mensagem: error.message,
      });
    }
  }

  static async acessoWeb(req: Request, res: Response) {
    try {
      const { token } = req.params;

      if (!token || Array.isArray(token)) {
        return res.status(400).send("<h1>Token invalido</h1>");
      }

      const garcom: any = await UsuarioModel.buscarToken(token);

      if (!garcom) {
        return res.status(404).send("<h1>Acesso invalido ou expirado</h1>");
      }

      const qrPayload = JSON.stringify({
        smartcup_auth: true,
        token: garcom.token,
      });

      const qrImage = await QRCode.toDataURL(qrPayload);

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Acesso SmartCup</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { background-color: #121212; color: white; font-family: sans-serif; text-align: center; padding: 40px 20px; }
            h1 { color: #0fe159; margin-bottom: 10px; }
            p { color: #aaa; font-size: 16px; margin-bottom: 30px; }
            .qr-container { background: white; padding: 20px; display: inline-block; border-radius: 16px; margin: 20px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
            .btn { background-color: #0fe159; color: black; border: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; cursor: pointer; text-decoration: none; display: inline-block; margin-top: 25px; transition: background-color 0.2s; }
            .btn:hover { background-color: #0cbe4b; }
          </style>
        </head>
        <body>
          <h1>Acesso do Garcom</h1>
          <p>Ola, <strong>${garcom.nome}</strong>! Use uma das opcoes abaixo para acessar o app:</p>
          
          <div class="qr-container">
            <img src="${qrImage}" alt="QR Code" width="250" height="250">
          </div>
          
          <div>
            <a href="smartcup://login?token=${garcom.token}" class="btn">Abrir no Aplicativo</a>
          </div>
        </body>
        </html>
      `;

      return res.send(html);
    } catch (error: any) {
      return res.status(500).send("<h1>Erro interno do servidor</h1>");
    }
  }
}
