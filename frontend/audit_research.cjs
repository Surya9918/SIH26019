const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));
  
  console.log("=== BROWSER TEST START ===");

  // Test 1: Click Research parent
  const parentUrlBefore = page.url();
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Research'));
    if (el) el.click();
  });
  await new Promise(r => setTimeout(r, 500));
  const parentUrlAfter = page.url();
  
  console.log(`[Research Parent Toggle] URL Before: ${new URL(parentUrlBefore).pathname}, URL After: ${new URL(parentUrlAfter).pathname}`);
  console.log(`[Research Parent Toggle] PASS: ${parentUrlBefore === parentUrlAfter}`);

  // Test 2: Click Research Repository
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('a')).find(el => el.textContent.includes('Research Repository'));
    if (el) el.click();
  });
  await new Promise(r => setTimeout(r, 500));
  const repoUrl = page.url();
  
  const hasRepoHeading = await page.evaluate(() => document.body.textContent.includes('Research Knowledge Repository'));
  console.log(`[Research Repository] URL: ${new URL(repoUrl).pathname}`);
  console.log(`[Research Repository] PASS: ${new URL(repoUrl).pathname === '/research/repository' && hasRepoHeading}`);

  // Test 3: Click Saved Research
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('a')).find(el => el.textContent.includes('Saved Research'));
    if (el) el.click();
  });
  await new Promise(r => setTimeout(r, 500));
  const savedUrl = page.url();
  
  const hasSavedHeading = await page.evaluate(() => document.body.textContent.includes('Saved Research') && document.body.textContent.includes('No Saved Research Yet'));
  console.log(`[Saved Research] URL: ${new URL(savedUrl).pathname}`);
  console.log(`[Saved Research] PASS: ${new URL(savedUrl).pathname === '/research/saved' && hasSavedHeading}`);

  // Test 4: Click Publications
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('a')).find(el => el.textContent.includes('Publications'));
    if (el) el.click();
  });
  await new Promise(r => setTimeout(r, 500));
  const pubUrl = page.url();
  
  const hasPubHeading = await page.evaluate(() => document.body.textContent.includes('Publications') && document.body.textContent.includes('Browse peer-reviewed research publications'));
  console.log(`[Publications] URL: ${new URL(pubUrl).pathname}`);
  console.log(`[Publications] PASS: ${new URL(pubUrl).pathname === '/research/publications' && hasPubHeading}`);

  await browser.close();
})();
