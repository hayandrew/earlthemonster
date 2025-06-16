const fs = require('fs');
const path = require('path');
const https = require('https');

// Create directories if they don't exist
const directories = [
  'public/images/book',
  'public/images/behind-scenes'
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Function to download an image with timeout and redirect handling
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (!redirectUrl) {
          reject(new Error('Redirect location not found'));
          return;
        }
        downloadImage(redirectUrl, filepath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode === 200) {
        const writeStream = fs.createWriteStream(filepath);
        response.pipe(writeStream);
        writeStream.on('finish', () => {
          writeStream.close();
          console.log(`Downloaded: ${filepath}`);
          resolve();
        });
        writeStream.on('error', (err) => {
          reject(err);
        });
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    });
    request.setTimeout(10000, () => {
      request.abort();
      reject(new Error(`Request timed out for ${url}`));
    });
    request.on('error', (err) => {
      reject(err);
    });
  });
}

// Images to download (matching exactly with about.json, using 16:9 ratio)
const images = [
  { url: 'https://picsum.photos/1600/900', path: 'public/images/book/cover.png' },
  { url: 'https://picsum.photos/1600/900', path: 'public/images/book/preview-1.png' },
  { url: 'https://picsum.photos/1600/900', path: 'public/images/book/preview-2.png' },
  { url: 'https://picsum.photos/1600/900', path: 'public/images/book/preview-3.png' },
  { url: 'https://picsum.photos/1600/900', path: 'public/images/behind-scenes/sketch-1.png' },
  { url: 'https://picsum.photos/1600/900', path: 'public/images/behind-scenes/sketch-2.png' },
  { url: 'https://picsum.photos/1600/900', path: 'public/images/behind-scenes/sketch-3.png' },
  { url: 'https://picsum.photos/1600/900', path: 'public/images/behind-scenes/sketch-4.png' }
];

// Download all images
async function downloadAllImages() {
  try {
    for (const image of images) {
      await downloadImage(image.url, image.path);
    }
    console.log('All images downloaded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error downloading images:', error);
    process.exit(1);
  }
}

downloadAllImages(); 