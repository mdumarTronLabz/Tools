import sharp from "sharp";
import ico from "sharp-ico";
import fs from "fs/promises";
import path from "path";


// Path for bulk convertion of images

const imageInputPath =
  "C:\\Users\\Assassin\\Downloads"; //Change as per requirement

const imageOuptutPath = "C:\\Users\\Assassin\\Downloads"; //Change as per requirement

const imageType = ".png"; //Change as per requirement
// const imageCoversionType = ".avif"; //Change as per requirement
const imageCoversionType = ".ico"; //Change as per requirement

// Function to convert images to AVIF format
async function convertMultipleImagesToAVIF() {

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

      // Create a case-insensitive regular expression like /\.png$/i
      const regex = new RegExp(`\\${imageType}$`, "i");

      // replace the extension with .avif
      const outputFileName = file.replace(regex, imageCoversionType);

      const outputFilePath = path.join(imageOuptutPath, outputFileName);

      try {
        await sharp(inputFilePath)
          .avif({ quality: 70 }) // adjust quality as needed
          .toFile(outputFilePath);

        console.log(`✅ Converted: ${file} → ${outputFileName}`);
      } catch (err) {
        console.error(`❌ Error converting ${file}:`, err.message);
      }
    }
  } catch (err) {
    console.error("Failed to process images:", err.message);
  }
}

// Function to convert images to WEBP format
async function convertMultipleImagesToWEBP() {

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

      // Create a case-insensitive regular expression like /\.png$/i
      const regex = new RegExp(`\\${imageType}$`, "i");

      // replace the extension with .avif
      const outputFileName = file.replace(regex, imageCoversionType);

      const outputFilePath = path.join(imageOuptutPath, outputFileName);

      try {
        await sharp(inputFilePath)
          .webp({ quality: 70 }) // adjust quality as needed
          .toFile(outputFilePath);

        console.log(`✅ Converted: ${file} → ${outputFileName}`);
      } catch (err) {
        console.error(`❌ Error converting ${file}:`, err.message);
      }
    }
  } catch (err) {
    console.error("Failed to process images:", err.message);
  }
}

// Function to convert images to ICO format
async function convertMultipleImagesToICO() { 
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

      // Create a case-insensitive regular expression like /\.png$/i
      const regex = new RegExp(`\\${imageType}$`, "i");

      // replace the extension with .ico
      const outputFileName = file.replace(regex, imageCoversionType);

      const outputFilePath = path.join(imageOuptutPath, outputFileName);

      try {
        // Create PNG buffers for multiple ICO sizes as needed
        const sizes = [64];

        const pngBuffers = await Promise.all(
          sizes.map((size) =>
            sharp(inputFilePath).resize(size, size).png().toBuffer()
          )
        );

        // Combine into .ico
        const img = await ico.encode(pngBuffers);

        // Write ICO
        await fs.writeFile(outputFilePath, img);

        console.log(`✅ Converted: ${file} → ${outputFileName}`);
      } catch (err) {
        console.error(`❌ Error converting ${file}:`, err.message);
      }
    }
  } catch (err) {
    console.error("Failed to process images:", err.message);
  }
  
}

/* 
    Run the conversion 
*/

// converts images to different format

// convertMultipleImagesToAVIF();
// convertMultipleImagesToWEBP();
convertMultipleImagesToICO();

