import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

// Path for bulk compression

const imageInputPath =
  "C:\\Users\\Assassin\\Desktop\\TRON LABZ\\Tron Labz Projects\\Official Projects\\Digital Business Card\\Sonu-Biz-Card\\public\\assets\\images\\"; //Change as per requirement

const imageOuptutPath =
  "C:\\Users\\Assassin\\Desktop\\TRON LABZ\\Tron Labz Projects\\Tools\\output\\"; //Change as per requirement

const imageType = ".png"; //Change as per requirement

// Function to compress Multiple png images

async function compressMultiplePNG() {
  try {
    const files = await fs.readdir(imageInputPath);

    const imageFiles = files.filter(
      //checking for type of specified type of image (png,jpg,jpeg etc) files [change as per requirement]
      (file) => path.extname(file).toLowerCase() === imageType
    );

    if (imageFiles.length === 0) {
      console.log("No PNG files found in the input directory.");
      return;
    }

    for (const file of imageFiles) {
      const inputFilePath = path.join(imageInputPath, file);

      const outputFileName = file;

      const outputFilePath = path.join(imageOuptutPath, outputFileName);

      try {
        await sharp(inputFilePath)
          .png({
            compressionLevel: 9, // 0 (fastest) to 9 (smallest)
            quality: 50, // only used for palette-based images (not typical PNG)
            adaptiveFiltering: true, // improve compression
            force: true, // ensure output is PNG
          })
          .toFile(outputFilePath);

        console.log(`✅ Compressed: ${file} → ${outputFileName}`);
      } catch (err) {
        console.error(`❌ Error compressing ${file}:`, err.message);
      }
    }
  } catch (err) {
    console.error("Failed to process images:", err.message);
  }
}

// function call
compressMultiplePNG();
