import { Router } from "express";
import { SmartCupController } from "../controllers/smartcupsController.js";

const router = Router();

router.get("/", SmartCupController.listar);
router.get("/:id", SmartCupController.obterPorId);
router.post("/", SmartCupController.criar);
router.put("/:id", SmartCupController.atualizar);
router.delete("/:id", SmartCupController.deletar);
router.get("/:id/leituras", SmartCupController.obterLeituras);

export default router;