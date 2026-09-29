const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  // Test click on the Hero CTA button (it's the second link to /dashboard)
  const buttons = await page.$$('a[href="/dashboard"]');
  if (buttons.length > 1) {
    const heroButton = buttons[1];
    
    const text = await page.evaluate(el => el.textContent, heroButton);
    console.log("Found Hero Button:", text);
    
    try {
      await Promise.all([
        page.waitForNavigation({ timeout: 5000 }),
        heroButton.click()
      ]);
      console.log("SUCCESS: Hero CTA clicked and navigated to:", page.url());
    } catch (e) {
      console.log("ERROR clicking Hero CTA:", e.message);
    }
  } else {
    console.log("Could not find hero button!");
  }
  
  await browser.close();
})();
