import { api } from "./api";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function loginAdmin(email: string, senha: string) {
  const response = await api.post("/usuarios/login", { email, senha });
  return response.data;
}

export async function loginGarcom(token: string) {
  const response = await api.post("/usuarios/login-token", { token });
  return response.data;
}

export async function fetchMesas() {
  const response = await api.get("/mesas");
  if (!response.data.sucesso) {
    throw new Error(response.data.mensagem || "Erro ao buscar mesas");
  }
  return response.data.mesas;
}

export const fetchAlertas = async () => {
  const response = await api.get("/alertas");
  if (!response.data.sucesso) {
    throw new Error(response.data.mensagem || "Erro ao buscar alertas");
  }
  return response.data.alertas;
}

export async function resolveAlerta(id: number) {
  const response = await api.put(`/alertas/${id}/resolver`);
  if (!response.data.sucesso) {
    throw new Error(response.data.mensagem || "Erro ao resolver alerta");
  }
  return response.data;
}

export async function fetchGarcons() {
  const response = await api.get("/usuarios/garcons");
  if (!response.data.sucesso) {
    throw new Error(response.data.mensagem || "Erro ao buscar garcons");
  }
  return response.data.garcons;
}

export async function createGarcom(nome: string) {
  const response = await api.post("/usuarios/garcons", { nome });
  if (!response.data.sucesso) {
    throw new Error(response.data.mensagem || "Erro ao criar garcom");
  }
  return response.data.garcom;
}

export async function deleteGarcom(id: number) {
  const response = await api.delete(`/usuarios/garcons/${id}`);
  if (!response.data.sucesso) {
    throw new Error(response.data.mensagem || "Erro ao remover garcom");
  }
  return response.data;
}

export async function fetchQrCodeForGarcom(id: number) {
  const response = await api.get(`/usuarios/garcons/${id}/qrcode`);
  if (!response.data.sucesso) {
    throw new Error(response.data.mensagem || "Erro ao buscar QR code");
  }
  return response.data.qrcode;
}
