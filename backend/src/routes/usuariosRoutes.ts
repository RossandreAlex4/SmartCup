import { Router } from "express";

import { UsuarioController }
from "../controllers/usuariosController.js";

const router = Router();

router.post("/login", UsuarioController.login);
router.post("/login-token", UsuarioController.loginToken);
router.post("/garcons", UsuarioController.criarGarcom);
router.get("/garcons", UsuarioController.listarGarcons);
router.delete("/garcons", UsuarioController.deletarTodosGarcons);
router.delete("/garcons/:id", UsuarioController.deletarGarcom);
router.get("/garcons/:id/qrcode", UsuarioController.obterQrCode);
router.get("/garcons/acesso/:token", UsuarioController.acessoWeb);

export default router;