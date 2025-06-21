const scrapeArticles = require('./js/script');
const exportarXLSX = require('./js/exportarXLSX');

(async () => {
  const articles = await scrapeArticles();
  exportarXLSX(articles);
})();
