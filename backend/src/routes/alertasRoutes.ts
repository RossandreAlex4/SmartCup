import { Router } from "express";
import { AlertasController } from "../controllers/alertasController.js";

const router = Router();

router.get("/", AlertasController.listar);
router.post("/resolver-todos", AlertasController.resolverTodos);
router.put("/:id/resolver", AlertasController.resolver);
router.post("/", AlertasController.criar);

export default router;
