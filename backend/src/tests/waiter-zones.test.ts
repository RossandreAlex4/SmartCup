import test from "node:test";
import assert from "node:assert";
import app from "../app.js";
import { Server } from "http";
import { db } from "../database/database.js";

test("Visão Restrita por Zona do Garçom e Atribuição Sequencial", async (t) => {
  let server: Server;
  let baseUrl: string;

  t.before(() => {
    return new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address();
        const port = typeof address === "object" && address ? address.port : 3000;
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });
  });

  t.after(() => {
    return new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  await t.test("Fluxo completo de criação, atribuição e filtragem", async () => {
    await new Promise<void>((resolve, reject) => {
      db.run("DELETE FROM tokens_acesso", (err) => {
        if (err) reject(err);
        resolve();
      });
    });

    const configRes = await fetch(`${baseUrl}/mesas/configurar-evento`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        qtd_mesas: 4,
        qtd_zonas: 2,
        volume_copo: 350,
        gatilho_alerta: 20,
        nome_evento: "Teste de Zonas Sequenciais"
      })
    });
    assert.strictEqual(configRes.status, 201);

    const garcom1Res = await fetch(`${baseUrl}/usuarios/garcons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: "Garçom Um" })
    });
    const g1 = (await garcom1Res.json()).garcom;

    const garcom2Res = await fetch(`${baseUrl}/usuarios/garcons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: "Garçom Dois" })
    });
    const g2 = (await garcom2Res.json()).garcom;

    const garcom3Res = await fetch(`${baseUrl}/usuarios/garcons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: "Garçom Três" })
    });
    const g3 = (await garcom3Res.json()).garcom;

    const listaGarconsRes = await fetch(`${baseUrl}/usuarios/garcons`);
    const listaData = await listaGarconsRes.json();
    const garconsAtivos = listaData.garcons;

    const waiter1 = garconsAtivos.find((g: any) => g.id === g1.id);
    const waiter2 = garconsAtivos.find((g: any) => g.id === g2.id);
    const waiter3 = garconsAtivos.find((g: any) => g.id === g3.id);

    assert.strictEqual(waiter1.zona, "Zona A");
    assert.strictEqual(waiter2.zona, "Zona B");
    assert.strictEqual(waiter3.zona, "Zona A");

    const mesasW1Res = await fetch(`${baseUrl}/mesas`, {
      headers: { "Authorization": `Bearer ${g1.token}` }
    });
    const mesasW1 = (await mesasW1Res.json()).mesas;
    assert.ok(mesasW1.length > 0);
    mesasW1.forEach((m: any) => {
      assert.strictEqual(m.zona, "Zona A");
    });

    const mesasW2Res = await fetch(`${baseUrl}/mesas`, {
      headers: { "Authorization": `Bearer ${g2.token}` }
    });
    const mesasW2 = (await mesasW2Res.json()).mesas;
    assert.ok(mesasW2.length > 0);
    mesasW2.forEach((m: any) => {
      assert.strictEqual(m.zona, "Zona B");
    });

    const mesaZonaBId = mesasW2[0].id;
    const mesaZonaAId = mesasW1[0].id;

    const getMesaForaZonaRes = await fetch(`${baseUrl}/mesas/${mesaZonaBId}`, {
      headers: { "Authorization": `Bearer ${g1.token}` }
    });
    assert.strictEqual(getMesaForaZonaRes.status, 403);

    const getMesaMesmaZonaRes = await fetch(`${baseUrl}/mesas/${mesaZonaAId}`, {
      headers: { "Authorization": `Bearer ${g1.token}` }
    });
    assert.strictEqual(getMesaMesmaZonaRes.status, 200);

    const smartcupsRes = await fetch(`${baseUrl}/smartcups`);
    const smartcups = (await smartcupsRes.json()).smartcups;
    const sc = smartcups.find((c: any) => c.mesa_id === mesaZonaBId);
    assert.ok(sc);

    const alertaRes = await fetch(`${baseUrl}/alertas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mesa_id: mesaZonaBId,
        smartcup_id: sc.id,
        tipo: "Bebida baixa"
      })
    });
    const alertaId = (await alertaRes.json()).alertaId;
    assert.ok(alertaId);

    const alertasW1Res = await fetch(`${baseUrl}/alertas`, {
      headers: { "Authorization": `Bearer ${g1.token}` }
    });
    const alertasW1 = (await alertasW1Res.json()).alertas;
    const alertFoundW1 = alertasW1.some((a: any) => a.id === alertaId);
    assert.strictEqual(alertFoundW1, false);

    const alertasW2Res = await fetch(`${baseUrl}/alertas`, {
      headers: { "Authorization": `Bearer ${g2.token}` }
    });
    const alertasW2 = (await alertasW2Res.json()).alertas;
    const alertFoundW2 = alertasW2.some((a: any) => a.id === alertaId);
    assert.strictEqual(alertFoundW2, true);

    const resolverIncorretoRes = await fetch(`${baseUrl}/alertas/${alertaId}/resolver`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${g1.token}` }
    });
    assert.strictEqual(resolverIncorretoRes.status, 403);

    const resolverCorretoRes = await fetch(`${baseUrl}/alertas/${alertaId}/resolver`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${g2.token}` }
    });
    assert.strictEqual(resolverCorretoRes.status, 200);

    const deleteRes = await fetch(`${baseUrl}/usuarios/garcons/${g1.id}`, {
      method: "DELETE"
    });
    assert.strictEqual(deleteRes.status, 200);

    const posDeleteRes = await fetch(`${baseUrl}/usuarios/garcons`);
    const posDeleteGarcons = (await posDeleteRes.json()).garcons;
    
    const w2Pos = posDeleteGarcons.find((g: any) => g.id === g2.id);
    const w3Pos = posDeleteGarcons.find((g: any) => g.id === g3.id);

    assert.strictEqual(w2Pos.zona, "Zona A");
    assert.strictEqual(w3Pos.zona, "Zona B");
  });
});
