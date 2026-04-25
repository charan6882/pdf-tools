const BACKEND_URL = "https://pdf-tools-backend-1bd0.onrender.com";

/* TOGGLE */
function showImageTool() {
    document.getElementById("imageSection").classList.remove("hidden");
    document.getElementById("mergeSection").classList.add("hidden");
    document.getElementById("compressSection").classList.add("hidden");
}

function showMergeTool() {
    document.getElementById("mergeSection").classList.remove("hidden");
    document.getElementById("imageSection").classList.add("hidden");
    document.getElementById("compressSection").classList.add("hidden");
}

function showCompressTool() {
    document.getElementById("compressSection").classList.remove("hidden");
    document.getElementById("imageSection").classList.add("hidden");
    document.getElementById("mergeSection").classList.add("hidden");
}

/* IMAGE → PDF */
let filesList = [];

function handleFiles(files) {
    for (let file of files) {
        filesList.push(file);
    }
}

async function convertToPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    if (filesList.length === 0) {
        alert("Upload images first!");
        return;
    }

    for (let i = 0; i < filesList.length; i++) {
        const imgData = await readFile(filesList[i]);
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 10, 10, 180, 160);
    }

    pdf.save("converted.pdf");
}

function readFile(file) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

/* MERGE */
async function mergePDF() {
    try {
        const files = document.getElementById("pdfInput").files;

        if (files.length < 2) {
            alert("Upload at least 2 PDFs");
            return;
        }

        alert("Processing... wait few seconds");

        const formData = new FormData();
        for (let file of files) formData.append("pdfs", file);

        const res = await fetch(`${BACKEND_URL}/merge`, {
            method: "POST",
            body: formData
        });

        if (!res.ok) throw new Error();

        download(await res.blob(), "merged.pdf");

    } catch {
        alert("Merge failed");
    }
}

/* COMPRESS */
async function compressPDF() {
    try {
        const file = document.getElementById("compressInput").files[0];

        if (!file) {
            alert("Upload PDF");
            return;
        }

        const formData = new FormData();
        formData.append("pdf", file);

        const res = await fetch(`${BACKEND_URL}/compress`, {
            method: "POST",
            body: formData
        });

        if (!res.ok) throw new Error();

        download(await res.blob(), "compressed.pdf");

    } catch {
        alert("Compression failed");
    }
}

/* DOWNLOAD */
function download(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
}