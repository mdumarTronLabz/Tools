import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs/promises";

ffmpeg.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe"); // Set the path to your ffmpeg executable (adjust as needed)

/**
 * @param {string} videoInputPath - Path to the specific video file
 * @param {string} imageOutputPath - Directory to save images
 * @param {string} mode - 'SINGLE', 'RANGE', or 'ALL'
 * @param {object} config - { time, startTime, duration, fps, size }
 */

// Function to compress video any video format
async function videoToThumbnail(videoInputPath, imageOutputPath, videoType, mode, config = {}) {
  
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
      const baseFileName = path.parse(file).name;
      const outputFileName = mode === "SINGLE" ? `${baseFileName}_thumbnail.png` : (mode === "RANGE" ? `${baseFileName}_thumbnail_%03d.png` : `${baseFileName}_frame_%04d.png`);
      const outputFilePath = path.join(imageOutputPath, outputFileName);

      
      const scaleFilter = (config.size || "480x?")
        .replace("x", ":")
        .replace("?", "-1");
      const fps = config.fps || 1; // 1 frame per second by default for ranges

      await new Promise((resolve, reject) => {
        let cmd = ffmpeg(inputFilePath);

        if (mode === "SINGLE") {
          // SCENARIO 1: Single frame at a specific time
          cmd
            .outputOptions(["-vf", `scale=${scaleFilter}`])
            .seekInput(config.time || "00:00:01")
            .frames(1);
        } else if (mode === "RANGE") {
          // SCENARIO 2: Frames from Start Time to End Time (Duration)
          if (config.startTime) cmd.seekInput(config.startTime);
          if (config.duration) cmd.duration(config.duration);

          cmd.outputOptions([
            "-vf",
            `fps=${fps},scale=${scaleFilter}`,
          ]);
        } else if (mode === "ALL") {
          // SCENARIO 3: Every single frame (Warning: This creates MANY files)
          // To get native video frames, remove the 'fps' filter
          cmd.outputOptions(["-vf", `scale=${scaleFilter}`]);
        }

        cmd
          .on("start", (commandLine) => {
            console.log("Spawned FFmpeg with command: " + commandLine);
          })
          .on("stderr", (stderrLine) => {
            // This will print the actual FFmpeg log so you can see the real error
            console.log("FFmpeg log: " + stderrLine);
          })
          .on("end", () => {
            console.log(
              `✅ Frame generation completed for ${mode}->mode: ${file} `,
            );
            resolve();
          })
          .on("error", (err) => {
            console.error(`❌ Error generating ${file}:`, err);
            reject(err);
          })
          .save(outputFilePath);
        console.log(outputFilePath);
      });
    }
  } catch (err) {
    console.error("Failed to process videos:", err.message);
  }
}

export { videoToThumbnail };