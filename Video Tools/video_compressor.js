import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs/promises";

ffmpeg.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe"); // Set the path to your ffmpeg executable (adjust as needed)


// Function to compress video any video format
async function compressVideo(videoInputPath, videoOutputPath, videoType) {

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
      const outputFileName = `compressed_${file}`;
      const outputFilePath = path.join(videoOutputPath, outputFileName);

      await new Promise((resolve, reject) => {
        ffmpeg(inputFilePath)
          .outputOptions([
            "-vf scale=-2:1080", // change resolution (width is auto-calculated to maintain aspect ratio)
            "-r 24", // frame rate
            "-c:v libx264", // codec
            "-crf 28", // quality (lower = better)
            "-pix_fmt yuv420p",
            "-preset slow", // speed vs compression option:(slow or fast)
            "-c:a aac",
            "-b:a 64k", // audio bitrate
          ])
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
  compressVideo
};
