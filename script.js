const BACKEND_URL = "https://pdf-tools-backend-1bd0.onrender.com";

/* UI */
function hideAll() {
document.querySelectorAll(".tool-box").forEach(el => el.classList.add("hidden"));
}

function showImageTool() {
hideAll();
document.getElementById("imageSection").classList.remove("hidden");
}

function showMergeTool() {
hideAll();
document.getElementById("mergeSection").classList.remove("hidden");
}

function showCompressTool() {
hideAll();
document.getElementById("compressSection").classList.remove("hidden");
}

/* LOADER */
function showLoader() {
document.getElementById("loader").classList.remove("hidden");
}

function hideLoader() {
document.getElementById("loader").classList.add("hidden");
}

/* MERGE */
async function mergePDF() {
const files = document.getElementById("pdfInput").files;

if (files.length < 2) {
alert("Upload at least 2 PDFs");
return;
}

const formData = new FormData();
for (let file of files) formData.append("pdfs", file);

showLoader();

const res = await fetch(`${BACKEND_URL}/merge`, {
method: "POST",
body: formData
});

const blob = await res.blob();
download(blob, "merged.pdf");

hideLoader();
}

/* COMPRESS */
async function compressPDF() {
const file = document.getElementById("compressInput").files[0];

if (!file) {
alert("Upload file");
return;
}

const formData = new FormData();
formData.append("pdf", file);

showLoader();

const res = await fetch(`${BACKEND_URL}/compress`, {
method: "POST",
body: formData
});

const blob = await res.blob();
download(blob, "compressed.pdf");

hideLoader();
}

/* DOWNLOAD */
function download(blob, name) {
const url = window.URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = name;
a.click();
}