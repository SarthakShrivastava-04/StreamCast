"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function Navbar() {
  const navItems: { label: string; href: string }[] = [
    { label: "Home", href: "/#" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "FAQs", href: "/#faqs" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm bg-black/70 border-b border-gray-300/20 ">
      <div className="container py-4 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
              >
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={140}
                  height={50}
                  className="object-contain rounded-2xl"
                />
              </motion.div>
            </Link>
          </div>
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm">
            {navItems.map(({ label, href }) => (
              <motion.a
                key={label}
                href={href}
                className="text-gray-300 hover:text-white transition-colors"
                whileHover={{ y: -2 }}
              >
                {label}
              </motion.a>
            ))}
          </div>
          {/* GitHub Button */}
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            className="bg-[#299c55eb] hover:bg-[#2fb261a0] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2"
          >
            <FaGithub size={18} className="text-white" />
            GitHub
          </motion.a>
        </nav>
      </div>
    </header>
  );
}
