const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  page.on('response', response => {
    if (response.url().includes('arcgisonline.com') || response.url().includes('cartocdn.com') || response.url().includes('tile')) {
      if (!response.ok()) {
        console.log(`TILE ERROR [${response.status()}]: ${response.url()}`);
      }
    }
  });

  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle2', timeout: 30000 });
  
  // Wait a bit more for map tiles to load
  await new Promise(r => setTimeout(r, 3000));
  
  // Take screenshot
  await page.screenshot({ path: 'map_audit_screenshot.png', fullPage: true });
  console.log('Screenshot saved to map_audit_screenshot.png');

  await browser.close();
})();
