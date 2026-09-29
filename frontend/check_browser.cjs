const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER_ERROR:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('PAGE_ERROR:', error.message);
  });

  try {
    await page.goto('http://localhost:5173/landing', { waitUntil: 'networkidle0' });
    console.log('Page loaded successfully.');
    // Check if body is empty or has content
    const html = await page.content();
    console.log('HTML Length:', html.length);
  } catch (err) {
    console.log('GOTO_ERROR:', err);
  }

  await browser.close();
})();
