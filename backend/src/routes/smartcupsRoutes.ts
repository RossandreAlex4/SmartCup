import { Router } from "express";
import { SmartcupController } from "../controllers/smartcupsController.js";

const router = Router();

router.get("/mesa/:mesaId", SmartcupController.obterPorMesa);
router.get("/:id", SmartcupController.obterPorId);
router.get("/", SmartcupController.listar);
router.post("/", SmartcupController.criar);
router.put("/:id", SmartcupController.atualizar);
router.delete("/:id", SmartcupController.deletar);

export default router;