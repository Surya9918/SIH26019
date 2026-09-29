const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));
  
  const buttonsToTest = [
    { text: 'Open GIS Studio', name: 'Open GIS Studio' },
    { text: 'View All', name: 'View All (Insights)', index: 0 },
    { text: 'View All', name: 'View All (Activity)', index: 1 },
    { text: 'Search Research', name: 'Search Research (QA)' },
    { text: 'Explore GIS', name: 'Explore GIS (QA)' },
    { text: 'Run Simulation', name: 'Run Simulation (QA)' },
    { text: 'Access Datasets', name: 'Access Datasets (QA)' },
    { text: 'Explore Innovation Hub', name: 'Explore Innovation Hub' }
  ];

  console.log("| Dashboard Element | Expected | Actual | Route/Action | Status |");
  console.log("|-------------------|----------|--------|--------------|--------|");

  for (const btn of buttonsToTest) {
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 500));
    const beforeUrl = page.url();

    const elements = await page.$x(`//button[contains(., "${btn.text}")]`);
    const target = btn.index !== undefined ? elements[btn.index] : elements[0];

    if (!target) {
      console.log(`| ${btn.name} | Working action | Element not found | N/A | FAIL |`);
      continue;
    }

    const waitNav = page.waitForNavigation({ timeout: 2000 }).catch(() => {});
    await target.click();
    await waitNav;
    await new Promise(r => setTimeout(r, 500));

    const afterUrl = page.url();
    let action = "Nothing";
    if (afterUrl !== beforeUrl) action = new URL(afterUrl).pathname + new URL(afterUrl).search;
    
    let status = action !== "Nothing" ? "PASS" : "FAIL";
    
    console.log(`| ${btn.name} | Navigate/Action | ${action} | ${action} | ${status} |`);
  }

  // Also test Search
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 500));
  await page.type('input[type="text"]', 'climate change');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 500));
  const searchUrl = page.url();
  const searchAction = new URL(searchUrl).pathname + new URL(searchUrl).search;
  console.log(`| Search Input | Navigate to /research/repository?q=climate%20change | ${searchAction} | ${searchAction} | ${searchAction.includes('climate%20change') ? "PASS" : "FAIL"} |`);

  await browser.close();
})();
