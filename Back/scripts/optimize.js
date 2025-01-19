const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputFolder = '../Front/public/assets/images'; 
const outputFolder = './optimized'; 

const sizes = [480, 768, 1920];

const optimizeImage = async (file) => {
  const ext = path.extname(file).toLowerCase();
  const baseName = path.basename(file, ext);

  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    console.log(`Format non supporté : ${file}`);
    return;
  }

  for (const size of sizes) {
    const outputFileName = `${outputFolder}/${baseName}-${size}w.webp`;
    await sharp(`${inputFolder}/${file}`)
      .resize(size) 
      .toFormat('webp', { quality: 80 }) 
      .toFile(outputFileName); 
    console.log(`Image optimisée : ${outputFileName}`);
  }
};

fs.readdir(inputFolder, (err, files) => {
  if (err) {
    console.error('Erreur de lecture du dossier', err);
    return;
  }

  files.forEach((file) => optimizeImage(file));
});
