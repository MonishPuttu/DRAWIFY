"use client";

import React, { useState, useEffect } from "react";
import { Github, Moon, Sun, ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";

function LandingPage() {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-[#1b1b1f] dark:text-[#e3e3e3] transition-colors">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800/50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <svg
              width="28"
              height="28"
              viewBox="0 0 100 100"
              className="text-[#6965db]"
            >
              <rect
                x="10"
                y="10"
                width="80"
                height="80"
                rx="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
              />
              <line
                x1="30"
                y1="50"
                x2="70"
                y2="50"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <line
                x1="50"
                y1="30"
                x2="50"
                y2="70"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-lg font-semibold tracking-tight">
              Drawify
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-5">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-gray-400" />
              ) : (
                <Moon className="w-4 h-4 text-gray-500" />
              )}
            </button>
            <Link
              href="/signin"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link href="/signup">
              <button className="bg-[#6965db] hover:bg-[#5b57c9] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                Get Started
              </button>
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden px-6 pb-4 flex flex-col gap-3 border-t border-gray-100 dark:border-gray-800/50 bg-white dark:bg-[#121212]">
            <Link
              href="/signin"
              className="text-sm py-2 text-gray-600 dark:text-gray-400"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm py-2 text-[#6965db] font-medium"
            >
              Get Started
            </Link>
            <button
              onClick={() => setIsDark(!isDark)}
              className="text-sm py-2 text-left text-gray-600 dark:text-gray-400"
            >
              {isDark ? "Light mode" : "Dark mode"}
            </button>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="pt-20 sm:pt-28 pb-8 px-6">
        <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-handwritten leading-tight mb-6">
            An open source virtual{" "}
            <span className="text-[#6965db]">hand-drawn</span> style whiteboard.
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-xl mx-auto">
            Collaborative and end-to-end encrypted.
          </p>
          <Link href="/create-room">
            <button className="group bg-[#6965db] hover:bg-[#5b57c9] text-white px-8 py-3.5 rounded-xl text-base font-medium transition-colors inline-flex items-center gap-2">
              Start Drawing
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
        </div>
      </section>

      {/* ── Canvas Preview ── */}
      <section className="px-6 pt-8 pb-20 animate-fade-in-up-delayed">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700/50 overflow-hidden shadow-sm bg-white dark:bg-[#1e1e1e]">
            {/* Toolbar */}
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/80 dark:bg-[#252525]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
              </div>
              <div className="flex-1 flex justify-center gap-1">
                {[
                  "Select",
                  "Rectangle",
                  "Diamond",
                  "Ellipse",
                  "Arrow",
                  "Text",
                ].map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 text-[11px] rounded bg-white dark:bg-[#2c2c2c] text-gray-500 dark:text-gray-400 font-medium border border-gray-100 dark:border-gray-600/30"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Canvas SVG */}
            <div className="relative h-56 sm:h-72 canvas-grid">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 800 288"
                preserveAspectRatio="xMidYMid slice"
              >
                {/* Rectangle */}
                <rect
                  x="80"
                  y="50"
                  width="140"
                  height="90"
                  rx="3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="text-[#1b1b1f] dark:text-[#e3e3e3] draw-rect"
                />
                {/* Diamond */}
                <polygon
                  points="460,45 530,100 460,155 390,100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="text-[#1b1b1f] dark:text-[#e3e3e3] draw-diamond"
                />
                {/* Ellipse */}
                <ellipse
                  cx="660"
                  cy="180"
                  rx="65"
                  ry="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="text-[#1b1b1f] dark:text-[#e3e3e3] draw-circle"
                />
                {/* Arrow 1 */}
                <line
                  x1="220"
                  y1="95"
                  x2="388"
                  y2="100"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-[#1b1b1f] dark:text-[#e3e3e3] draw-line-1"
                />
                {/* Arrow 2 */}
                <line
                  x1="530"
                  y1="110"
                  x2="598"
                  y2="165"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-[#1b1b1f] dark:text-[#e3e3e3] draw-line-2"
                />
                {/* Arrowheads */}
                <polygon
                  points="388,95 378,88 382,100"
                  fill="currentColor"
                  className="text-[#1b1b1f] dark:text-[#e3e3e3] draw-arrow-head-1"
                />
                <polygon
                  points="598,165 590,155 600,158"
                  fill="currentColor"
                  className="text-[#1b1b1f] dark:text-[#e3e3e3] draw-arrow-head-2"
                />
                {/* Hand-drawn text */}
                <text
                  x="115"
                  y="230"
                  fontSize="14"
                  fontFamily="var(--font-handwritten)"
                  fill="currentColor"
                  className="text-gray-400 dark:text-gray-500 draw-text"
                >
                  Sketch your ideas...
                </text>
              </svg>

              {/* Cursor Alice */}
              <div className="absolute top-12 left-24 animate-cursor-alice">
                <div className="flex items-center gap-0.5">
                  <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
                    <path
                      d="M1 1v12l3.5-3.5L8 17l2.5-1.5L7 9h5L1 1Z"
                      fill="#6965db"
                      stroke="#fff"
                      strokeWidth="1.2"
                    />
                  </svg>
                  <span className="text-[10px] bg-[#6965db] text-white px-1.5 py-0.5 rounded font-medium">
                    Alice
                  </span>
                </div>
              </div>

              {/* Cursor Bob */}
              <div className="absolute bottom-16 right-20 animate-cursor-bob">
                <div className="flex items-center gap-0.5">
                  <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
                    <path
                      d="M1 1v12l3.5-3.5L8 17l2.5-1.5L7 9h5L1 1Z"
                      fill="#e88e3c"
                      stroke="#fff"
                      strokeWidth="1.2"
                    />
                  </svg>
                  <span className="text-[10px] bg-[#e88e3c] text-white px-1.5 py-0.5 rounded font-medium">
                    Bob
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 py-20 bg-gray-50/80 dark:bg-[#1a1a1a]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-handwritten text-center mb-14">
            Why Drawify?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#6965db]"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                ),
                title: "Open Source",
                desc: "100% free and open source. Run it yourself or use our hosted version. Your data, your rules.",
              },
              {
                icon: (
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#6965db]"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
                title: "Real-time Collaboration",
                desc: "Work together with your team. See live cursors, instant updates, and shared editing.",
              },
              {
                icon: (
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#6965db]"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ),
                title: "End-to-End Encrypted",
                desc: "Your drawings stay private. Zero knowledge architecture means only you see your data.",
              },
            ].map((f, i) => (
              <div key={i} className="text-center p-6">
                <div className="flex justify-center mb-4">{f.icon}</div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
