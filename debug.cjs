const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173');
  console.log('Page title:', await page.title());
  const content = await page.content();
  console.log('Content length:', content.length);
  // Look for input
  const input = await page.$('input[name="patternYardage"]');
  console.log('Input found:', !!input);
  if (input) {
    console.log('Input outerHTML:', await input.evaluate(el => el.outerHTML));
  }
  await page.screenshot({ path: '/tmp/debug.png' });
  await browser.close();
})();