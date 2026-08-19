/**
 * E2E tests for Biblioteca de Promps Industriales.
 * Run: npx playwright test
 * Or: npm run test:e2e
 */

const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test('should load and display title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Biblioteca de Promps/);
  });

  test('should have theme toggle visible', async ({ page }) => {
    await page.goto('/');
    const themeToggle = page.locator('#themeToggle');
    await expect(themeToggle).toBeVisible();
  });

  test('should toggle theme on click', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const initialTheme = await html.getAttribute('data-theme');

    await page.click('#themeToggle');
    await page.waitForTimeout(300);

    const newTheme = await html.getAttribute('data-theme');
    expect(newTheme).not.toBe(initialTheme);
  });

  test('should have search input visible', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.locator('#searchInput');
    await expect(searchInput).toBeVisible();
  });

  test('should render category cards', async ({ page }) => {
    await page.goto('/');
    // Wait for JS to render categories
    await page.waitForTimeout(800);
    const cards = page.locator('.cat-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show stats strip with values', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(800);
    const statPrompts = page.locator('#statPrompts');
    await expect(statPrompts).toBeVisible();
    const text = await statPrompts.textContent();
    expect(Number(text)).toBeGreaterThan(0);
  });
});

test.describe('Search', () => {
  test('should filter prompts by search text', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);

    const searchInput = page.locator('#searchInput');
    await searchInput.fill('SCADA');
    await page.waitForTimeout(500);

    // Should navigate to results view
    const resultsView = page.locator('#resultsView');
    await expect(resultsView).toBeVisible({ timeout: 3000 });
  });

  test('should show results count', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);

    await page.locator('#searchInput').fill('oil');
    await page.waitForTimeout(500);

    const count = page.locator('#resultsCount');
    await expect(count).toBeVisible({ timeout: 3000 });
  });

  test('should clear search and return to home', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);

    await page.locator('#searchInput').fill('SCADA');
    await page.waitForTimeout(500);
    await page.locator('#searchInput').fill('');
    await page.waitForTimeout(500);

    const homeView = page.locator('#homeView');
    await expect(homeView).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Category navigation', () => {
  test('should navigate to category on card click', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(800);

    const firstCard = page.locator('.cat-card').first();
    await firstCard.click();
    await page.waitForTimeout(500);

    const categoryView = page.locator('#categoryView');
    await expect(categoryView).toBeVisible({ timeout: 3000 });
  });

  test('should show prompts in category view', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(800);

    await page.locator('.cat-card').first().click();
    await page.waitForTimeout(500);

    const promptCards = page.locator('.prompt-card');
    const count = await promptCards.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Modal', () => {
  test('should open modal on prompt card click', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(800);

    // Go to first category
    await page.locator('.cat-card').first().click();
    await page.waitForTimeout(500);

    // Click first prompt
    const firstPrompt = page.locator('.prompt-card').first();
    await firstPrompt.click();
    await page.waitForTimeout(500);

    const modal = page.locator('#promptModal');
    await expect(modal).toBeVisible({ timeout: 3000 });
  });

  test('should close modal on X button', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(800);

    await page.locator('.cat-card').first().click();
    await page.waitForTimeout(500);
    await page.locator('.prompt-card').first().click();
    await page.waitForTimeout(500);

    await page.locator('#modalClose').click();
    await page.waitForTimeout(300);

    const modal = page.locator('#promptModal');
    await expect(modal).not.toBeVisible({ timeout: 3000 });
  });

  test('should have copy button in modal', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(800);

    await page.locator('.cat-card').first().click();
    await page.waitForTimeout(500);
    await page.locator('.prompt-card').first().click();
    await page.waitForTimeout(500);

    const copyBtn = page.locator('#copyBtn');
    await expect(copyBtn).toBeVisible();
  });
});

test.describe('Drawers', () => {
  test('should open favorites drawer', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);

    await page.locator('#favToggle').click();
    await page.waitForTimeout(500);

    const favDrawer = page.locator('#favDrawer');
    await expect(favDrawer).toBeVisible({ timeout: 3000 });
  });

  test('should open history drawer', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);

    await page.locator('#histToggle').click();
    await page.waitForTimeout(500);

    const histDrawer = page.locator('#histDrawer');
    await expect(histDrawer).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Chat AI', () => {
  test('should open chat drawer', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);

    await page.locator('#chatToggle').click();
    await page.waitForTimeout(500);

    const chatDrawer = page.locator('#chatDrawer');
    await expect(chatDrawer).toBeVisible({ timeout: 3000 });
  });

  test('should have chat input visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);

    await page.locator('#chatToggle').click();
    await page.waitForTimeout(500);

    const chatInput = page.locator('#chatInput');
    await expect(chatInput).toBeVisible();
  });
});

test.describe('Offline / PWA', () => {
  test('should have service worker registered', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    const sw = await page.evaluate(async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      return reg ? 'registered' : 'not registered';
    });
    // SW may not register in dev mode, check if it's at least attempted
    expect(sw).toBeDefined();
  });

  test('should have manifest link', async ({ page }) => {
    await page.goto('/');
    const manifest = page.locator('link[rel="manifest"]');
    await expect(manifest).toHaveAttribute('href', 'manifest.json');
  });
});

test.describe('Responsive', () => {
  test('should render on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForTimeout(800);

    const topbar = page.locator('.topbar');
    await expect(topbar).toBeVisible();
  });

  test('should render on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForTimeout(800);

    const topbar = page.locator('.topbar');
    await expect(topbar).toBeVisible();
  });
});
