import { test, expect } from "@playwright/test";

test("Landing Page Flow", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("text=Smart")).toBeVisible();
  await expect(page.locator("text=Cup")).toBeVisible();
  await expect(page.locator("text=Entrar")).toBeVisible();
  await page.click("text=Entrar");
  await expect(page).toHaveURL(/.*login/);
});

test("Login Page Elements and Structure", async ({ page }) => {
  await page.goto("/login");
  await expect(page.locator("text=Bem vindo!")).toBeVisible();
  await expect(page.getByPlaceholder("Email")).toBeVisible();
  await expect(page.getByPlaceholder("Senha")).toBeVisible();
  await expect(page.locator("text=Acesso Garçom (QR Code)")).toBeVisible();
});
