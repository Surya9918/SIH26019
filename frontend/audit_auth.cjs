const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));
  
  console.log("=== BROWSER TEST START ===");

  const beforeUrl = page.url();
  console.log(`[Landing Page] URL: ${new URL(beforeUrl).pathname}`);

  // Test 1: Click Login
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('a')).find(el => el.textContent.includes('Login'));
    if (el) el.click();
  });
  await new Promise(r => setTimeout(r, 500));
  const loginUrl = page.url();
  
  const hasLoginHeading = await page.evaluate(() => document.body.textContent.includes('Welcome back'));
  console.log(`[Login Action] URL: ${new URL(loginUrl).pathname}`);
  console.log(`[Login Action] PASS: ${new URL(loginUrl).pathname === '/login' && hasLoginHeading}`);

  // Navigate back to landing
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 500));

  // Test 2: Click Sign Up
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('a')).find(el => el.textContent.includes('Sign Up'));
    if (el) el.click();
  });
  await new Promise(r => setTimeout(r, 500));
  const signupUrl = page.url();
  
  const hasSignupHeading = await page.evaluate(() => document.body.textContent.includes('Create an account'));
  console.log(`[Sign Up Action] URL: ${new URL(signupUrl).pathname}`);
  console.log(`[Sign Up Action] PASS: ${new URL(signupUrl).pathname === '/signup' && hasSignupHeading}`);

  await browser.close();
})();
