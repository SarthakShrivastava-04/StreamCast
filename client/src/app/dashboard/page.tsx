"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Mic, Video, Play, Copy, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [cameraEnabled, setCameraEnabled] = useState<boolean>(true);
  const [micEnabled, setMicEnabled] = useState<boolean>(true);
  const [rtmpKey, setRtmpKey] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(rtmpKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className=" relative flex-1 flex flex-col items-center justify-center p-6">
      {/* Video Preview */}
      <motion.div
        className="w-full max-w-3xl aspect-video bg-gray-900 rounded-xl mb-4 flex items-center justify-center border border-gray-600 relative"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {cameraEnabled ? (
          <div className="text-gray-300">Camera preview will appear here</div>
        ) : (
          <div className="text-gray-500">Camera is disabled</div>
        )}
      </motion.div>
      <motion.div
        className="w-full max-w-xl bg-gray-900 px-6 py-4 rounded-xl border border-gray-600 shadow-lg"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Controls */}
        <div className="grid gap-4">
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

          <div className="grid gap-4">
            <Label htmlFor="rtmp-key" className="text-left">
              RTMP Stream Key
            </Label>
            <div className="relative">
              <Input
                id="rtmp-key"
                type="text"
                placeholder="enter the rtmp key....eg.- rtmp://your-streaming-platform/live/key"
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

          {/* Streaming Button */}
          <motion.div
            className="flex flex-1 justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{
              scale: 0.98,
              boxShadow: rtmpKey ? "0 0 12px rgba(34, 197, 94, 0.8)" : "none",
            }}
          >
            <Button
              className={`w-full max-w-3xs text-white gap-2 rounded-full ${
                rtmpKey
                  ? "bg-green-600 hover:bg-green-700 "
                  : "bg-gray-600 cursor-not-allowed"
              }`}
              size="lg"
              disabled={!rtmpKey}
            >
              <Play size={16} />
              {rtmpKey ? "Start Streaming" : "Enter RTMP Key"}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
