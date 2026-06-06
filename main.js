import {
  convertMultipleImagesToAVIF,
  convertMultipleImagesToWEBP,
  convertMultipleImagesToICO,
} from "./Image Tools/image_converter.js"; //image converter
import { enhanceImage } from "./Image Tools/image_enhancer.js"; //image enhancer
import { cropMultipleImages } from "./Image Tools/image_crop.js"; //image cropper
import {
  resizeMultipleImagesDimensions,
  resizeSingleImageDimensions,
} from "./Image Tools/image_resizer.js"; //image resizer
import {
  convertResizeMultipleImagesToAVIF,
  convertResizeMultipleImagesToWEBP,
} from "./Image Tools/image_resizer_and_converter.js"; //image resizer and converter
import { compressMultipleJPEG } from "./Image Tools/jpg_compressor.js"; //jpg compressor
import { compressMultiplePNG } from "./Image Tools/png_compressor.js"; //png compressor

import { compressVideo } from "./Video Tools/video_compressor.js"; //video compressor [any video format]
import { videoFrameCrop } from "./Video Tools/video_frame_cropper.js"; //video frame cropper [any video format]
import { videoToAudioExtracter } from "./Video Tools/video_to_audio_extracter.js"; //video to audio extractor [any video format]
import { videoToGifConverter } from "./Video Tools/video_to_gif_converter.js"; //video to gif converter [any video format]
import { videoToThumbnail } from "./Video Tools/video_to_thumbnail_generator.js"; //video to thumbnail generator [any video format]
import { covertToWebmFormat } from "./Video Tools/convert_video_to_webm_video_format.js"; //video format converter (any video format to webm format)


// Input and Output Paths

const fileInputPath = "C:\\Users\\Assassin\\Downloads\\"; //Change as per requirement
// C:\\Users\\Assassin\\Desktop\\TRON LABZ\\Tron Labz Projects\\Tools\\input\\

const fileOuptutPath =
  "C:\\Users\\Assassin\\Desktop\\TRON LABZ\\Tron Labz Projects\\Tools\\output\\"; //Change as per requirement
// C:\\Users\\Assassin\\Desktop\\TRON LABZ\\Tron Labz Projects\\Tools\\output\\


// Function calls [Note: for extra features refer to respective files in Image Tools folder]

/* 
        Functions for bulk convertion of images
    */

const imageConvertFromType = ".png"; //Change as per requirement
const imageConvertToType = ".ico"; //Change as per requirement options: .avif, .webp, .ico

// convertMultipleImagesToAVIF(fileInputPath, fileOuptutPath, imageConvertFromType, imageConvertToType);
// convertMultipleImagesToWEBP(fileInputPath, fileOuptutPath, imageConvertFromType, imageConvertToType);
// convertMultipleImagesToICO(fileInputPath, fileOuptutPath, imageConvertFromType, imageConvertToType);

/* 
        Function for bulk image enhancement
    */

const imageEnhancerType = ".png"; //Change as per requirement

// enhanceImage(fileInputPath, fileOuptutPath,imageEnhancerType);

/* 
        Function for bulk image cropping
    */

const imageCroppingType = ".png"; //Change as per requirement
const sideToCrop = "right"; // Change as per requirement: 'left', 'right', 'top', 'bottom'
const pixelsToCrop = 30; // Change as per requirement

// cropMultipleImages(fileInputPath, fileOuptutPath, imageCroppingType, sideToCrop, pixelsToCrop);

/* 
        Functions for bulk & Single image resizing
    */

const imageResizingType = ".png"; //Change as per requirement
const resizingWidth = 1920; //Change as per requirement
const resizingHeight = 1080; //Change as per requirement

// resizeMultipleImagesDimensions(fileInputPath, fileOuptutPath, imageResizingType, resizingWidth, resizingHeight );

// Single image resizing path
const singleImagePath = "C:\\Users\\Assassin\\Desktop\\3d.png"; //Change as per requirement
const outputFileName = "capetown.png"; //Change as per requirement

// resizeSingleImageDimensions(singleImagePath, fileOuptutPath, outputFileName, imageResizingType, resizingWidth, resizingHeight );

/* 
        Functions for bulk image resizing and conversion
    */

const imageResizeNConvertFromType = ".png"; //Change as per requirement
const imageResizeNConvertToType = ".webp"; //Change as per requirement options: .avif, .webp
const conversion_resizing_width = 1920; //Change as per requirement
const conversion_resizing_height = 1080; //Change as per requirement

// convertResizeMultipleImagesToAVIF(fileInputPath, fileOuptutPath, imageResizeNConvertFromType, imageResizeNConvertToType, conversion_resizing_width, conversion_resizing_height);
// convertResizeMultipleImagesToWEBP(fileInputPath, fileOuptutPath, imageResizeNConvertFromType, imageResizeNConvertToType, conversion_resizing_width, conversion_resizing_height);

/* 
___________________________________________________________________________________________________________________________________________________________________________________
___________________________________________________________________________________________________________________________________________________________________________________
*/

/* 
        Functions for bulk jpg/jpeg/png image compression
    */

const inputVideoFormatType = ".mp4"; //Change as per requirement


// compressVideo(fileInputPath, fileOuptutPath, inputVideoFormatType);

/* 
  Function for video frame cropping
*/

const videoCompressionMode = "NO_LOSS_CROP"; //Change as per requirement options: [COMPRESSED_SQUARE, PADDING, NO_LOSS_CROP]

// change these parameters as per requirement for video frame cropping inside the file video_frame_cropper.js and then call the function as below
// videoFrameCrop(fileInputPath, fileOuptutPath, inputVideoFormatType, videoCompressionMode);


/* 
  Function for video to audio extraction
*/

const formatToExtract = ".flac"; //Change as per requirement options: .mp3, .aac, .wav, .flac

// videoToAudioExtracter(fileInputPath, fileOuptutPath, inputVideoFormatType, formatToExtract);

/* 
  Function for video to gif conversion
*/

const startTime = "00:00:05"; // Change as per requirement (format: HH:MM:SS)
const duration = "00:00:15"; // Change as per requirement (format: HH:MM:SS)

// videoToGifConverter(fileInputPath, fileOuptutPath, inputVideoFormatType, startTime, duration);


/* 
  Function for video to thumbnail generation
*/

const thumbnailMode = "ALL"; //Change as per requirement options: 'SINGLE', 'RANGE', 'ALL'
const thumbnailConfig = {
  // time: "00:00:05", // For SINGLE mode (format: HH:MM:SS)
  // startTime: "00:00:02", // For RANGE mode (format: HH:MM:SS)
  // duration: "00:00:08", // For RANGE mode (format: HH:MM:SS)
  fps: 10, // For RANGE mode (frames per second to extract)
  size: "1080x?", // For every mode (size of output thumbnails, maintain aspect ratio with '?')
};

// videoToThumbnail(fileInputPath, fileOuptutPath, inputVideoFormatType, thumbnailMode, thumbnailConfig);


/* 
  Function for video format conversion (any video format) to Webm format
*/

covertToWebmFormat(fileInputPath, fileOuptutPath, inputVideoFormatType);