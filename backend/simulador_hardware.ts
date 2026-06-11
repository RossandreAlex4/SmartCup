import { baseURL } from "../../services/api.ts";
async function enviarLeituraSimulada() {
  const payload = {
    smartcup_id: 1,
    mesa_id: 1,
    peso: Math.floor(Math.random() * 200),
    porcentagem: Math.floor(Math.random() * 100),
    status: "ALERTA",
  };

  try {
    const res = await fetch(`${baseURL}/leituras/mesa/${payload.mesa_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error('Erro ao enviar: HTTP', res.status);
      return;
    }

    console.log('Leitura enviada:', res.status);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Erro ao enviar:', err.message);
    } else {
      console.error('Erro desconhecido:', err);
    }
  }
}

setInterval(enviarLeituraSimulada, 5000);