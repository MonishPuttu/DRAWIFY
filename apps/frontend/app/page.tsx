"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Pencil,
  Share2,
  Users,
  Lock,
  Shapes,
  Moon,
  Sun,
  ArrowRight,
  Zap,
  Layers,
  MonitorSmartphone,
  ChevronRight,
  Github,
  Twitter,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsVisible(true);
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

function LandingPage() {
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-200 overflow-x-hidden">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-purple-600 p-1.5 rounded-lg">
              <Shapes className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl dark:text-white tracking-tight">
              Drawify
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              How it Works
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-gray-400" />
              ) : (
                <Moon className="h-4 w-4 text-gray-600" />
              )}
            </button>
            <Link
              href="/signin"
              className="hidden sm:inline-flex text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link href="/create-room">
              <button className="bg-purple-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Start Drawing
              </button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 dark:text-white" />
              ) : (
                <Menu className="h-5 w-5 dark:text-white" />
              )}
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-4 pb-4">
            <div className="flex flex-col gap-3">
              <a
                href="#features"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 py-2"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 py-2"
              >
                How it Works
              </a>
              <Link
                href="/signin"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 py-2"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-in-up inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-300 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
              <Zap className="h-3.5 w-3.5" />
              Free & Open Source Whiteboard
            </div>

            <h1 className="animate-fade-in-up text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]">
              Where ideas take{" "}
              <span className="text-purple-600 dark:text-purple-400">
                shape
              </span>{" "}
              together
            </h1>

            <p className="animate-fade-in-up-delayed text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              A collaborative whiteboard for teams to sketch diagrams,
              wireframes, and illustrations in real-time. Beautiful, fast, and
              built for the way you work.
            </p>

            <div className="animate-fade-in-up-delayed-2 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup">
                <button className="group bg-purple-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                  Get Started Free
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/signin">
                <button className="px-8 py-3.5 rounded-xl font-semibold border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                  Sign In
                </button>
              </Link>
            </div>
          </div>

          {/* Animated Canvas Preview */}
          <CanvasPreview />
        </div>
      </section>

      <FeaturesSection />
      <HowItWorksSection />

      {/* Footer */}
      <FooterSection />
    </div>
  );
}

/* ── Animated Canvas Preview ── */
function CanvasPreview() {
  return (
    <div className="mt-20 relative max-w-5xl mx-auto animate-fade-in-up-delayed-2">
      <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700" />
            <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700" />
            <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700" />
          </div>
          <div className="flex-1 flex justify-center gap-2">
            {["Rectangle", "Circle", "Arrow", "Text", "Pencil"].map((tool) => (
              <div
                key={tool}
                className="px-3 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium"
              >
                {tool}
              </div>
            ))}
          </div>
        </div>

        {/* Canvas with drawing animations */}
        <div className="relative h-64 sm:h-80 bg-dots overflow-hidden">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 900 320"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Rectangle - drawn with animation */}
            <rect
              x="60"
              y="40"
              width="160"
              height="96"
              rx="12"
              fill="none"
              stroke="currentColor"
              className="text-gray-400 dark:text-gray-500 draw-rect"
              strokeWidth="2"
            />

            {/* Circle - drawn with animation */}
            <circle
              cx="740"
              cy="130"
              r="56"
              fill="none"
              stroke="currentColor"
              className="text-gray-400 dark:text-gray-500 draw-circle"
              strokeWidth="2"
            />

            {/* Rounded rectangle - drawn with animation */}
            <rect
              x="340"
              y="180"
              width="180"
              height="80"
              rx="8"
              fill="none"
              stroke="currentColor"
              className="text-gray-400 dark:text-gray-500 draw-rounded-rect"
              strokeWidth="2"
            />

            {/* Connecting line 1 */}
            <line
              x1="220"
              y1="70"
              x2="460"
              y2="190"
              stroke="currentColor"
              className="text-gray-300 dark:text-gray-600 draw-line-1"
              strokeWidth="1.5"
            />

            {/* Connecting line 2 */}
            <line
              x1="520"
              y1="210"
              x2="685"
              y2="145"
              stroke="currentColor"
              className="text-gray-300 dark:text-gray-600 draw-line-2"
              strokeWidth="1.5"
            />
          </svg>

          {/* Animated cursor - Alice */}
          <div className="absolute top-16 left-28 animate-cursor-alice">
            <div className="flex items-center gap-1">
              <svg
                width="16"
                height="20"
                viewBox="0 0 16 20"
                fill="none"
                className="drop-shadow"
              >
                <path
                  d="M1 1L1 15L5 11L9 19L12 17.5L8 10L13 10L1 1Z"
                  fill="#9333ea"
                  stroke="white"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full font-medium shadow">
                Alice
              </span>
            </div>
          </div>

          {/* Animated cursor - Bob */}
          <div className="absolute bottom-20 right-24 animate-cursor-bob">
            <div className="flex items-center gap-1">
              <svg
                width="16"
                height="20"
                viewBox="0 0 16 20"
                fill="none"
                className="drop-shadow"
              >
                <path
                  d="M1 1L1 15L5 11L9 19L12 17.5L8 10L13 10L1 1Z"
                  fill="#059669"
                  stroke="white"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full font-medium shadow">
                Bob
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Features with sketch-border hover ── */
function FeaturesSection() {
  const { ref, isVisible } = useScrollReveal();
  const features = [
    {
      icon: Pencil,
      title: "Intuitive Drawing",
      description:
        "Natural hand-drawn feel with smart shape recognition. Sketch freely and let Drawify refine your strokes.",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Users,
      title: "Real-time Collaboration",
      description:
        "Work together seamlessly. See live cursors, edits, and changes from your entire team instantly.",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Share2,
      title: "One-Click Sharing",
      description:
        "Share a link or export to PNG, SVG, or PDF. Your work is always accessible and portable.",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: Layers,
      title: "Infinite Canvas",
      description:
        "Never run out of space. Pan, zoom, and organize ideas across an unlimited workspace.",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      icon: MonitorSmartphone,
      title: "Works Everywhere",
      description:
        "Desktop, tablet, or phone — Drawify adapts to your screen with touch and stylus support.",
      iconBg: "bg-rose-100 dark:bg-rose-900/30",
      iconColor: "text-rose-600 dark:text-rose-400",
    },
    {
      icon: Lock,
      title: "End-to-End Encrypted",
      description:
        "Your drawings stay private. Encrypted by default with zero data collection.",
      iconBg: "bg-gray-100 dark:bg-gray-800",
      iconColor: "text-gray-600 dark:text-gray-400",
    },
  ];

  return (
    <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything you need to create
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Powerful tools wrapped in a simple interface. Focus on your ideas,
            not the software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`feature-card bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 transition-all duration-700 hover:-translate-y-1 hover:shadow-lg ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isVisible ? `${i * 100}ms` : "0ms" }}
            >
              {/* Sketch border that draws on hover */}
              <svg
                className="sketch-border"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="99"
                  height="99"
                  rx="16"
                  fill="none"
                  stroke="currentColor"
                  className="text-purple-400 dark:text-purple-500"
                  strokeWidth="1.5"
                />
              </svg>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.iconBg}`}
              >
                <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── How It Works with drawn connectors ── */
function HowItWorksSection() {
  const { ref, isVisible } = useScrollReveal();
  const steps = [
    {
      step: "01",
      title: "Create a Room",
      description:
        "Sign up and create a new canvas room in one click. Your workspace is instantly ready.",
    },
    {
      step: "02",
      title: "Draw & Design",
      description:
        "Use shapes, freehand, text, and arrows to bring your ideas to life on an infinite canvas.",
    },
    {
      step: "03",
      title: "Collaborate & Share",
      description:
        "Invite your team with a shareable link. Everyone works together in real-time.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isVisible ? "connector-visible" : ""}`}
      >
        <div
          className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Start in seconds, not minutes
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            No downloads, no installations. Just open and draw.
          </p>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${isVisible ? "step-visible" : ""}`}
        >
          {steps.map((item, i) => (
            <div
              key={i}
              className={`relative text-center transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: isVisible ? `${200 + i * 200}ms` : "0ms",
              }}
            >
              {/* Sketched circle behind step number */}
              <div className="relative inline-block mb-4">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  className="mx-auto"
                >
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-gray-200 dark:text-gray-700 draw-step-circle"
                    style={{ animationDelay: `${400 + i * 200}ms` }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-black text-gray-300 dark:text-gray-600">
                  {item.step}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                {item.description}
              </p>

              {/* Drawn connector arrow between steps */}
              {i < 2 && (
                <svg
                  className="hidden md:block absolute top-10 -right-8 w-16 h-8"
                  viewBox="0 0 64 32"
                >
                  <path
                    d="M4 16 H50 L42 8 M50 16 L42 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-300 dark:text-gray-600 draw-connector"
                    style={{ animationDelay: `${800 + i * 300}ms` }}
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Footer with drawn separator ── */
function FooterSection() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <footer className="bg-gray-50 dark:bg-gray-900/50">
      {/* Sketched separator line */}
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isVisible ? "footer-line-visible" : ""}`}
      >
        <svg
          className="w-full h-4"
          viewBox="0 0 1200 16"
          preserveAspectRatio="none"
        >
          <path
            d="M0 8 Q100 2, 200 8 T400 8 T600 8 T800 8 T1000 8 T1200 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-gray-300 dark:text-gray-700 draw-footer-line"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-purple-600 p-1.5 rounded-lg">
                <Shapes className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg dark:text-white">Drawify</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
              The open-source collaborative whiteboard for everyone.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {[
            {
              title: "Product",
              links: ["Download", "Pricing", "Libraries", "Changelog"],
            },
            {
              title: "Resources",
              links: ["Documentation", "API Reference", "Guides", "Templates"],
            },
            {
              title: "Company",
              links: ["About", "Blog", "Careers", "Press Kit"],
            },
            {
              title: "Legal",
              links: [
                "Privacy Policy",
                "Terms of Service",
                "Security",
                "Cookie Policy",
              ],
            },
          ].map((section, i) => (
            <div key={i}>
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Drawify. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Made with <span className="text-red-500">&hearts;</span> for
            creators everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}

export default LandingPage;
