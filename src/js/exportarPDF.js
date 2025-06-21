const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

function exportarPDF(data) {
  // Asegurar carpeta de salida
  const outputDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const filePath = path.join(outputDir, 'articulos.pdf');
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text('Artículos de Mozilla Hacks', { align: 'center' });
  doc.moveDown();

  data.forEach((article, i) => {
    doc
      .fontSize(14)
      .fillColor('black')
      .text(`${i + 1}. ${article.title}`, { underline: true });

    doc
      .fontSize(10)
      .fillColor('gray')
      .text(`Autor: ${article.author} | Fecha: ${article.date}`, { oblique: true });

    doc
      .fontSize(12)
      .fillColor('black')
      .text(`Resumen: ${article.summary}`);

    doc
      .fontSize(10)
      .fillColor('blue')
      .text(`URL: ${article.url}`, { link: article.url, underline: true });

    doc.moveDown(2);
  });

  doc.end();
  console.log('PDF generado en:', filePath);
}

module.exports = exportarPDF;
