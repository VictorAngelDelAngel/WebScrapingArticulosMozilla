const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

function exportarXLSX(data) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Artículos');

  const outputDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const filePath = path.join(outputDir, 'articulos.xlsx');
  XLSX.writeFile(workbook, filePath);

  console.log('Archivo Excel generado:', filePath);
}

module.exports = exportarXLSX;
