import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs/promises";

ffmpeg.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe"); // Set the path to your ffmpeg executable (adjust as needed)


// Function to crop video frames of any video format
async function videoToAudioExtracter(videoInputPath, videoOutputPath, videoType,formatToExtract) {

    let options = ["-vn"]; // default option to disable video stream, will be used for audio extraction

    // Define options based on the selected format to extract
    if (formatToExtract === ".mp3") {
      options.push(
        "-acodec libmp3lame",
        "-q:a 2", // high quality VBR
      );
    } else if (formatToExtract === ".wav") {
        options.push(
            "-acodec pcm_s16le", "-ar 44100", "-ac 2"
        );
    } else if (formatToExtract === ".acc") {
      options.push(
       "-acodec aac", "-b:a 192k"
      );
    }else if (formatToExtract === ".flac") {
        options.push("-acodec flac", "-compression_level 5", "-ac 2");
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
      const outputFileName = path.parse(file).name + formatToExtract; // Change the extension to the desired audio format
      const outputFilePath = path.join(videoOutputPath, outputFileName);

      await new Promise((resolve, reject) => {
        ffmpeg(inputFilePath)
            .outputOptions(options)
          .on("start", (commandLine) => {
            console.log("Spawned FFmpeg with command: " + commandLine);
          })
          .on("stderr", (stderrLine) => {
            // This will print the actual FFmpeg log so you can see the real error
            console.log("FFmpeg log: " + stderrLine);
          })
          .on("end", () => {
            console.log(`✅ Audio extraction complete:${file} `);
            resolve();
          })
          .on("error", (err) => {
            console.error(`❌ Error extracting audio from ${file}:`, err);
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
  videoToAudioExtracter
};
