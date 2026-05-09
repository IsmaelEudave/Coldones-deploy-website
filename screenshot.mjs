import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url   = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

const outDir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let n = 1;
while (fs.existsSync(path.join(outDir, `screenshot-${n}${label ? '-'+label : ''}.png`))) n++;
const outFile = path.join(outDir, `screenshot-${n}${label ? '-'+label : ''}.png`);

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    // Software rendering avoids headless GPU compositor issues at y=0
    args: ['--no-sandbox', '--disable-gpu', '--disable-software-rasterizer'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: outFile, fullPage: false });
  console.log(`saved → ${path.relative(__dirname, outFile)}`);
  await browser.close();
})();
