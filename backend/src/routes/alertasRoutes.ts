import { Router } from "express";
import { AlertasController } from "../controllers/alertasController.js";

const router = Router();

router.get("/", AlertasController.listar);
router.put("/:id/resolver", AlertasController.resolver);
router.post("/", AlertasController.criar);

export default router;
