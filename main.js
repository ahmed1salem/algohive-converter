// main.js

// Function to convert PDF to images
async function convertPdfToImages(pdfFile) {
    const pdfjsLib = window['pdfjs-dist/build/pdf'];

    // Load the PDF file
    const pdf = await pdfjsLib.getDocument(pdfFile).promise;
    const images = [];

    // Loop through each page and convert to image
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render the PDF page into the canvas context
        await page.render({ canvasContext: context, viewport: viewport }).promise;

        // Convert canvas to image
        images.push(canvas.toDataURL());
    }

    return images;
}

// Event listener for file input
document.getElementById('pdf-upload').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
        const images = await convertPdfToImages(file);
        displayImages(images);
    } else {
        alert('Please upload a valid PDF file.');
    }
});

// Function to display images on the page
function displayImages(images) {
    const imageContainer = document.getElementById('image-container');
    imageContainer.innerHTML = ''; // Clear previous images

    images.forEach((imgSrc) => {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = 'Converted PDF page';
        imageContainer.appendChild(img);
    });
}
