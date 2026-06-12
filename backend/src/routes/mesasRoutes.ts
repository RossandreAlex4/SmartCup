import { Router } from "express";
import { MesaController } from "../controllers/mesasController.js";

const router = Router();

router.get("/", MesaController.listar);
router.get("/status-evento", MesaController.statusEvento);
router.get("/configuracoes", MesaController.getConfiguracoes);
router.post("/:id/atender-todos", MesaController.atenderTodos);
router.get("/:id", MesaController.obterPorId);
router.post("/", MesaController.criar);
router.put("/:id", MesaController.atualizar);
router.delete("/:id", MesaController.deletar);
router.post("/configurar-evento", MesaController.configurarEvento);
router.post("/configuracoes/reset", MesaController.resetarEvento)

export default router;