import sharp from "sharp";
import fs from "fs/promises";
import path from "path";


// Function to compress Multiple jpg/jpeg images

async function compressMultipleJPEG(imageInputPath, imageOuptutPath, imageType) {
  try {
    const files = await fs.readdir(imageInputPath);

    const imageFiles = files.filter(
      //checking for type of specified type of image (jpg/jpeg) files [change as per requirement]
      (file) => path.extname(file).toLowerCase() === imageType
    );

    if (imageFiles.length === 0) {
      console.log(`No ${imageType.toUpperCase()} files found in the input directory.`);
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


export { compressMultipleJPEG };