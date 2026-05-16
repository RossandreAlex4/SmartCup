import express from "express";
import cors from "cors";
import "./database/database.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/usuarios",usuariosRoutes);

export default app;