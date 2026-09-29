const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  
  console.log("Checking Explore Dashboard button...");
  const buttonSelector = 'a[href="/dashboard"]';
  const button = await page.$(buttonSelector);
  
  if (button) {
    const box = await button.boundingBox();
    console.log("Button Bounding Box:", box);
    
    // Check if covered by another element
    const elementAtPoint = await page.evaluate(({x, y}) => {
      const el = document.elementFromPoint(x + 5, y + 5);
      return el ? { tagName: el.tagName, className: el.className } : null;
    }, box);
    console.log("Element at button center:", elementAtPoint);
    
    try {
      await Promise.all([
        page.waitForNavigation({ timeout: 5000 }),
        page.click(buttonSelector)
      ]);
      console.log("SUCCESS: Button clicked and navigated to:", page.url());
    } catch (err) {
      console.log("ERROR clicking or navigating:", err.message);
    }
  } else {
    console.log("Button not found in DOM");
  }

  await browser.close();
})();
