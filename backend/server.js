const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { PDFDocument } = require("pdf-lib");

const app = express();

/* ✅ CORS FIX */
app.use(cors({
    origin: "*"
}));

/* ✅ MULTER MEMORY STORAGE */
const upload = multer({ storage: multer.memoryStorage() });

/* TEST ROUTE */
app.get("/", (req, res) => {
    res.send("Backend is running ✅");
});

/* ================= MERGE PDF ================= */
app.post("/merge", upload.array("pdfs"), async (req, res) => {
    try {
        if (!req.files || req.files.length < 2) {
            return res.status(400).send("Upload at least 2 PDFs");
        }

        const mergedPdf = await PDFDocument.create();

        for (let file of req.files) {
            const pdf = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
            const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            pages.forEach(page => mergedPdf.addPage(page));
        }

        const pdfBytes = await mergedPdf.save();

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=merged.pdf"
        });

        res.send(Buffer.from(pdfBytes));

    } catch (err) {
        console.error("MERGE ERROR:", err);
        res.status(500).send("Error merging PDFs");
    }
});

/* ================= COMPRESS PDF ================= */
app.post("/compress", upload.single("pdf"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }

        const pdfDoc = await PDFDocument.load(req.file.buffer);

        // Safe re-save (no corruption)
        const pdfBytes = await pdfDoc.save({
            useObjectStreams: false
        });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=compressed.pdf"
        });

        res.send(Buffer.from(pdfBytes));

    } catch (err) {
        console.error("COMPRESS ERROR:", err);
        res.status(500).send("Compression failed");
    }
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));