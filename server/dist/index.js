import http from "http";
import express from "express";
import { Server as SocketIO } from "socket.io";
import {
  startFFmpegStream,
  writeStreamData,
  stopFFmpegStream,
} from "./ffmpeg.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:4000";

app.use(express.json());
app.use(
  cors({ origin: CORS_ORIGIN, methods: ["GET", "POST"], credentials: true })
);

const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  allowRequest: (req, callback) => {
    callback(null, true);
  },
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", CORS_ORIGIN);
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.get("/", (req, res) => {
  res.send("Streaming backend is running");
});

// WebSocket Connection Handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  let isStreaming = false;

  // Start Streaming
  socket.on("start-stream", async (streamKey) => {
    if (!streamKey) {
      socket.emit("error", "RTMP key is required");
      return;
    }

    console.log(`Starting stream for RTMP key: ${streamKey}`);

    try {
      await startFFmpegStream(streamKey); // Wait until FFmpeg is ready
      console.log("FFmpeg started successfully, enabling streaming.");
      isStreaming = true;
      socket.emit("ffmpeg-ready"); // Notify the client
    } catch (err) {
      console.error("FFmpeg failed to start:", err);
      socket.emit("error", "FFmpeg failed to start");
    }
  });

  // Receive Media Stream Data
  socket.on("stream-data", (chunk) => {
    if (isStreaming) {
      writeStreamData(chunk);
    } else {
      console.warn("Stream data received before FFmpeg was ready, dropping...");
    }
  });

  // Stop Streaming
  socket.on("stop-stream", () => {
    console.log("Stopping stream");
    isStreaming = false;
    stopFFmpegStream();
  });

  // Handle Disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    stopFFmpegStream();
  });
});

// Start Server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
