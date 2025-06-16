const fs = require('fs');
const path = require('path');
const https = require('https');

const PLACEHOLDER_IMAGES = {
  book: [
    {
      url: 'https://placehold.co/800x400/2563eb/ffffff?text=Book+Cover',
      filename: 'cover.png'
    },
    {
      url: 'https://placehold.co/800x400/2563eb/ffffff?text=Page+1',
      filename: 'page1.png'
    },
    {
      url: 'https://placehold.co/800x400/2563eb/ffffff?text=Page+2',
      filename: 'page2.png'
    }
  ],
  'behind-scenes': [
    {
      url: 'https://placehold.co/800x400/2563eb/ffffff?text=Initial+Sketch',
      filename: 'sketch1.png'
    },
    {
      url: 'https://placehold.co/800x400/2563eb/ffffff?text=Creative+Process',
      filename: 'process1.png'
    },
    {
      url: 'https://placehold.co/800x400/2563eb/ffffff?text=Final+Artwork',
      filename: 'final1.png'
    }
  ]
};

// Create directories if they don't exist
const createDirectories = () => {
  const dirs = [
    path.join(process.cwd(), 'public', 'images', 'book'),
    path.join(process.cwd(), 'public', 'images', 'behind-scenes')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Download an image
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const file = fs.createWriteStream(filepath);
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });

      file.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

// Main function
const main = async () => {
  try {
    createDirectories();

    for (const [category, images] of Object.entries(PLACEHOLDER_IMAGES)) {
      for (const image of images) {
        const filepath = path.join(process.cwd(), 'public', 'images', category, image.filename);
        console.log(`Downloading ${image.url} to ${filepath}`);
        await downloadImage(image.url, filepath);
      }
    }

    console.log('Placeholder images downloaded successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

main(); 