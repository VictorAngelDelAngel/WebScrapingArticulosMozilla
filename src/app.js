const scrapeArticles = require('./js/script');
const exportarXLSX = require('./js/exportarXLSX');
const exportarPDF = require('./js/exportarPDF');

(async () => {
  const articles = await scrapeArticles();
  exportarXLSX(articles);
  exportarPDF(articles)
})();
