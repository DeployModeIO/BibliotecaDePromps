const { test, expect } = require('@playwright/test');

/**
 * Accessibility tests para Biblioteca de Promps Industriales.
 * v3.6: ahora falla también en violaciones "serious" (antes solo critical)
 * y verifica navegación por teclado de categorías y cards.
 * Nota: color-contrast se excluye del análisis automático (se audita con los
 * tokens --txt-* ya corregidos a ≥4.5:1 en ambos temas).
 */

test.describe('Accessibility', () => {
  test('should pass axe-core accessibility checks (critical + serious)', async ({ page }) => {
    await page.goto('/');

    const AxeBuilder = require('@axe-core/playwright');
    const results = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze();

    const blocking = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    if (blocking.length) {
      console.log(
        'Violaciones bloqueantes:',
        blocking.map((v) => `${v.id} (${v.impact})`)
      );
    }
    expect(blocking).toEqual([]);
  });

  test('categorías y cards son operables por teclado', async ({ page }) => {
    await page.goto('/');

    // La primera categoría tiene role=button y tabindex=0
    const firstCat = page.locator('.cat-panel').first();
    await expect(firstCat).toHaveAttribute('role', 'button');
    await expect(firstCat).toHaveAttribute('tabindex', '0');

    // Enfocar con teclado y abrir con Enter
    await firstCat.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#categoryView')).toBeVisible();

    // La primera card del sistema también es operable por teclado
    const firstCard = page.locator('.pcard').first();
    await expect(firstCard).toHaveAttribute('role', 'button');
    await expect(firstCard).toHaveAttribute('tabindex', '0');
    await firstCard.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#promptModal')).toHaveClass(/active/);
  });

  test('los chips de filtro anuncian su estado con aria-pressed', async ({ page }) => {
    await page.goto('/');
    const chipCritica = page.locator('.chip[data-priority="critica"]');
    await expect(chipCritica).toHaveAttribute('aria-pressed', 'false');
    await chipCritica.click();
    await expect(chipCritica).toHaveAttribute('aria-pressed', 'true');
  });
});
