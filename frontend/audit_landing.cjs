const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const testClick = async (selector, description, expectedPath, expectHash = false) => {
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1000));
    
    let clicked = await page.evaluate((sel, text) => {
      const els = Array.from(document.querySelectorAll('a, button, div.cursor-pointer'));
      const el = els.find(e => e.textContent.includes(text) || (e.innerText && e.innerText.includes(text)));
      if (el) {
        el.click();
        return true;
      }
      return false;
    }, selector, description);
    
    if (!clicked) {
      console.log(`[${description}] PASS: false (Element not found)`);
      return;
    }
    
    await new Promise(r => setTimeout(r, 1000));
    const url = new URL(page.url());
    const pass = expectHash ? url.hash === expectedPath : url.pathname === expectedPath;
    console.log(`[${description}] PASS: ${pass} | Expected: ${expectedPath} | Actual: ${expectHash ? url.hash : url.pathname}`);
  };

  const testDropdown = async (text, checkText) => {
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1000));
    
    let clicked = await page.evaluate((t) => {
      const el = Array.from(document.querySelectorAll('button')).find(e => e.textContent.includes(t));
      if (el) {
        el.click();
        return true;
      }
      return false;
    }, text);
    
    if (!clicked) {
      console.log(`[${text} Dropdown] PASS: false (Button not found)`);
      return;
    }
    
    await new Promise(r => setTimeout(r, 500));
    const visible = await page.evaluate((ct) => {
      return document.body.textContent.includes(ct);
    }, checkText);
    
    console.log(`[${text} Dropdown] PASS: ${visible} | Checked visibility of: ${checkText}`);
  };

  console.log("=== BROWSER TEST START ===");

  await testClick('a', 'Login', '/login');
  await testClick('a', 'Sign Up', '/signup');
  await testClick('a', 'Explore Dashboard', '/dashboard');
  
  // Learn More scroll check
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('button')).find(e => e.textContent.includes('Learn More'));
    if (el) el.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  // Since hash might not update on scrollIntoView, just check if we scrolled
  const scrolledY = await page.evaluate(() => window.scrollY);
  console.log(`[Learn More] PASS: ${scrolledY > 0} | Scrolled Y: ${scrolledY}`);

  await testDropdown('India at a Glance', 'Land Use Mapping');
  await testDropdown('Map Layers', 'Climate Risk');

  await testClick('div', 'Geospatial Intelligence', '/gis/maps');
  await testClick('div', 'Research & Policy', '/research/repository');
  await testClick('div', 'Policy Simulation', '/policy/simulation');
  await testClick('div', 'Open Datasets', '/data/datasets');
  
  await browser.close();
})();
