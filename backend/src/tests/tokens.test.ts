import test from "node:test";
import assert from "node:assert";
import { UsuarioModel } from "../models/usuariosModel.js";

test("Token Model - CRUD Operations", async (t) => {
  await t.test("should create, find, list, and delete a waiter token", async () => {
    const nome = "Lucas Teste";
    const tokenStr = `tkn_test_${Date.now()}`;

    const id = await UsuarioModel.criarTokenGarcom(nome, tokenStr) as number;
    assert.ok(id > 0);

    const tokenRow: any = await UsuarioModel.buscarToken(tokenStr);
    assert.ok(tokenRow);
    assert.strictEqual(tokenRow.nome, nome);
    assert.strictEqual(tokenRow.token, tokenStr);

    const list: any = await UsuarioModel.listarTokens();
    assert.ok(list.length > 0);
    const found = list.some((item: any) => item.token === tokenStr);
    assert.ok(found);

    const deleted = await UsuarioModel.deletarToken(id);
    assert.strictEqual(deleted, true);

    const afterDelete: any = await UsuarioModel.buscarToken(tokenStr);
    assert.strictEqual(afterDelete, undefined);
  });
});
