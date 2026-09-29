const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  
  // Test /landing
  let page = await browser.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('LANDING_CONSOLE_ERROR:', msg.text());
  });
  page.on('pageerror', err => console.log('LANDING_PAGE_ERROR:', err.message));
  
  await page.goto('http://localhost:5173/landing', { waitUntil: 'networkidle0' });
  const landingHtml = await page.content();
  console.log('LANDING HTML LENGTH:', landingHtml.length);
  console.log('LANDING TEXT FOUND:', landingHtml.includes('Smarter Land Insights'));
  
  // Test /
  page = await browser.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  const rootHtml = await page.content();
  console.log('ROOT HTML LENGTH:', rootHtml.length);
  console.log('ROOT TEXT FOUND (Dashboard indicator):', rootHtml.includes('WELCOME BACK'));
  
  await browser.close();
})();
