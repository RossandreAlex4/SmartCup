import test from "node:test";
import assert from "node:assert";
import { MesaModel } from "../models/mesaModel.js";
import { SmartcupModel } from "../models/smartcupModel.js";
import { AlertaModel } from "../models/alertaModel.js";
import { LeituraModel } from "../models/leituraModel.js";

test("Integração de Banco de Dados - Fluxos Multi-modelo", async (t) => {
  let createdMesaId: number;
  let createdSmartcupId: number;
  let createdAlertaId: number;
  let createdLeituraId: number;

  await t.test("1. deve limpar o banco de dados e configurar um evento com 2 mesas", async () => {
    const res = await MesaModel.configurarEvento(2, 1, 350, 15, "Evento Integrado");
    assert.strictEqual(res, true);
  });

  await t.test("2. deve verificar se as mesas foram criadas corretamente", async () => {
    const list: any = await MesaModel.listar();
    assert.strictEqual(list.length, 2);
    assert.strictEqual(list[0].nome, "Mesa 01");
    createdMesaId = list[0].id;
  });

  await t.test("3. deve verificar se os smartcups foram gerados para as mesas", async () => {
    const list: any = await SmartcupModel.listar();
    assert.strictEqual(list.length, 8);
    const mesaCups = list.filter((item: any) => item.mesa_id === createdMesaId);
    assert.strictEqual(mesaCups.length, 4);
    createdSmartcupId = mesaCups[0].id;
  });

  await t.test("4. deve criar uma leitura de smartcup", async () => {
    const res = await LeituraModel.criar(createdSmartcupId, createdMesaId, 300, 85, "normal", new Date().toISOString());
    assert.ok(typeof res === "number");
    createdLeituraId = res as number;
  });

  await t.test("5. deve buscar a leitura pelo ID e verificar os dados", async () => {
    const res: any = await LeituraModel.buscarPorId(createdLeituraId);
    assert.ok(res);
    assert.strictEqual(res.smartcup_id, createdSmartcupId);
    assert.strictEqual(res.peso, 300);
  });

  await t.test("6. deve criar um alerta para a mesa e smartcup", async () => {
    const res = await AlertaModel.criar(createdMesaId, createdSmartcupId, "copo_baixo");
    assert.ok(typeof res === "number");
    createdAlertaId = res as number;
  });

  await t.test("7. deve listar os alertas ativos com os nomes das mesas", async () => {
    const list: any = await AlertaModel.listarAtivos();
    const alert = list.find((item: any) => item.id === createdAlertaId);
    assert.ok(alert);
    assert.strictEqual(alert.mesa_nome, "Mesa 01");
  });

  await t.test("8. deve resolver o alerta e verificar que ele não é listado", async () => {
    await AlertaModel.resolver(createdAlertaId);
    const list: any = await AlertaModel.listarAtivos();
    const alert = list.find((item: any) => item.id === createdAlertaId);
    assert.strictEqual(alert, undefined);
  });

  await t.test("9. deve deletar todas as leituras e verificar que a lista está vazia", async () => {
    const deleted = await LeituraModel.deletarTodas();
    assert.strictEqual(deleted, true);
    const list: any = await LeituraModel.listar();
    assert.strictEqual(list.length, 0);
  });

  await t.test("10. deve deletar uma mesa e verificar que ela não existe mais", async () => {
    const deleted = await MesaModel.deletar(createdMesaId);
    assert.strictEqual(deleted, true);
    const res = await MesaModel.buscarPorId(createdMesaId);
    assert.strictEqual(res, undefined);
  });
});
