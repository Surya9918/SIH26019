const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  
  // Wait a bit for React to render
  await new Promise(r => setTimeout(r, 2000));
  
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
    
    // Check overlapping elements and layout
    const zIndexes = await page.evaluate(() => {
        const c = document.querySelector('.absolute.inset-0.z-10');
        if (!c) return "No Canvas Container";
        return window.getComputedStyle(c).zIndex;
    });
    console.log("Canvas Container Z-Index:", zIndexes);
    
  } else {
    console.log("Button not found in DOM");
  }

  await browser.close();
})();
