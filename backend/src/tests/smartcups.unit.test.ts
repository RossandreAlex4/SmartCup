import test from "node:test";
import assert from "node:assert";
import { SmartcupModel } from "../models/smartcupModel.js";

test("SmartcupModel - Operações CRUD", async (t) => {
  const cupIdentificador = `SC-TEST-${Date.now()}`;
  let cupId: number;

  await t.test("deve criar um novo SmartCup", async () => {
    const timeStr = new Date().toISOString();
    const res = await SmartcupModel.criar(cupIdentificador, null, "ativo", 250.5, timeStr);
    assert.ok(typeof res === "number");
    cupId = res as number;
  });

  await t.test("deve buscar o SmartCup pelo ID", async () => {
    const res: any = await SmartcupModel.buscarPorId(cupId);
    assert.ok(res);
    assert.strictEqual(res.identificador, cupIdentificador);
    assert.strictEqual(res.status, "ativo");
    assert.strictEqual(res.peso_atual, 250.5);
  });

  await t.test("deve listar todos os SmartCups", async () => {
    const list: any = await SmartcupModel.listar();
    assert.ok(Array.isArray(list));
    const found = list.some((item: any) => item.id === cupId);
    assert.ok(found);
  });

  await t.test("deve atualizar o status e peso do SmartCup", async () => {
    const timeStr = new Date().toISOString();
    const updated = await SmartcupModel.atualizar(cupId, cupIdentificador, 1, "inativo", 100.0, timeStr);
    assert.strictEqual(updated, 1);
    const res: any = await SmartcupModel.buscarPorId(cupId);
    assert.strictEqual(res.status, "inativo");
    assert.strictEqual(res.peso_atual, 100.0);
  });

  await t.test("deve deletar o SmartCup pelo ID", async () => {
    const deleted = await SmartcupModel.deletar(cupId);
    assert.strictEqual(deleted, 1);
    const res = await SmartcupModel.buscarPorId(cupId);
    assert.strictEqual(res, undefined);
  });
});
