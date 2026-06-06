import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs/promises";

ffmpeg.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe"); // Set the path to your ffmpeg executable (adjust as needed)

// Function to convert any video format to webm format
async function covertToWebmFormat(videoInputPath, videoOutputPath, videoType) {
  try {
    const files = await fs.readdir(videoInputPath);

    const videoFiles = files.filter(
      // checking for type of specified type of video (mp4, mkv, avi etc) files [change as per requirement]
      (file) => path.extname(file).toLowerCase() === videoType,
    );

    if (videoFiles.length === 0) {
      console.log("No video files found in the input directory.");
      return;
    }

    // loop through video files and compress them
    for (const file of videoFiles) {
      const inputFilePath = path.join(videoInputPath, file);
      const outputFileName = path.parse(file).name + ".webm";
      const outputFilePath = path.join(videoOutputPath, outputFileName);
      
      await new Promise((resolve, reject) => {
        ffmpeg(inputFilePath)
          .videoCodec("libvpx-vp9")
          .audioCodec("libopus")
          .outputOptions(["-crf 30", "-b:v 0"]) //lower the -crf value for better quality (and larger file size), higher for more compression (and lower quality)
          .on("start", (commandLine) => {
            console.log("Spawned FFmpeg with command: " + commandLine);
          })
          .on("stderr", (stderrLine) => {
            // This will print the actual FFmpeg log so you can see the real error
            console.log("FFmpeg log: " + stderrLine);
          })
          .on("end", () => {
            console.log(`✅ Conversion finished:${file} `);
            resolve();
          })
          .on("error", (err) => {
            console.error(`❌ Error converting ${file}:`, err);
            reject(err);
          })
          .save(outputFilePath);
      });
    }
  } catch (err) {
    console.error("Failed to process videos:", err.message);
  }
}

export { covertToWebmFormat };
