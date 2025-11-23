import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

// Path for bulk compression
const imageInputPath =
  "C:\\Users\\Assassin\\Desktop\\TRON LABZ\\Tron Labz Projects\\Official Projects\\Tron Labz\\frontend\\public\\assets\\images\\projects\\flavor_flour\\"; //Change as per requirement

const imageOuptutPath =
  "C:\\Users\\Assassin\\Desktop\\TRON LABZ\\Tron Labz Projects\\Tools\\output\\"; //Change as per requirement

const imageType = ".png"; //Change as per requirement
const sideToCrop = "right"; // Change as per requirement: 'left', 'right', 'top', 'bottom'
const pixelsToCrop = 30; // Change as per requirement

// Function to crop Multiple images

async function cropMultipleImages() {
  try {
    const files = await fs.readdir(imageInputPath);

    const imageFiles = files.filter(
      //checking for type of specified type of image (png,jpg,jpeg etc) files [change as per requirement]
      (file) => path.extname(file).toLowerCase() === imageType
    );

    if (imageFiles.length === 0) {
      console.log(
        `No ${imageType
          .replace(".", "")
          .toUpperCase()} files found in the input directory.`
      );
      return;
    }

    for (const file of imageFiles) {
      const inputFilePath = path.join(imageInputPath, file);
      const metadata = await sharp(inputFilePath).metadata(); // for automatic height and width detection
      let { width, height } = metadata;

      let extractOptions = { left: 0, top: 0, width, height };

      if( sideToCrop === "left") {
        extractOptions.left = pixelsToCrop;
        extractOptions.width = width - pixelsToCrop;
      } else if (sideToCrop === "right") {
        extractOptions.width = width - pixelsToCrop;
      } else if (sideToCrop === "top") {
        extractOptions.top = pixelsToCrop;
        extractOptions.height = height - pixelsToCrop;
      } else if (sideToCrop === "bottom") {
        extractOptions.height = height - pixelsToCrop;
      } else {
        throw new Error("Invalid side. Use left, right, top, or bottom.");
      }

      const outputFileName = file;

      const outputFilePath = path.join(imageOuptutPath, outputFileName);

      try {
        await sharp(inputFilePath)
          .extract(extractOptions)
          .toFile(outputFilePath);

        console.log(`✅ Cropped: ${file} → ${outputFileName}`);
      } catch (err) {
        console.error(`❌ Error cropping ${file}:`, err.message);
      }
    }
  } catch (err) {
    console.error("Failed to process images:", err.message);
  }
}

// function call
cropMultipleImages();
