const puppeteer = require('puppeteer');

async function scrapeArticles() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const allArticles = [];
  let currentPage = 1;

  while (true) {
    const url = `https://hacks.mozilla.org/articles/page/${currentPage}/`;
    console.log(`Visitando: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const articles = await page.evaluate(() => {
      const articleNodes = document.querySelectorAll('li.list-item');
      if (articleNodes.length === 0) return [];

      const data = [];

      articleNodes.forEach((article) => {
        const titleEl = article.querySelector('h3.post__title a');
        const title = titleEl?.innerText.trim() || '';
        const url = titleEl?.href || '';

        const summaryEl = article.querySelector('p.post__tease');
        const summary = summaryEl?.innerText.trim() || '';

        const authorImg = article.querySelector('img');
        const image = authorImg?.src || '';

        const dateEl = article.querySelector('abbr.published');
        const date = dateEl?.getAttribute('title') || dateEl?.innerText.trim() || '';

        const authorAlt = authorImg?.alt || 'Desconocido';

        data.push({ title, summary, author: authorAlt, date, url, image });
      });

      return data;
    });

    if (articles.length === 0) {
      console.log(`No hay más artículos. Fin en la página ${currentPage - 1}.`);
      break;
    }

    allArticles.push(...articles);
    currentPage++;
  }

  await browser.close();
  return allArticles;
}

module.exports = scrapeArticles;
