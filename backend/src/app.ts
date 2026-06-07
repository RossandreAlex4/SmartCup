import express from "express";
import cors from "cors";
import "./database/database.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { ZonaService } from "./services/zonaService.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import mesasRoutes from "./routes/mesasRoutes.js";
import alertasRoutes from "./routes/alertasRoutes.js";
import leiturasRoutes from "./routes/leiturasRoutes.js";
import smartcupsRoutes from "./routes/smartcupsRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());
app.use(authMiddleware);

app.use("/usuarios", usuariosRoutes);
app.use("/mesas", mesasRoutes);
app.use("/alertas", alertasRoutes);
app.use("/leituras", leiturasRoutes);
app.use("/smartcups", smartcupsRoutes);

// Executar a atribuição sequencial de zonas na inicialização do servidor
ZonaService.atribuirZonasSequencialmente()
  .then(() => console.log("Zonas iniciais atribuídas aos garçons com sucesso"))
  .catch((err) => console.error("Erro ao atribuir zonas na inicialização:", err));

export default app;



