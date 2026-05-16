import { Router } from "express";

import { UsuarioController }
from "../controllers/usuariosController.js";

const router = Router();

router.post("/login",UsuarioController.login);

export default router;