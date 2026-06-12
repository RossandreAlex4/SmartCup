import { Router } from "express";
import { LeituraController } from "../controllers/leiturasController.js";

const router = Router();

router.get("/recentes", LeituraController.listarRecentes);
router.get("/mesa/:mesaId", LeituraController.obterPorMesa);
router.get("/smartcup/:smartcupId", LeituraController.obterPorSmartcup);
router.get("/:id", LeituraController.obterPorId);
router.get("/", LeituraController.listar);
router.post("/", LeituraController.criar);
router.delete("/", LeituraController.deletarTodas);

export default router;