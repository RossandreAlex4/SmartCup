import test from "node:test";
import assert from "node:assert";
import { MesaModel } from "../models/mesaModel.js";

test("MesaModel - Operações CRUD", async (t) => {
  const mesaNome = `Mesa Teste_${Date.now()}`;
  let mesaId: number;

  await t.test("deve criar uma nova mesa", async () => {
    const res = await MesaModel.criar(mesaNome, "Zona T", "Ativa");
    assert.ok(typeof res === "number");
    mesaId = res as number;
  });

  await t.test("deve buscar a mesa pelo ID", async () => {
    const res: any = await MesaModel.buscarPorId(mesaId);
    assert.ok(res);
    assert.strictEqual(res.nome, mesaNome);
    assert.strictEqual(res.zona, "Zona T");
  });

  await t.test("deve listar as mesas e encontrar a mesa criada", async () => {
    const list: any = await MesaModel.listar();
    assert.ok(Array.isArray(list));
    const found = list.some((item: any) => item.id === mesaId);
    assert.ok(found);
  });

  await t.test("deve atualizar o nome e status da mesa", async () => {
    const updated = await MesaModel.atualizar(mesaId, `${mesaNome}_updated`, "Zona V", "Inativa");
    assert.strictEqual(updated, true);
    const res: any = await MesaModel.buscarPorId(mesaId);
    assert.strictEqual(res.nome, `${mesaNome}_updated`);
    assert.strictEqual(res.zona, "Zona V");
    assert.strictEqual(res.status, "Inativa");
  });

  await t.test("deve deletar a mesa pelo ID", async () => {
    const deleted = await MesaModel.deletar(mesaId);
    assert.strictEqual(deleted, true);
    const res = await MesaModel.buscarPorId(mesaId);
    assert.strictEqual(res, undefined);
  });
});
