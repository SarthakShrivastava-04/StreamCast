// import { spawn, ChildProcess } from "child_process";

// let ffmpegProcess: ChildProcess | null = null;

// export const startFFmpegStream = (streamKey: string) => {
//   if (ffmpegProcess) {
//     console.log("FFmpeg is already running");
//     return;
//   }

//   const rtmpUrl = `rtmp://a.rtmp.youtube.com/live2/${streamKey}`;
//   console.log(`Streaming to: ${rtmpUrl}`);

//   const options = [
//     '-i', '-',
//     '-c:v', 'libx264',
//     '-preset', 'ultrafast',
//     '-tune', 'zerolatency',
//     '-r', `${25}`,
//     '-g', `${25 * 2}`,
//     '-keyint_min', `${25}`,
//     '-crf', '25',
//     '-pix_fmt', 'yuv420p',
//     '-sc_threshold', '0',
//     '-profile:v', 'main',
//     '-level', '3.1',
//     '-c:a', 'aac',
//     '-b:a', '128k',
//     '-ar', '32000',
//     '-f', 'flv',
//     rtmpUrl,
//   ];

//   ffmpegProcess = spawn("ffmpeg", options);

//   ffmpegProcess.stderr?.on("data", (data) => {
//     console.error(`FFmpeg: ${data}`);
//   });

//   ffmpegProcess.on("close", (code) => {
//     console.log(`FFmpeg process exited with code ${code}`);
//     if (ffmpegProcess?.stdin) {
//       ffmpegProcess.stdin.end(); // Close stdin to prevent errors
//     }
//     ffmpegProcess = null;
//   });

//   ffmpegProcess.on("error", (err) => {
//     console.error("FFmpeg process error:", err);
//     stopFFmpegStream();
//   });
// };

// export const writeStreamData = (chunk: any) => {
//   if (ffmpegProcess && ffmpegProcess.stdin?.writable) {
//     ffmpegProcess.stdin.write(chunk, (err) => {
//       if (err) console.error("Error writing to FFmpeg:", err);
//     });
//   } else {
//     console.error("FFmpeg stdin is not writable");
//   }
// };

// export const stopFFmpegStream = () => {
//   if (ffmpegProcess) {
//     ffmpegProcess.kill();
//     ffmpegProcess.stdin?.end(); // Ensure stdin is closed
//     ffmpegProcess = null;
//     console.log("FFmpeg process stopped");
//   }
// };



import { spawn, ChildProcess } from "child_process";

let ffmpegProcess: ChildProcess | null = null;

export const startFFmpegStream = (streamKey: string) => {
  if (ffmpegProcess) {
    console.log("FFmpeg is already running");
    return;
  }

  const rtmpUrl = `rtmp://a.rtmp.youtube.com/live2/${streamKey}`;
  console.log(`Streaming to: ${rtmpUrl}`);

  const options = [
    '-f', 'mpegts',  // Ensure FFmpeg knows input type
    '-i', '-',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-r', '30',
    '-g', '60',
    '-keyint_min', '30',
    '-crf', '25',
    '-pix_fmt', 'yuv420p',
    '-sc_threshold', '0',
    '-profile:v', 'main',
    '-level', '3.1',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', '32000',
    '-use_wallclock_as_timestamps', '1',  // Ensures proper timestamping
    '-f', 'flv',
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

export const writeStreamData = (chunk: any) => {
  if (ffmpegProcess) {
    const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    try {
      ffmpegProcess.stdin?.write(bufferChunk);
    } catch (err) {
      console.error("Error writing to FFmpeg:", err);
    }
  }
};

export const stopFFmpegStream = () => {
  if (ffmpegProcess) {
    ffmpegProcess.kill();
    ffmpegProcess = null;
    console.log("FFmpeg process stopped");
  }
};
