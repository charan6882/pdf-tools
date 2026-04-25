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

/* IMAGE TOOL */
const dropArea = document.getElementById("dropArea");
const input = document.getElementById("imageInput");
const preview = document.getElementById("preview");

let filesList = [];

input.addEventListener("change", (e) => {
    handleFiles(e.target.files);
});

dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.style.background = "#e6f2ff";
});

dropArea.addEventListener("dragleave", () => {
    dropArea.style.background = "white";
});

dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.style.background = "white";
    handleFiles(e.dataTransfer.files);
});

function handleFiles(files) {
    for (let file of files) {
        filesList.push(file);

        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        preview.appendChild(img);
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

        pdf.addImage(imgData, 'JPEG', 10, 10, 180, 160);
    }

    pdf.save("converted.pdf");
}

function readFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

/* MERGE TOOL */
async function mergePDF() {
    const input = document.getElementById("pdfInput");
    const files = input.files;

    if (files.length < 2) {
        alert("Upload at least 2 PDFs");
        return;
    }

    const formData = new FormData();
    for (let file of files) {
        formData.append("pdfs", file);
    }

    const response = await fetch("http://localhost:5000/merge", {
        method: "POST",
        body: formData
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.pdf";
    a.click();
}

/* COMPRESS TOOL */
async function compressPDF() {
    const file = document.getElementById("compressInput").files[0];

    if (!file) {
        alert("Upload a PDF first!");
        return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    const response = await fetch("http://localhost:5000/compress", {
        method: "POST",
        body: formData
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "compressed.pdf";
    a.click();
}