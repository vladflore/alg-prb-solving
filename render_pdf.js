const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({ width: 1400, height: 900 });

  const problemsDir = path.resolve(__dirname, "problems");
  const files = fs.readdirSync(problemsDir);
  const htmlFiles = files.filter((file) => file.endsWith(".html"));

  for (const htmlFile of htmlFiles) {
    const htmlFilePath = path.join(problemsDir, htmlFile);
    const pdfFileName = htmlFile.replace(".html", ".pdf");
    const pdfFilePath = path.join(problemsDir, pdfFileName);

    try {
      await page.goto(`file://${htmlFilePath}`, {
        waitUntil: "networkidle0",
      });

      await page.pdf({
        path: pdfFilePath,
        format: "A4",
        landscape: true,
        printBackground: true,
        margin: { top: "15mm", bottom: "15mm", left: "12mm", right: "12mm" },
        scale: 0.95,
        displayHeaderFooter: true,
        headerTemplate: `<div style="width: 100%; padding: 0 12mm; font-family: Arial, sans-serif;">
          <div style="display: flex; align-items: center; justify-content: flex-end; color: #2c3e50;">
            <span style="font-size: 9px; font-weight: 600; letter-spacing: 0.2px;">© vladflore.tech</span>
          </div>
        </div>`,
        footerTemplate:
          '<div style="font-size: 10px; width: 100%; text-align: center; color: #666; margin: 0; padding: 0;"><span class="pageNumber"></span></div>',
      });

      console.log(`PDF generated: ${pdfFilePath}`);
    } catch (error) {
      console.error(`Error processing ${htmlFilePath}:`, error.message);
    }
  }

  await browser.close();
})();
