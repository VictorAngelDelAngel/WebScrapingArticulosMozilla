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