import { spawn } from "child_process";

let ffmpegProcess = null;

export const startFFmpegStream = (streamKey) => {
  if (ffmpegProcess) {
    console.log("FFmpeg is already running");
    return;
  }

  const rtmpUrl = `rtmp://a.rtmp.youtube.com/live2/${streamKey}`;
  console.log(`Streaming to: ${rtmpUrl}`);

  const options = [
    "-i",
    "-",
    "-c:v",
    "libx264",
    "-preset",
    "ultrafast",
    "-tune",
    "zerolatency",
    "-r",
    `${25}`,
    "-g",
    `${25 * 2}`,
    "-keyint_min",
    25,
    "-crf",
    "25",
    "-pix_fmt",
    "yuv420p",
    "-sc_threshold",
    "0",
    "-profile:v",
    "main",
    "-level",
    "3.1",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-ar",
    128000 / 4,
    "-f",
    "flv",
    rtmpUrl,
  ];

  ffmpegProcess = spawn("ffmpeg", options);

  ffmpegProcess.stderr?.on("data", (data) => {
    console.error(`FFmpeg: ${data}`);
  });

  ffmpegProcess.on("close", (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
    ffmpegProcess = null;
  });
};

export const writeStreamData = (chunk) => {
  if (ffmpegProcess?.stdin?.writable) {
    try {
      ffmpegProcess.stdin.write(chunk);
    } catch (err) {
      console.error("Error writing to FFmpeg:", err);
    }
  } else {
    console.error("FFmpeg stdin is not writable");
  }
};

export const stopFFmpegStream = () => {
  if (ffmpegProcess) {
    ffmpegProcess.kill();
    ffmpegProcess = null;
    console.log("FFmpeg process stopped");
  }
};
