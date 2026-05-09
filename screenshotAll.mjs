import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const sections = [
  { id: '#services',  label: 'services'  },
  { id: '#about',     label: 'about'     },
  { id: '#process',   label: 'process'   },
  { id: '#reviews',   label: 'reviews'   },
  { id: '#faq',       label: 'faq'       },
  { id: '#contact',   label: 'contact'   },
  { id: 'footer',     label: 'footer'    },
];

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // trust bar + stats
  await page.evaluate(() => {
    document.querySelector('.trust-bar').scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 400));
  let n = 2;
  while (fs.existsSync(path.join(outDir, `screenshot-${n}-trustbar.png`))) n++;
  await page.screenshot({ path: path.join(outDir, `screenshot-${n}-trustbar.png`) });
  console.log(`saved trustbar`);

  for (const sec of sections) {
    await page.evaluate((id) => {
      const el = id === 'footer'
        ? document.querySelector('footer')
        : document.querySelector(id);
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    }, sec.id);
    await new Promise(r => setTimeout(r, 500));
    let num = 2;
    while (fs.existsSync(path.join(outDir, `screenshot-${num}-${sec.label}.png`))) num++;
    await page.screenshot({ path: path.join(outDir, `screenshot-${num}-${sec.label}.png`) });
    console.log(`saved ${sec.label}`);
  }

  await browser.close();
  console.log('Done.');
})();
