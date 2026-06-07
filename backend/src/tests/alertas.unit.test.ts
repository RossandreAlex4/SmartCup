import test from "node:test";
import assert from "node:assert";
import { AlertaModel } from "../models/alertaModel.js";
import { MesaModel } from "../models/mesaModel.js";

test("AlertaModel - Operações", async (t) => {
  let alertId: number;
  let mesaId: number;

  await t.test("preparação: criar uma mesa para associação do alerta", async () => {
    const res = await MesaModel.criar("Mesa Alerta Teste", "Zona A", "Ativa");
    mesaId = res as number;
    assert.ok(mesaId > 0);
  });

  await t.test("deve criar um alerta", async () => {
    const res = await AlertaModel.criar(mesaId, 1, "copo vazio");
    assert.ok(typeof res === "number");
    alertId = res as number;
  });

  await t.test("deve listar alertas ativos contendo o alerta criado", async () => {
    const list: any = await AlertaModel.listarAtivos();
    assert.ok(Array.isArray(list));
    const found = list.find((item: any) => item.id === alertId);
    assert.ok(found);
    assert.strictEqual(found.tipo, "copo vazio");
    assert.strictEqual(found.mesa_id, mesaId);
  });

  await t.test("deve resolver o alerta criado", async () => {
    const res = await AlertaModel.resolver(alertId);
    assert.strictEqual(res, true);
  });

  await t.test("não deve encontrar o alerta resolvido na lista de ativos", async () => {
    const list: any = await AlertaModel.listarAtivos();
    const found = list.find((item: any) => item.id === alertId);
    assert.strictEqual(found, undefined);
    await MesaModel.deletar(mesaId);
  });
});
