import test from "node:test";
import assert from "node:assert";
import { AlertaModel } from "../models/alertaModel.js";

test("Alerta Model - Operations", async (t) => {
  await t.test("should create, list active, and resolve an alert", async () => {
    const mesaId = 1;
    const tipo = "copo vazio";

    const id = await AlertaModel.criar(mesaId, tipo) as number;
    assert.ok(id > 0);

    const list: any = await AlertaModel.listarAtivos();
    assert.ok(list.length > 0);
    const activeAlert = list.find((item: any) => item.id === id);
    assert.ok(activeAlert);
    assert.strictEqual(activeAlert.tipo, tipo);
    assert.strictEqual(activeAlert.mesa_id, mesaId);

    const resolved = await AlertaModel.resolver(id);
    assert.strictEqual(resolved, true);

    const listAfter: any = await AlertaModel.listarAtivos();
    const resolvedAlert = listAfter.find((item: any) => item.id === id);
    assert.strictEqual(resolvedAlert, undefined);
  });
});
