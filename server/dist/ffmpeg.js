import { spawn } from "child_process";

let ffmpegProcess = null;
let isFFmpegReady = false;

export const startFFmpegStream = (streamKey) => {
  return new Promise((resolve, reject) => {
    if (ffmpegProcess) {
      console.log("FFmpeg is already running");
      return resolve(); // Prevent multiple starts
    }

    const rtmpUrl = `rtmp://a.rtmp.youtube.com/live2/${streamKey}`;
    console.log(`Starting stream to: ${rtmpUrl}`);

    const options = [
      '-i',
      '-',
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-tune', 'zerolatency',
      '-r', `${25}`,
      '-g', `${25 * 2}`,
      '-keyint_min', 25,
      '-crf', '25',
      '-pix_fmt', 'yuv420p',
      '-sc_threshold', '0',
      '-profile:v', 'main',
      '-level', '3.1',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-ar', 128000 / 4,
      '-f', 'flv',
      rtmpUrl,
    ];

    ffmpegProcess = spawn("ffmpeg", options);

    ffmpegProcess.stderr?.on("data", (data) => {
      console.error(`FFmpeg: ${data.toString()}`);
    });

    setTimeout(() => {
      console.log("FFmpeg process started");
      isFFmpegReady = true;
      resolve(); // Resolve when FFmpeg starts
    }, 5000);

    ffmpegProcess.on("error", (err) => {
      console.error("FFmpeg failed to start:", err);
      isFFmpegReady = false;
      reject(err);
    });

    ffmpegProcess.on("close", (code) => {
      console.log(`FFmpeg process exited with code ${code}`);
      ffmpegProcess = null;
      isFFmpegReady = false;
    });
  });
};

export const writeStreamData = (chunk) => {
  if (isFFmpegReady && ffmpegProcess?.stdin?.writable) {
    try {
      console.log("writing");

      ffmpegProcess.stdin.write(chunk);
      console.log(chunk);
    } catch (err) {
      console.error("Error writing to FFmpeg:", err);
    }
  } else {
    console.error("FFmpeg is not ready yet, dropping stream data...");
  }
};

export const stopFFmpegStream = () => {
  if (ffmpegProcess) {
    ffmpegProcess.kill();
    ffmpegProcess = null;
    isFFmpegReady = false;
    console.log("FFmpeg process stopped");
  }
};
