<<<<<<< HEAD
const scrapeMozillaHacks = require('./src/js/script');
const exportarTXT = require('./src/js/exportarTXT');
const exportarPDF = require('./src/js/exportarPDF');

async function main() {
    try {
        console.log('Iniciando scraping...');
        const articulos = await scrapeMozillaHacks();
        
        console.log(`Se encontraron ${articulos.length} artículos`);
        
        // Exportar
        exportarTXT(articulos);
        await exportarPDF(articulos);
        
        console.log('Proceso completado!');
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
=======
const scrapeArticles = require('./js/script');
const exportarXLSX = require('./js/exportarXLSX');
const exportarPDF = require('./js/exportarPDF');

(async () => {
  const articles = await scrapeArticles();
  exportarXLSX(articles);
  exportarPDF(articles)
})();
>>>>>>> 62b6cc19177b505855c143041df164ed451070c0
