const fs = require('fs');
const path = require('path');

function exportarTXT(articulos, filename = 'articulos.txt') {
    let contenido = 'ARTÍCULOS DE MOZILLA HACKS\n\n';
    contenido += '=================================\n\n';

    articulos.forEach((articulo, index) => {
        contenido += `ARTÍCULO ${index + 1}\n`;
        contenido += `Título: ${articulo.title}\n`;
        contenido += `Autor: ${articulo.author}\n`;
        contenido += `Fecha: ${articulo.date}\n`;
        contenido += `URL: ${articulo.url}\n\n`;
        contenido += `Resumen:\n${articulo.summary}\n\n`;
        contenido += '---------------------------------\n\n';
    });

    const outputPath = path.join(__dirname, '../../../', filename);
    fs.writeFileSync(outputPath, contenido, 'utf-8');
    console.log(`Archivo TXT generado: ${outputPath}`);
}

module.exports = exportarTXT;