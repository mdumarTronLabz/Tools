import { convertMultipleImagesToAVIF, convertMultipleImagesToWEBP, convertMultipleImagesToICO } from './Image Tools/image_converter.js'; //image converter
import { enhanceImage } from './Image Tools/image_enhancer.js'; //image enhancer
import { cropMultipleImages } from './Image Tools/image_crop.js'; //image cropper
import { resizeMultipleImagesDimensions, resizeSingleImageDimensions } from './Image Tools/image_resizer.js'; //image resizer
import { convertResizeMultipleImagesToAVIF, convertResizeMultipleImagesToWEBP } from './Image Tools/image_resizer_and_converter.js'; //image resizer and converter
import { compressMultipleJPEG } from './Image Tools/jpg_compressor.js'; //jpg compressor
import { compressMultiplePNG } from "./Image Tools/png_compressor.js"; //png compressor


// Input and Output Paths

const imageInputPath = "C:\\Users\\Assassin\\Downloads"; //Change as per requirement
// C:\\Users\\Assassin\\Desktop\\TRON LABZ\\Tron Labz Projects\\Tools\\input\\


const imageOuptutPath = "C:\\Users\\Assassin\\Desktop\\TRON LABZ\\Tron Labz Projects\\Tools\\output\\"; //Change as per requirement
// C:\\Users\\Assassin\\Desktop\\TRON LABZ\\Tron Labz Projects\\Tools\\output\\


// Function calls [Note: for extra features refer to respective files in Image Tools folder]

/* 
    Functions for bulk convertion of images
*/ 


const imageConvertFromTYpe = ".png"; //Change as per requirement
const imageConvertToType = ".webp"; //Change as per requirement options: .avif, .webp, .ico

// convertMultipleImagesToAVIF(imageInputPath, imageOuptutPath, imageConvertFromTYpe, imageConvertToType);
// convertMultipleImagesToWEBP(imageInputPath, imageOuptutPath, imageConvertFromTYpe, imageConvertToType);
// convertMultipleImagesToICO(imageInputPath, imageOuptutPath, imageConvertFromTYpe, imageConvertToType);


/* 
    Function for bulk image enhancement
*/

const imageEnhancerType = ".png"; //Change as per requirement

// enhanceImage(imageInputPath, imageOuptutPath,imageEnhancerType);


/* 
    Function for bulk image cropping
*/

const imageCroppingType = ".png"; //Change as per requirement
const sideToCrop = "right"; // Change as per requirement: 'left', 'right', 'top', 'bottom'
const pixelsToCrop = 30; // Change as per requirement

// cropMultipleImages(imageInputPath, imageOuptutPath, imageCroppingType, sideToCrop, pixelsToCrop);


/* 
    Functions for bulk & Single image resizing
*/

const imageResizingType = ".png"; //Change as per requirement
const resizingWidth = 1920; //Change as per requirement
const resizingHeight = 1080; //Change as per requirement

// resizeMultipleImagesDimensions(imageInputPath, imageOuptutPath, imageResizingType, resizingWidth, resizingHeight );


// Single image resizing path
const singleImagePath = "C:\\Users\\Assassin\\Desktop\\3d.png"; //Change as per requirement
const outputFileName = "capetown.png"; //Change as per requirement

// resizeSingleImageDimensions(singleImagePath, imageOuptutPath, outputFileName, imageResizingType, resizingWidth, resizingHeight );

  

/* 
    Functions for bulk image resizing and conversion
*/

const imageResizeNConvertFromType = ".png"; //Change as per requirement
const imageResizeNConvertToType = ".webp"; //Change as per requirement options: .avif, .webp
const conversion_resizing_width = 1920; //Change as per requirement
const conversion_resizing_height = 1080; //Change as per requirement

// convertResizeMultipleImagesToAVIF(imageInputPath, imageOuptutPath, imageResizeNConvertFromType, imageResizeNConvertToType, conversion_resizing_width, conversion_resizing_height);
// convertResizeMultipleImagesToWEBP(imageInputPath, imageOuptutPath, imageResizeNConvertFromType, imageResizeNConvertToType, conversion_resizing_width, conversion_resizing_height);


/* 
    Functions for bulk jpg/jpeg/png image compression
*/

const imageCompressionType = ".png"; //Change as per requirement options: .jpg, .png, .jpeg

// compressMultipleJPEG(imageInputPath, imageOuptutPath, imageCompressionType);
// compressMultiplePNG(imageInputPath, imageOuptutPath, imageCompressionType);