const { test, expect } = require('@playwright/test');

/**
 * Accessibility test for Biblioteca de Promps Industriales.
 * Runs axe-core analysis and only fails on critical violations (serious is logged but doesn't fail).
 * Note: color-contrast is excluded as it requires manual inspection.
 */

test.describe('Accessibility', () => {
  test('should pass axe-core accessibility checks (critical only)', async ({ page }) => {
    await page.goto('/');

    const AxeBuilder = require('@axe-core/playwright');
    const results = await new AxeBuilder({ page }).analyze();

    const critical = results.violations.filter((v) => v.impact === 'critical');
    console.log(
      'Serious violations (no bloqueantes):',
      results.violations.filter((v) => v.impact === 'serious').map((v) => v.id)
    );

    expect(critical).toEqual([]);
  });
});
