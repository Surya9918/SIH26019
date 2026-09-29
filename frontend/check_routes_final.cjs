const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  
  // Test /
  let page = await browser.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('ROOT_CONSOLE_ERROR:', msg.text());
  });
  
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  const rootHtml = await page.content();
  console.log('ROOT HTML LENGTH:', rootHtml.length);
  console.log('ROOT SHOWS LANDING:', rootHtml.includes('Smarter Land Insights'));
  
  // Test /dashboard
  page = await browser.newPage();
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });
  const dashboardHtml = await page.content();
  console.log('DASHBOARD HTML LENGTH:', dashboardHtml.length);
  console.log('DASHBOARD SHOWS OVERVIEW:', dashboardHtml.includes('WELCOME BACK'));
  
  await browser.close();
})();
