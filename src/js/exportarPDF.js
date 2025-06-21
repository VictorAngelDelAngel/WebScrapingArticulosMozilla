const puppeteer = require('puppeteer');
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');

async function scrapeAndExportPDF() {
    try {
        // Scraping (mismo código que en scraperTXT)
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        
        await page.goto('https://hacks.mozilla.org/', { waitUntil: 'networkidle2' });

        const articles = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.article-list .list-item')).map(item => ({
                title: item.querySelector('.post__title a')?.innerText.trim() || 'Sin título',
                summary: item.querySelector('.post__tease')?.innerText.trim() || 'Sin resumen',
                author: item.querySelector('.avatar')?.alt || 'Autor desconocido',
                date: item.querySelector('.published')?.textContent.trim() || 'Fecha desconocida',
                url: item.querySelector('.post__title a')?.href || '#',
                image: item.querySelector('.avatar')?.src || ''
            }));
        });

        await browser.close();

        // Exportación PDF
        const pdfDoc = await PDFDocument.create();
        let pagePDF = pdfDoc.addPage([595, 842]);
        let y = 780;
        const margin = 50;

        // Título PDF
        pagePDF.drawText('Artículos Mozilla Hacks', {
            x: margin,
            y,
            size: 20,
            color: rgb(0.1, 0.3, 0.6),
        });
        y -= 40;

        // Contenido
        articles.forEach((article, index) => {
            if (y < 100) {
                pagePDF = pdfDoc.addPage([595, 842]);
                y = 780;
            }

            pagePDF.drawText(`${index + 1}. ${article.title}`, {
                x: margin,
                y,
                size: 14,
                color: rgb(0, 0, 0),
            });
            y -= 20;

            pagePDF.drawText(`Por ${article.author} | ${article.date}`, {
                x: margin,
                y,
                size: 10,
                color: rgb(0.4, 0.4, 0.4),
            });
            y -= 15;

            // Función para ajustar texto
            const wrapText = (text, width) => {
                const words = text.split(' ');
                let line = '';
                return words.reduce((lines, word) => {
                    if (line.length + word.length < width) {
                        line += (line ? ' ' : '') + word;
                    } else {
                        lines.push(line);
                        line = word;
                    }
                    return lines;
                }, []).concat(line);
            };

            wrapText(article.summary, 90).forEach(line => {
                pagePDF.drawText(line, {
                    x: margin,
                    y,
                    size: 10,
                    color: rgb(0.1, 0.1, 0.1),
                });
                y -= 12;
            });

            y -= 20;
        });

        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync('articulos.pdf', pdfBytes);
        console.log('✅ PDF generado: articulos.pdf');
        return articles;

    } catch (error) {
        console.error('❌ Error en scraperPDF:', error);
        throw error;
    }
}

module.exports = { scrapeAndExportPDF };