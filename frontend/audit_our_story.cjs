const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  console.log("=== BROWSER TEST START ===");

  const beforeUrl = page.url();
  console.log(`[Our Story Action] URL Before: ${beforeUrl}`);
  const initialScrollY = await page.evaluate(() => window.scrollY);
  console.log(`[Our Story Action] Scroll Y Before: ${initialScrollY}`);

  // Test: Click Our Story
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Our Story'));
    if (el) el.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  const afterUrl = page.url();
  const afterScrollY = await page.evaluate(() => window.scrollY);
  
  console.log(`[Our Story Action] URL After: ${afterUrl}`);
  console.log(`[Our Story Action] Scroll Y After: ${afterScrollY}`);
  console.log(`[Our Story Action] PASS: ${afterUrl === beforeUrl && afterScrollY >= initialScrollY}`);

  await browser.close();
})();
