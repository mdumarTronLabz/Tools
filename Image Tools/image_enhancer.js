import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

// Path for bulk enhancement of images
const imageInputPath = "C:\\Users\\Assassin\\Downloads"; //Change as per requirement

const imageOuptutPath =
  "C:\\Users\\Assassin\\Desktop\\TRON LABZ\\Tron Labz Projects\\Tools\\output\\"; //Change as per requirement

const imageType = ".png"; //Change as per requirement

/* 
    
    Here are presets to plug in directly:

    ✔ High-Quality Enhancement
    .sharpen(1)
    .modulate({ brightness: 1.05, contrast: 1.1, saturation: 1.1 })

    ✔ HDR-like Effect
    .modulate({ brightness: 1.1, contrast: 1.25, saturation: 1.2 })
    .sharpen(1.2)
    .linear(1.2, -20)

    ✔ Fix Blurry Images
    .sharpen(1.4)
    .modulate({ contrast: 1.2 })

    ✔ Remove Noise
    .median(2)
    .sharpen(0.8)

*/

// Function to enhance images
async function enhanceImage() {
  try {
    const files = await fs.readdir(imageInputPath);

    const imageFiles = files.filter(
      //checking for type of specified type of image (png,jpg,jpeg etc) files [change as per requirement]
      (file) => path.extname(file).toLowerCase() === imageType
    );

    if (imageFiles.length === 0) {
      console.log(`No ${imageType.toUpperCase()} files found in the input directory.`);
      return;
    }

    for (const file of imageFiles) {
      const inputFilePath = path.join(imageInputPath, file);

      const outputFileName = file;

      const outputFilePath = path.join(imageOuptutPath, outputFileName);

      try {
        await sharp(inputFilePath)
          //   .rotate()  // Auto-orient image (fix rotated photos)
          .modulate({
            // Improve brightness & contrast
            brightness: 1.1, // 1 = normal
            contrast: 1.15, // increase contrast
            saturation: 1.1, // richer colors
          })
          .sharpen({
            // Sharpen the image
            sigma: 1.0, // blur removal strength
            m1: 1.2, // sharpening level
            m2: 0.2, // edge threshold
            x1: 2.0,
            y2: 10.0,
            y3: 20.0,
          })
          .median(1) // Reduce slight noise
          .linear(1.1, -10) // Increase local contrast ("clarity")
          .toFile(outputFilePath);

        console.log(`✅ Enhanced: ${file} → ${outputFileName}`);
      } catch (err) {
        console.error(`❌ Error enhancing ${file}:`, err.message);
      }
    }
  } catch (err) {
    console.error("Failed to process images:", err.message);
  }

};

// function call
enhanceImage();
