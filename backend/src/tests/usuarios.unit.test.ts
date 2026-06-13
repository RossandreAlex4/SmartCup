import test from "node:test";
import assert from "node:assert";
import { UsuarioModel } from "../models/usuariosModel.js";

test("UsuarioModel - Operações CRUD de Tokens", async (t) => {
  const tokenVal = `token_${Date.now()}`;
  let tokenId: number;

  await t.test("deve criar o token de garçom", async () => {
    const res = await UsuarioModel.criarTokenGarcom("Teste Unitario 1", tokenVal);
    assert.ok(typeof res === "number");
    tokenId = res as number;
  });

  await t.test("deve buscar o token criado", async () => {
    const res: any = await UsuarioModel.buscarToken(tokenVal);
    assert.ok(res);
    assert.strictEqual(res.nome, "Teste Unitario 1");
    assert.strictEqual(res.token, tokenVal);
  });

  await t.test("deve listar todos os tokens", async () => {
    const list: any = await UsuarioModel.listarTokens();
    assert.ok(Array.isArray(list));
    const found = list.some((item: any) => item.id === tokenId);
    assert.ok(found);
  });

  await t.test("deve atualizar o avatar do garçom", async () => {
    await UsuarioModel.atualizarAvatarToken(tokenVal, "base64_foto_teste");
    const res: any = await UsuarioModel.buscarToken(tokenVal);
    assert.strictEqual(res.avatar, "base64_foto_teste");
  });

  await t.test("deve criar o token de garçom com avatar inicial", async () => {
    const tokenAvatar = `token_avatar_${Date.now()}`;
    const res = await UsuarioModel.criarTokenGarcom("Garçom Avatar", tokenAvatar, "base64_inicial");
    assert.ok(typeof res === "number");
    
    const garcom: any = await UsuarioModel.buscarToken(tokenAvatar);
    assert.strictEqual(garcom.avatar, "base64_inicial");
    
    await UsuarioModel.deletarToken(res as number);
  });

  await t.test("deve retornar undefined para um token inexistente", async () => {
    const res = await UsuarioModel.buscarToken("non_existent_token_value");
    assert.strictEqual(res, undefined);
  });

  await t.test("deve deletar o token pelo ID", async () => {
    const res = await UsuarioModel.deletarToken(tokenId);
    assert.strictEqual(res, true);
    const after: any = await UsuarioModel.buscarToken(tokenVal);
    assert.strictEqual(after, undefined);
  });
});
