import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

/* 
    Mode	Description
    ====    ===========
    cover 	Fill and crop if needed (like object-cover)
    contain	Fit within width/height, preserve aspect
    fill	Ignore aspect ratio, stretch to fit
    inside	Resize to fit within bounds, no crop
    outside	Ensure dimensions are at least the given size
*/

// Path for bulk resize
const imageInputPath =
  "C:\\Users\\Assassin\\Desktop\\TRON LABZ\\Tron Labz Projects\\Official Projects\\Tron Labz\\frontend\\public\\assets\\images\\projects\\flavor_flour\\"; //Change as per requirement

const imageOuptutPath = "C:\\Users\\Assassin\\Desktop\\TRON LABZ\\Tron Labz Projects\\Tools\\output\\"; //Change as per requirement

// Single image resize path
const imagePath = "C:\\Users\\Assassin\\Desktop\\capetown.png"; //Change as per requirement
const outputFileName = "capetown.png"; //Change as per requirement
  


const imageType = ".png"; //Change as per requirement
const width = 1920; //Change as per requirement
const height = 1080; //Change as per requirement


// Function to resize images dimensions (width x height)

async function resizeMultipleImagesDimensions() {
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
            .resize(width,height, {fit:'cover', position:'center'}) // adjust view as needed
            .toFile(outputFilePath);
            
        // to add background color while resizing uncomment below code and comment above code
        
        /* await sharp(inputFilePath)
          .resize(width, height, {
            fit: "contain", // preserve aspect ratio, no crop
            background: { r: 255, g: 255, b: 255, alpha: 1 }, //change background color as needed
          }) 
          .toFile(outputFilePath); */

        console.log(`✅ Resized: ${file} → ${outputFileName}`);
      } catch (err) {
        console.error(`❌ Error resizing ${file}:`, err.message);
      }
    }
  } catch (err) {
    console.error("Failed to process images:", err.message);
  }
}


// Function to resize single image dimensions (width x height)

async function resizeSingleImagesDimensions() {
  try {
    
      
    if (!imagePath.toLowerCase().endsWith(imageType)) {
      console.log("No such image file found.");
      return;
    }

    
    const outputFilePath = path.join(imageOuptutPath, outputFileName);

    try {
      await sharp(imagePath)
        .resize(width, height, { fit: "cover", position: "center" }) // adjust view as needed
        .toFile(outputFilePath);

      // to add background color while resizing uncomment below code and comment above code

      /* await sharp(imagePath)
          .resize(width, height, {
            fit: "contain", // preserve aspect ratio, no crop
            background: { r: 255, g: 255, b: 255, alpha: 1 }, //change background color as needed
          }) 
          .toFile(outputFilePath); */

      console.log(`✅ Resized → ${outputFileName}`);
    } catch (err) {
    console.error(`❌ Error resizing :`, err.message);
    }

  } catch (err) {
    console.error("Failed to process images:", err.message);
  }
}



// Run the reizer function


/* 
    bulk image reziser
 */

resizeMultipleImagesDimensions();


/* 
    single image resizer 
*/

// resizeSingleImagesDimensions();
