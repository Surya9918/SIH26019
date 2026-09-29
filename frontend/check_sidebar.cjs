const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  
  console.log("BEFORE URL:", page.url());
  
  // Find Policy parent element
  const elements = await page.$$('button, a');
  let policyElement;
  for (let el of elements) {
      let text = await page.evaluate(e => e.textContent, el);
      if (text && text.includes('Policy') && !text.includes('Documents') && !text.includes('Simulation')) {
          policyElement = el;
          console.log("Found Policy HTML element:", await page.evaluate(e => e.outerHTML, el));
          console.log("Tag:", await page.evaluate(e => e.tagName, el));
          console.log("Href:", await page.evaluate(e => e.getAttribute('href'), el));
          break;
      }
  }
  
  if (policyElement) {
      const waitNav = page.waitForNavigation({ timeout: 3000 }).catch(() => {
          console.log("No navigation occurred within 3s");
      });
      await policyElement.click();
      await waitNav;
      await new Promise(r => setTimeout(r, 500));
      console.log("AFTER URL:", page.url());
  } else {
      console.log("Policy element not found!");
  }
  
  await browser.close();
})();
