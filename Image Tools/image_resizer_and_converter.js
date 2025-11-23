import sharp from "sharp";
import fs from "fs/promises";
import path from "path";



// Function to convert images to AVIF format
async function convertResizeMultipleImagesToAVIF(imageInputPath, imageOuptutPath, imageType, imageCoversionType, width, height) {
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
          .avif({ quality: 80 }) // adjust quality as needed
          .resize(width, height, { fit: "cover", position: "center" })
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
async function convertResizeMultipleImagesToWEBP(imageInputPath, imageOuptutPath, imageType, imageCoversionType, width, height) {
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
          .webp({ quality: 90 }) // adjust quality as needed
          .resize(width, height, { fit: "cover", position: "center" })
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


export {
  convertResizeMultipleImagesToAVIF,
  convertResizeMultipleImagesToWEBP,
};
