"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative container mx-auto px-6 py-16 flex flex-col items-center text-center mt-14 overflow-hidden">
      {/* Aurora Background Effect */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[50vw] h-[50vh] bg-green-500 opacity-20 blur-[120px] rounded-full"
        animate={{
          x: ["-20%", "20%", "-20%"],
          y: ["20%", "-20%", "20%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      {/* Hero Heading & Subtext */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-6xl md:text-7xl font-bold max-w-5xl leading-tight text-white relative">
          Stream <span className="text-[#37c96f]">Live</span> Effortlessly &
          <br />
          <span className="text-[#37c96f]">Engage</span> Your Audience.
        </h1>
        <p className="mt-6 text-gray-300 max-w-3xl mx-auto text-lg sm:text-xl relative">
          The easiest way to go live across multiple platforms with just a few
          clicks.
        </p>
        <div className="mt-14 flex justify-center relative">
          <motion.a
            href="/dashboard"
            whileHover={{ scale: 1.05 }}
            className="bg-[#299c55eb] hover:bg-[#2fb261a0] text-white px-6 py-3 rounded-full text-lg font-medium transition-colors"
          >
            Get Started
          </motion.a>
        </div>
      </motion.div>

      {/* "How It Works" Section */}
      <div
        id="how-it-works"
        className="flex flex-col sm:flex-row items-center justify-between gap-10 sm:gap-20 w-full mt-24 relative"
      >
        {/* Left Side - Image with Border */}
        <div className="flex items-center justify-center rounded-b-sm p-6 relative">
          <Image
            src="/streaming-website-thumbnail.svg"
            width={800}
            height={400}
            objectFit="cover"
            alt="Hero Image"
            className="rounded-sm max-w-full h-auto"
          />
        </div>

        {/* Right Side - Steps */}
        <div className="text-center sm:text-left">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-10">
            How It Works?
          </h2>
          <ul className="text-gray-300 text-base sm:text-lg space-y-6">
            <li className="flex items-start gap-3">
              <span className="bg-[#2fb261cb] text-white font-bold px-3 py-1 rounded-full text-lg">
                1
              </span>
              <span className="leading-relaxed">
                Just paste the <b>RTMP key</b> of any streaming platform.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-[#2fb261cb] text-white font-bold px-3 py-1 rounded-full text-lg">
                2
              </span>
              <span className="leading-relaxed">
                Turn on your <b>camera & mic</b> to go live instantly.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
