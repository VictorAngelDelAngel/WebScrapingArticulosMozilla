const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs').promises;
const { Parser } = require('json2csv');

// Configurar el plugin de stealth
puppeteer.use(StealthPlugin());

// Función de espera mejorada compatible con todas versiones
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeMozillaHacks() {
  const browser = await puppeteer.launch({
    headless: false, // Cambiar a true después de pruebas
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-position=0,0',
      '--ignore-certificate-errors',
      '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    ]
  });

  const page = await browser.newPage();

  // Configuración avanzada para parecer humano
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9'
  });

  try {
    console.log('🚀 Navegando a Mozilla Hacks...');
    await page.goto('https://hacks.mozilla.org/', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // Espera aleatoria mejorada
    await delay(200000 + Math.random() * 30000);

    console.log('🔍 Buscando artículos...');
    
    const articles = await page.evaluate(() => {
      const items = [];
      const selectors = [
        'article', 
        '.post', 
        '.blog-post',
        '.entry',
        '[class*="card"]',
        'div[class*="post"]',
        'div[class*="article"]'
      ];

      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          const titleEl = el.querySelector('h2, h3, [class*="title"]');
          const title = titleEl?.textContent?.trim();
          
          if (title) {
            items.push({
              title,
              url: titleEl.querySelector('a')?.href || el.querySelector('a[href]')?.href || '',
              summary: el.querySelector('p, [class*="content"], [class*="excerpt"]')?.textContent?.trim() || '',
              author: el.querySelector('[class*="author"], [class*="byline"], .author')?.textContent?.trim() || 'Unknown',
              date: el.querySelector('time, [class*="date"], [datetime]')?.textContent?.trim() || '',
              image: el.querySelector('img, [class*="image"], [class*="thumb"]')?.src || ''
            });
          }
        });
      });

      return items.filter((item, index, self) => 
        item.title && 
        item.url && 
        self.findIndex(i => i.url === item.url) === index
      );
    });

    if (articles.length === 0) {
      console.log('⚠ No se encontraron artículos. Tomando captura para diagnóstico...');
      await page.screenshot({ path: 'debug.png', fullPage: true });
      console.log('📸 Captura guardada como debug.png - Verifica los selectores');
    } else {
      console.log(`✅ Se encontraron ${articles.length} artículos`);
      await saveResults(articles);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

async function saveResults(data) {
  try {
    await fs.writeFile('articles.json', JSON.stringify(data, null, 2));
    console.log('💾 JSON guardado en articles.json');
    
    const fields = ['title', 'url', 'summary', 'author', 'date', 'image'];
    const parser = new Parser({ fields });
    const csv = parser.parse(data);
    await fs.writeFile('articles.csv', '\uFEFF' + csv, 'utf8');
    console.log('💾 CSV guardado en articles.csv');
  } catch (error) {
    console.error('Error al guardar archivos:', error.message);
  }
}

// Verificar e instalar dependencias automáticamente
(async () => {
  try {
    require.resolve('puppeteer-extra');
    require.resolve('puppeteer-extra-plugin-stealth');
    console.log('✅ Dependencias ya instaladas');
    await scrapeMozillaHacks();
  } catch (e) {
    console.log('Instalando dependencias necesarias...');
    const { exec } = require('child_process');
    exec('npm install puppeteer-extra puppeteer-extra-plugin-stealth', (err) => {
      if (err) {
        console.error('Error instalando dependencias:', err);
        return;
      }
      console.log('✅ Dependencias instaladas correctamente');
      scrapeMozillaHacks();
    });
  }
})();