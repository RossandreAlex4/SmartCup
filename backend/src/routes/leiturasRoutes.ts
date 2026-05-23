import { Router } from "express";
import { LeituraController } from "../controllers/leiturasController.js";

const router = Router();

router.get("/", LeituraController.listar);
router.get("/:id", LeituraController.obterPorId);
router.post("/", LeituraController.criar);
router.get("/mesa/:mesaId", LeituraController.obterPorMesa);
router.get("/smartcup/:smartcupId", LeituraController.obterPorSmartcup);

export default router;