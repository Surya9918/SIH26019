const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  const runTest = async (label, isParent) => {
    console.log(`\n--- Testing ${isParent ? 'Parent' : 'Child'}: ${label} ---`);
    
    // reset to dashboard
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 500));
    const beforeUrl = page.url();
    
    // expand parents if this is a child
    if (!isParent) {
      const parents = await page.$$('button');
      for (let p of parents) {
         let pText = await page.evaluate(e => e.textContent, p);
         if (pText && (pText.includes('Policy') || pText.includes('Geospatial') || pText.includes('Data & Analytics') || pText.includes('Research'))) {
             // click to expand
             await p.click();
             await new Promise(r => setTimeout(r, 100));
         }
      }
    }

    const elements = await page.$$('a, button');
    let targetEl;
    for (let el of elements) {
      let text = await page.evaluate(e => e.textContent, el);
      if (text && text.trim() === label) {
          targetEl = el;
          break;
      }
    }
    
    if (!targetEl) {
       console.log(`Element not found for ${label}`);
       return;
    }

    console.log("Found element, clicking...");
    const waitNav = page.waitForNavigation({ timeout: 2000 }).catch(() => {});
    await targetEl.click();
    await waitNav;
    await new Promise(r => setTimeout(r, 500));
    
    const afterUrl = page.url();
    console.log(`Before URL: ${beforeUrl}`);
    console.log(`After URL: ${afterUrl}`);
    
    // Verify
    if (isParent) {
       if (afterUrl === beforeUrl) {
           console.log("SUCCESS: URL unchanged");
       } else {
           console.log("FAILED: URL changed!");
       }
    } else {
       if (afterUrl.includes('dashboard')) {
           console.log("FAILED: Redirected to dashboard!");
       } else {
           console.log("SUCCESS: Navigated to " + new URL(afterUrl).pathname);
       }
    }
  };

  // Test Parents
  await runTest('Policy', true);
  await runTest('Geospatial', true);
  await runTest('Data & Analytics', true);
  await runTest('Research', true);

  // Test Children
  await runTest('Research Repository', false);
  await runTest('Saved Research', false);
  await runTest('Publications', false);
  await runTest('Policy Documents', false);
  await runTest('Policy Simulation', false);
  await runTest('Maps & GIS', false);
  await runTest('Land Use Analysis', false);
  await runTest('Climate Risk', false);
  await runTest('Datasets', false);
  await runTest('Insights & Reports', false);
  await runTest('Workspaces', false);
  await runTest('Hackathons & Innovation', false);

  await browser.close();
})();
