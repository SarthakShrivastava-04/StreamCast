"use client";

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Mic, Video, Play, StopCircle, Copy, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

const Dashboard = () => {
  const [cameraEnabled, setCameraEnabled] = useState<boolean>(true);
  const [micEnabled, setMicEnabled] = useState<boolean>(true);
  const [rtmpKey, setRtmpKey] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [streaming, setStreaming] = useState<boolean>(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const isStreamingRef = useRef<boolean>(false); // Controls data sending

  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: cameraEnabled,
          audio: micEnabled,
        });
        setMediaStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Initialize MediaRecorder only once
        if (!mediaRecorderRef.current) {
          const recorder = new MediaRecorder(stream, {
            audioBitsPerSecond: 128000,
            videoBitsPerSecond: 2500000,
            mimeType: "video/webm;codecs=vp8",
          });
          mediaRecorderRef.current = recorder;

          recorder.ondataavailable = (event) => {
            if (event.data.size > 0 && isStreamingRef.current) {
              socket.emit("stream-data", event.data);
            }
          };

          recorder.start(25); // Capture every second
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    initMedia();
  }, [cameraEnabled, micEnabled]);

  // Copy RTMP key to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(rtmpKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Start Streaming (Resume Sending Data)
  const startStreaming = () => {
    if (!rtmpKey || !mediaStream) return;

    socket.emit("start-stream", rtmpKey);
    
    isStreamingRef.current = true; // Resume sending data
    setStreaming(true);
  };

  // Stop Streaming (Pause Sending Data)
  const stopStreaming = () => {
    socket.emit("stop-stream");
    isStreamingRef.current = false; // Pause data sending
    setStreaming(false);
  };

  return (
    <div className="flex flex-row items-center justify-center w-full h-screen gap-8">
      {/* Video Preview */}
      <motion.div
        className="w-[800px] h-[600px] aspect-video bg-gray-900 rounded-xl flex items-center justify-center border border-gray-600 relative"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {cameraEnabled ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-fit h-full rounded-xl"
          />
        ) : (
          <div className="text-gray-500">Camera is disabled</div>
        )}
      </motion.div>

      {/* Controls */}
      <motion.div
        className="w-[30%] max-w-[30%] bg-gray-900 px-6 py-4 rounded-xl border border-gray-600 shadow-lg"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid gap-4">
          {/* Camera & Microphone Toggle */}
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center space-x-2">
              <Switch
                id="camera"
                checked={cameraEnabled}
                onCheckedChange={setCameraEnabled}
              />
              <Label htmlFor="camera" className="flex items-center gap-2">
                <Video
                  size={16}
                  className={cameraEnabled ? "text-green-400" : "text-gray-500"}
                />
                Camera
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="microphone"
                checked={micEnabled}
                onCheckedChange={setMicEnabled}
              />
              <Label htmlFor="microphone" className="flex items-center gap-2">
                <Mic
                  size={16}
                  className={micEnabled ? "text-green-400" : "text-gray-500"}
                />
                Microphone
              </Label>
            </div>
          </div>

          {/* RTMP Key Input */}
          <div className="grid gap-4">
            <Label htmlFor="rtmp-key" className="text-left">
              RTMP Stream Key
            </Label>
            <div className="relative">
              <Input
                id="rtmp-key"
                type="text"
                placeholder="Enter the RTMP key..."
                value={rtmpKey}
                onChange={(e) => setRtmpKey(e.target.value)}
                className="bg-gray-800 text-white pr-12"
              />
              <Button
                onClick={handleCopy}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 p-2"
              >
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
              </Button>
            </div>
          </div>

          {/* Start/Stop Streaming Button */}
          <motion.div
            className="flex flex-1 justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              className={`w-full max-w-3xs text-white gap-2 rounded-full ${
                rtmpKey
                  ? streaming
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
              size="lg"
              disabled={!rtmpKey}
              onClick={streaming ? stopStreaming : startStreaming}
            >
              {streaming ? <StopCircle size={16} /> : <Play size={16} />}
              {streaming ? "Stop Streaming" : "Start Streaming"}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
