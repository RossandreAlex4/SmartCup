import { Router } from "express";

import { UsuarioController }
from "../controllers/usuariosController.js";

const router = Router();

router.post("/login", UsuarioController.login);
router.post("/login-token", UsuarioController.loginToken);
router.post("/garcons/logout", UsuarioController.logoutGarcom);
router.post("/garcons/validar-sessao", UsuarioController.validarSessaoGarcom);
router.post("/garcons", UsuarioController.criarGarcom);
router.put("/garcons/avatar", UsuarioController.atualizarAvatar);
router.get("/garcons", UsuarioController.listarGarcons);
router.delete("/garcons", UsuarioController.deletarTodosGarcons);
router.delete("/garcons/:id", UsuarioController.deletarGarcom);
router.get("/garcons/:id/qrcode", UsuarioController.obterQrCode);
router.get("/garcons/acesso/:token", UsuarioController.acessoWeb);

export default router;