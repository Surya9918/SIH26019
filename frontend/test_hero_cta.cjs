const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000)); // wait for React
  
  // Find the button with text "Explore Dashboard"
  const elements = await page.$x("//a[contains(., 'Explore Dashboard')]");
  if (elements.length > 0) {
    const button = elements[0];
    const box = await button.boundingBox();
    console.log("Hero Button Box:", box);
    
    if (box) {
        const elAtPoint = await page.evaluate(({x, y}) => {
            const el = document.elementFromPoint(x + 5, y + 5);
            return el ? { tagName: el.tagName, className: el.className } : null;
        }, box);
        console.log("Element blocking button:", elAtPoint);
    }
  } else {
    console.log("Hero Button not found!");
  }
  
  await browser.close();
})();
