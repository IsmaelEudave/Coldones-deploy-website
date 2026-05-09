const puppeteer = require('puppeteer');
const path = require('path');

const PAGE_URL = 'file://' + path.resolve(__dirname, 'index.html');
const OUT_DIR = path.join(__dirname, 'screenshots');

const SHOTS = [
  { name: 'desktop-full',   width: 1440, height: 900,  fullPage: true  },
  { name: 'desktop-hero',   width: 1440, height: 900,  fullPage: false },
  { name: 'tablet',         width: 768,  height: 1024, fullPage: true  },
  { name: 'mobile',         width: 390,  height: 844,  fullPage: true  },
];

(async () => {
  const fs = require('fs');
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  for (const shot of SHOTS) {
    await page.setViewport({ width: shot.width, height: shot.height, deviceScaleFactor: 2 });
    await page.goto(PAGE_URL, { waitUntil: 'networkidle0' });

    // Let web fonts settle
    await new Promise(r => setTimeout(r, 800));

    const file = path.join(OUT_DIR, `${shot.name}.png`);
    await page.screenshot({ path: file, fullPage: shot.fullPage });
    console.log(`  saved → screenshots/${shot.name}.png`);
  }

  await browser.close();
  console.log('\nDone. All screenshots saved to /screenshots');
})();
