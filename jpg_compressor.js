import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

// Path for bulk compression
const imageInputPath =
  "C:\\Users\\Assassin\\Desktop\\TRON LABZ\\Tron Labz Projects\\Client Projects\\The Fitness Club\\public\\assets\\image\\"; //Change as per requirement

const imageOuptutPath =
  "C:\\Users\\Assassin\\Desktop\\TRON LABZ\\Tron Labz Projects\\Tools\\output\\"; //Change as per requirement

const imageType = ".jpg"; //Change as per requirement

// Function to compress Multiple jpg/jpeg images

async function compressMultipleJPEG() {
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
      
      const outputFileName = file

      const outputFilePath = path.join(imageOuptutPath, outputFileName);

      try {
        await sharp(inputFilePath)
          .jpeg({
            quality: 70, // Adjust quality (0–100)
            chromaSubsampling: "4:4:4", // Better quality color (optional)
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
};

// function call
compressMultipleJPEG();