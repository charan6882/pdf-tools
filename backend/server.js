const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { PDFDocument } = require("pdf-lib");

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

/* MERGE PDF */
app.post("/merge", upload.array("pdfs"), async (req, res) => {
    try {
        const mergedPdf = await PDFDocument.create();

        for (let file of req.files) {
            const pdf = await PDFDocument.load(file.buffer);
            const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            pages.forEach(page => mergedPdf.addPage(page));
        }

        const pdfBytes = await mergedPdf.save();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=merged.pdf");
        res.send(pdfBytes);

    } catch (err) {
        res.status(500).send("Error merging PDFs");
    }
});

/* COMPRESS PDF (basic) */
app.post("/compress", upload.single("pdf"), async (req, res) => {
    try {
        const pdfDoc = await PDFDocument.load(req.file.buffer);
        const pages = pdfDoc.getPages();

        for (let page of pages) {
            page.scale(0.8, 0.8);
        }

        const pdfBytes = await pdfDoc.save({
            useObjectStreams: false
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=compressed.pdf");
        res.send(pdfBytes);

    } catch (err) {
        res.status(500).send("Compression failed");
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));