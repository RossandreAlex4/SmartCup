import test from "node:test";
import assert from "node:assert";
import app from "../app.js";
import { Server } from "http";

test("Endpoints da API", async (t) => {
  let server: Server;
  let baseUrl: string;
  let testToken: string;
  let testWaiterId: number;

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

  await t.test("1. GET /mesas deve retornar 200 e a lista de mesas", async () => {
    const res = await fetch(`${baseUrl}/mesas`);
    assert.strictEqual(res.status, 200);
    const data: any = await res.json();
    assert.ok(data);
    const list = data.mesas || data;
    assert.ok(Array.isArray(list));
  });

  await t.test("2. POST /usuarios/login-token com token inválido deve retornar 401", async () => {
    const res = await fetch(`${baseUrl}/usuarios/login-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "non_existent_token" })
    });
    assert.strictEqual(res.status, 401);
  });

  await t.test("3. POST /usuarios/garcons com nome ausente deve retornar 400", async () => {
    const res = await fetch(`${baseUrl}/usuarios/garcons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: "" })
    });
    assert.strictEqual(res.status, 400);
  });

  await t.test("4. POST /usuarios/garcons com nome válido deve retornar 201", async () => {
    const res = await fetch(`${baseUrl}/usuarios/garcons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: "Waiter API Test" })
    });
    assert.strictEqual(res.status, 201);
    const data: any = await res.json();
    assert.ok(data.sucesso);
    assert.ok(data.garcom.id);
    assert.ok(data.garcom.token);
    testWaiterId = data.garcom.id;
    testToken = data.garcom.token;
  });

  await t.test("5. POST /usuarios/login-token com token válido deve retornar 200", async () => {
    const res = await fetch(`${baseUrl}/usuarios/login-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: testToken })
    });
    assert.strictEqual(res.status, 200);
    const data: any = await res.json();
    assert.ok(data.sucesso);
    assert.strictEqual(data.usuario.token, testToken);
  });

  await t.test("6. GET /usuarios/garcons deve retornar 200 e a lista de garçons ativos", async () => {
    const res = await fetch(`${baseUrl}/usuarios/garcons`);
    assert.strictEqual(res.status, 200);
    const data: any = await res.json();
    assert.ok(Array.isArray(data.garcons));
    const found = data.garcons.some((g: any) => g.id === testWaiterId);
    assert.ok(found);
  });

  await t.test("7. GET /usuarios/garcons/:id/qrcode deve retornar 200 e a imagem qr em base64", async () => {
    const res = await fetch(`${baseUrl}/usuarios/garcons/${testWaiterId}/qrcode`);
    assert.strictEqual(res.status, 200);
    const data: any = await res.json();
    assert.ok(data.sucesso);
    assert.ok(data.qrcode.startsWith("data:image/png;base64,"));
  });

  await t.test("8. POST /mesas/configurar-evento com payload válido deve retornar 201", async () => {
    const res = await fetch(`${baseUrl}/mesas/configurar-evento`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        qtd_mesas: 3,
        qtd_zonas: 1,
        volume_copo: 350,
        peso_copo_vazio: 25,
        nome_evento: "API Event Config Test"
      })
    });
    assert.strictEqual(res.status, 201);
  });

  await t.test("9. GET /alertas deve retornar 200", async () => {
    const res = await fetch(`${baseUrl}/alertas`);
    assert.strictEqual(res.status, 200);
    const data: any = await res.json();
    assert.ok(data.sucesso);
    assert.ok(Array.isArray(data.alertas));
  });

  await t.test("10. DELETE /usuarios/garcons/:id deve deletar o token e retornar 200", async () => {
    const res = await fetch(`${baseUrl}/usuarios/garcons/${testWaiterId}`, {
      method: "DELETE"
    });
    assert.strictEqual(res.status, 200);
    const checkRes = await fetch(`${baseUrl}/usuarios/garcons`);
    const data: any = await checkRes.json();
    const found = data.garcons.some((g: any) => g.id === testWaiterId);
    assert.strictEqual(found, false);
  });
});
