"use client";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="border-t border-gray-300/20 py-8 mt-auto">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 StreamCast. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <motion.a
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors"
              whileHover={{ y: -2 }}
            >
              Privacy Policy
            </motion.a>
            <motion.a
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors"
              whileHover={{ y: -2 }}
            >
              Terms of Service
            </motion.a>
            <motion.a
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors"
              whileHover={{ y: -2 }}
            >
              Contact
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
}
