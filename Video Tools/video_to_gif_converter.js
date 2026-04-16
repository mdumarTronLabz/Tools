import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs/promises";

ffmpeg.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe"); // Set the path to your ffmpeg executable (adjust as needed)

// Function to compress video any video format
async function videoToGifConverter(videoInputPath, videoOutputPath, videoType, startTime = null, duration = null) {

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
      const outputFileName = path.parse(file).name + ".gif"; 
      const outputFilePath = path.join(videoOutputPath, outputFileName);

      const filters = "fps=12,scale=480:-1:flags=lanczos";
      const palletePath = path.join(videoOutputPath, `${path.parse(file).name}_palette.png`);

      // Step 1: Generate palette for better quality
      await new Promise((resolve, reject) => {
        let cmd = ffmpeg(inputFilePath);

        if (startTime) cmd = cmd.setStartTime(startTime);
        if (duration) cmd = cmd.setDuration(duration);
        cmd
          .outputOptions([
            "-vf",`${filters},palettegen`
          ])
          .on("end", resolve)
          .on("error", reject)
          .save(palletePath);
      });

      // Step 2: Create GIF using the generated palette
      await new Promise((resolve, reject) => { 
        let cmd = ffmpeg(inputFilePath);

        if (startTime) cmd = cmd.seekInput(startTime);
        if (duration) cmd = cmd.setDuration(duration);

        cmd = cmd.input(palletePath); // never forget to input the palette for the second pass after seek time and duration is set
        cmd
          .complexFilter([`[0:v]${filters}[x];[x][1:v]paletteuse[out]`])
          .outputOptions([
            "-map",
            "[out]",
          ])
          .on("start", (commandLine) => {
            console.log("FFmpeg command:", commandLine);
          })
          .on("end", () => {
            console.log(`✅ GIF conversion complete:${file} `);
            resolve();
          })
          .on("error", (err) => {
            console.error(`❌ Error GIF conversion ${file}:`, err);
            reject(err);
          })
          .save(outputFilePath);
      });
    }
  } catch (err) {
    console.error("Failed to process videos:", err.message);
  }
}

export { videoToGifConverter };