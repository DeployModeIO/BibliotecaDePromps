import { test, expect } from '@playwright/test';

const HEALTH = { ok: true, workspace: 'C:/Test', roots: ['C:/Test'], version: '1.1.0', pid: 1234 };

test.describe('Modo agente completo — Chat IA', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('http://127.0.0.1:4864/health', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(HEALTH) })
    );
    await page.goto('/');
    await page.waitForTimeout(400);
  });

  test('el botón ⚡ habilita modo agente, checkbox y estado de capacidades', async ({ page }) => {
    await page.click('#chatToggle');
    await expect(page.locator('#chatDrawer')).toHaveClass(/active/);
    await page.click('#aiConfigPanel > summary');

    const force = page.locator('#aiAgentForce');
    await expect(force).toContainText('Activar modo agente COMPLETO');

    await force.click();

    await expect(force).toContainText('Modo agente COMPLETO activo');
    await expect(force).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#aiAgentMode')).toBeChecked();

    const caps = page.locator('#aiAgentCapsStatus');
    await expect(caps).toContainText('📁');
    await expect(caps).toContainText('💻 Comandos: ✔ disponible');
    await expect(caps).toContainText('🌐 ✔ sin CORS');
  });

  test('la página puede contactar al servidor agente en 127.0.0.1 (regresión CSP)', async ({ page }) => {
    await page.click('#chatToggle');
    await page.click('#aiConfigPanel > summary');
    // detectAgentServer corre al init; el fetch a 127.0.0.1 solo pasa si la CSP lo permite
    await expect(page.locator('#aiAgentServerStatus')).toContainText('🟢 Conectado', { timeout: 8000 });
  });

  test('clic de nuevo desactiva el modo agente', async ({ page }) => {
    await page.click('#chatToggle');
    await page.click('#aiConfigPanel > summary');
    const force = page.locator('#aiAgentForce');
    await force.click();
    await expect(force).toContainText('activo');
    await force.click();
    await expect(force).toContainText('Activar modo agente COMPLETO');
    await expect(page.locator('#aiAgentMode')).not.toBeChecked();
  });
});

test.describe('Modo agente con servicios reales (sin mocks)', () => {
  let real = false;
  let ollama = false;

  test.beforeAll(async () => {
    try {
      real = (await fetch('http://127.0.0.1:4864/health')).ok;
    } catch {
      real = false;
    }
    try {
      ollama = (await fetch('http://localhost:11434/api/tags')).ok;
    } catch {
      ollama = false;
    }
  });

  test('⚡ cablea solo: servidor real, proveedor automático y modelo con tools', async ({ page }) => {
    test.skip(!real || !ollama, 'servidor agente u Ollama no disponibles');
    await page.goto('/');
    await page.waitForTimeout(800);
    await page.click('#chatToggle');
    await page.click('#aiConfigPanel > summary');
    await page.click('#aiAgentForce');

    await expect(page.locator('#aiAgentServerStatus')).toContainText('Conectado', { timeout: 20000 });
    await expect(page.locator('#aiProviderSelect')).not.toHaveValue('', { timeout: 20000 });
    await expect(page.locator('#aiModelSelect')).not.toHaveValue('');
    await expect(page.locator('#aiAgentCapsStatus')).toContainText('💻 Comandos: ✔ disponible', { timeout: 20000 });
  });
});
