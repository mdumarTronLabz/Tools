import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs/promises";

ffmpeg.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe"); // Set the path to your ffmpeg executable (adjust as needed)


// Function to crop video frames of any video format
async function videoFrameCrop(videoInputPath, videoOutputPath, videoType,videoCompressionMode) {

    let options = [];

    // Define options based on the selected mode
    if (videoCompressionMode === "NO_LOSS_CROP") {
      options = [
        "-vf",
        "crop=min(iw\\,ih):min(iw\\,ih)",
        "-c:v libx264",
        "-crf 17",
        "-preset superfast",
        "-c:a copy",
      ];
    } else if (videoCompressionMode === "PADDING") {
      options = [
        "-vf",
        "scale=720:720:force_original_aspect_ratio=decrease,pad=720:720:(ow-iw)/2:(oh-ih)/2", //change 720:720 as per requirement
        "-c:v libx264",
        "-crf 23",
        "-c:a aac",
      ];
    } else if (videoCompressionMode === "COMPRESSED_SQUARE") {
      options = [
        "-vf",
        "scale=720:720:force_original_aspect_ratio=increase,crop=720:720", //change 720:720 as per requirement
        "-c:v libx264",
        "-crf 28",
        "-preset slow",
        "-c:a aac",
        "-b:a 64k",
      ];
    }
  try {
    const files = await fs.readdir(videoInputPath);

    const videoFiles = files.filter(
      // checking for type of specified type of video (mp4, mkv, avi etc) files [change as per requirement]
      (file) => path.extname(file).toLowerCase() === videoType
    );
    
    if (videoFiles.length === 0) {
      console.log("No video files found in the input directory.");
      return;
    }
    
    // loop through video files and compress them
    for (const file of videoFiles) {
      const inputFilePath = path.join(videoInputPath, file);
      const outputFileName = `cropped_${file}`;
      const outputFilePath = path.join(videoOutputPath, outputFileName);

      await new Promise((resolve, reject) => {
        ffmpeg(inputFilePath)
            .outputOptions(options)
            .outputOption(['-pix_fmt yuv420p']) // Ensure compatibility with most players
          .on("start", (commandLine) => {
            console.log("Spawned FFmpeg with command: " + commandLine);
          })
          .on("stderr", (stderrLine) => {
            // This will print the actual FFmpeg log so you can see the real error
            console.log("FFmpeg log: " + stderrLine);
          })
          .on("end", () => {
            console.log(`✅ Compression finished:${file} `);
            resolve();
          })
          .on("error", (err) => {
            console.error(`❌ Error compressing ${file}:`, err);
            reject(err);
          })
          .save(outputFilePath);
      });
    }
  }
  catch (err) { 
    console.error("Failed to process videos:", err.message);
  }


};

export {
  videoFrameCrop
};
