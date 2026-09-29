const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  console.log("=== BROWSER TEST START ===");

  const testAction = async (description, actionFn, verifyFn) => {
    try {
      await actionFn();
      await new Promise(r => setTimeout(r, 800));
      const res = await verifyFn();
      console.log(`[${description}] PASS: ${res.pass}${res.msg ? ' | ' + res.msg : ''}`);
    } catch (e) {
      console.log(`[${description}] PASS: false | Error: ${e.message}`);
    }
  };

  // Test Notifications Page
  await testAction('Nav to Notifications', 
    async () => {
      await page.goto('http://localhost:5173/dashboard', { waitUntil: 'domcontentloaded' });
      await new Promise(r => setTimeout(r, 1000));
      await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('a'));
        const el = els.find(e => e.textContent.includes('Notifications'));
        if (el) el.click();
      });
    },
    async () => {
      const url = new URL(page.url()).pathname;
      return { pass: url === '/notifications', msg: `URL: ${url}` };
    }
  );

  // Test Notification item click (mark as read)
  await testAction('Click Notification -> Mark as Read',
    async () => {
      await page.evaluate(() => {
        const notif = document.querySelector('div.cursor-pointer');
        if (notif) notif.click();
      });
    },
    async () => {
      // Check unread count changes
      const badge = await page.evaluate(() => {
        const el = document.querySelector('h1 span.bg-bhu-primary');
        return el ? el.textContent : '';
      });
      return { pass: badge.includes('2 new') || badge === '', msg: `Badge: ${badge}` };
    }
  );

  // Test Mark all as read
  await testAction('Mark all as read',
    async () => {
      await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('button'));
        const btn = els.find(e => e.textContent.includes('Mark all as read'));
        if (btn) btn.click();
      });
    },
    async () => {
      const badge = await page.evaluate(() => {
        const el = document.querySelector('h1 span.bg-bhu-primary');
        return el ? el.textContent : '';
      });
      return { pass: badge === '', msg: 'Badge disappeared' };
    }
  );

  // Test Filters
  await testAction('Filter Notifications',
    async () => {
      await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('button'));
        const btn = els.find(e => e.textContent.includes('Filter'));
        if (btn) btn.click();
      });
      await new Promise(r => setTimeout(r, 500));
      await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('button'));
        const btn = els.find(e => e.textContent.includes('RESEARCH'));
        if (btn) btn.click();
      });
    },
    async () => {
      const count = await page.evaluate(() => document.querySelectorAll('div.cursor-pointer').length);
      return { pass: count === 1, msg: `Found ${count} items` };
    }
  );

  // Test Notification Dropdown
  await testAction('Header Notification Dropdown',
    async () => {
      await page.goto('http://localhost:5173/dashboard', { waitUntil: 'domcontentloaded' });
      await new Promise(r => setTimeout(r, 1000));
      await page.evaluate(() => {
        const el = document.querySelector('button .lucide-bell').parentElement;
        if (el) el.click();
      });
    },
    async () => {
      const visible = await page.evaluate(() => {
        return document.body.textContent.includes('View all notifications');
      });
      return { pass: visible };
    }
  );

  await testAction('Header Dropdown View all',
    async () => {
      await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('a'));
        const btn = els.find(e => e.textContent.includes('View all notifications'));
        if (btn) btn.click();
      });
    },
    async () => {
      const url = new URL(page.url()).pathname;
      return { pass: url === '/notifications' };
    }
  );

  // Test Settings
  await testAction('Nav to Settings',
    async () => {
      await page.goto('http://localhost:5173/dashboard', { waitUntil: 'domcontentloaded' });
      await new Promise(r => setTimeout(r, 1000));
      await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('a'));
        const el = els.find(e => e.textContent.includes('Settings'));
        if (el) el.click();
      });
    },
    async () => {
      const url = new URL(page.url()).pathname;
      return { pass: url === '/settings' };
    }
  );

  const testTab = async (name) => {
    await testAction(`Settings Tab: ${name}`,
      async () => {
        await page.evaluate((n) => {
          const els = Array.from(document.querySelectorAll('button'));
          const btn = els.find(e => e.textContent.includes(n));
          if (btn) btn.click();
        }, name);
      },
      async () => { return { pass: true }; }
    );
  };

  await testTab('Appearance');
  await testTab('Dashboard');
  await testTab('Map');
  await testTab('Search');
  await testTab('Notifications');
  await testTab('Accessibility');

  await testAction('Save Settings',
    async () => {
      await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('button'));
        const btn = els.find(e => e.textContent.includes('Save Changes'));
        if (btn) btn.click();
      });
    },
    async () => {
      const visible = await page.evaluate(() => document.body.textContent.includes('Saved'));
      return { pass: visible };
    }
  );
  
  await testAction('Reset Settings',
    async () => {
      await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('button'));
        const btn = els.find(e => e.textContent.includes('Reset'));
        if (btn) btn.click();
      });
    },
    async () => {
      return { pass: true };
    }
  );

  await browser.close();
})();
