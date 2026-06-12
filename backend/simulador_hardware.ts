const BASE_URL = "http://localhost:3000";

type SmartcupInfo = { id: number; mesa_id: number; identificador: string };
type Cenario = SmartcupInfo & { porcentagem: number };

const NIVEIS_POR_POSICAO = [80, 45, 25, 10];

let cenarios: Cenario[] = [];

async function carregarCenarios() {
  const res = await fetch(`${BASE_URL}/smartcups`);
  const data = await res.json();
  const todos: SmartcupInfo[] = (data.smartcups ?? []).filter(
    (c: SmartcupInfo) => c.mesa_id != null
  );

  const porMesa = new Map<number, SmartcupInfo[]>();
  for (const cup of todos) {
    if (!porMesa.has(cup.mesa_id)) porMesa.set(cup.mesa_id, []);
    porMesa.get(cup.mesa_id)!.push(cup);
  }

  cenarios = [];
  for (const [, cups] of porMesa) {
    cups.sort((a, b) => a.id - b.id);
    cups.forEach((cup, pos) => {
      cenarios.push({
        ...cup,
        porcentagem: NIVEIS_POR_POSICAO[pos % NIVEIS_POR_POSICAO.length]!,
      });
    });
  }

  console.log(`[Simulador] ${cenarios.length} smartcups carregados:`);
  cenarios.forEach((c) =>
    console.log(`  ${c.identificador} (Mesa ${c.mesa_id}) → ${c.porcentagem}%`)
  );
}

async function enviarLeitura(cenario: Cenario) {
  const porcentagem = Math.max(
    0,
    Math.min(100, cenario.porcentagem + (Math.random() * 6 - 3))
  );
  const peso = Math.round(porcentagem * 2.5);

  try {
    const res = await fetch(`${BASE_URL}/leituras`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        smartcup_id: cenario.id,
        mesa_id: cenario.mesa_id,
        peso,
        porcentagem: Math.round(porcentagem),
      }),
    });
    const corpo = await res.json();
    console.log(
      `[Simulador] ${cenario.identificador} Mesa-${cenario.mesa_id} | ${Math.round(porcentagem)}% → ${res.status}`,
      corpo.mensagem ?? ""
    );
  } catch (err) {
    console.error(
      `[Simulador] Erro em ${cenario.identificador}:`,
      err instanceof Error ? err.message : err
    );
  }
}

async function enviarTodasLeituras() {
  if (cenarios.length === 0) {
    await carregarCenarios();
    return;
  }
  await Promise.all(cenarios.map(enviarLeitura));
}

async function simularBotao() {
  if (cenarios.length === 0) return;
  const alvo = cenarios[Math.floor(Math.random() * cenarios.length)]!;
  try {
    const res = await fetch(`${BASE_URL}/alertas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mesa_id: alvo.mesa_id,
        smartcup_id: alvo.id,
        tipo: "GARCOM_CHAMADO",
      }),
    });
    const corpo = await res.json();
    console.log(
      `[Simulador] 🔔 Botão pressionado em ${alvo.identificador} Mesa-${alvo.mesa_id} → ${res.status}`,
      corpo.mensagem ?? ""
    );
  } catch (err) {
    console.error("[Simulador] Erro ao simular botão:", err instanceof Error ? err.message : err);
  }
}

console.log("[Simulador] Iniciado — buscando smartcups do banco...");
carregarCenarios().then(() => {
  enviarTodasLeituras();
  setInterval(enviarTodasLeituras, 50000);
  setInterval(simularBotao, 30000);
});
