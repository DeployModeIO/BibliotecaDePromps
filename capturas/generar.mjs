import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const OUT = 'capturas';

const desktop = { width: 1440, height: 900 };
const mobile = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

async function shot(browser, { viewport, file, url = '/', fullPage = false, light = false, action = null }) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  await page.goto(BASE + url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(4200);
  if (light) {
    await page.click('#themeToggle');
    await page.waitForTimeout(3800);
  }
  if (action) await action(page);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${file}`, fullPage });
  await ctx.close();
  console.log(`OK ${file}`);
}

const openModal = async (page) => {
  await page.locator('.cat-panel').first().click();
  await page.waitForSelector('.pcard', { timeout: 10000 });
  await page.locator('.pcard').first().click();
  await page.waitForTimeout(700);
};

const openPalette = async (page) => {
  await page.keyboard.press('Control+k');
  await page.waitForSelector('#paletteInput', { timeout: 5000 });
  await page.fill('#paletteInput', 'auditor');
  await page.waitForTimeout(4200);
};

const browser = await chromium.launch();

await shot(browser, { viewport: desktop, file: 'index-desktop-dark.png' });
await shot(browser, { viewport: desktop, file: 'index-desktop-light.png', light: true });
await shot(browser, { viewport: mobile, file: 'index-mobile-dark.png' });
await shot(browser, { viewport: mobile, file: 'index-mobile-light.png', light: true });
await shot(browser, { viewport: desktop, file: 'landing-desktop.png', url: '/landing.html', fullPage: true });
await shot(browser, { viewport: mobile, file: 'landing-mobile.png', url: '/landing.html', fullPage: true });
await shot(browser, { viewport: desktop, file: 'index-desktop-modal.png', action: openModal });
await shot(browser, { viewport: desktop, file: 'index-desktop-paleta.png', action: openPalette });

await browser.close();
