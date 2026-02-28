"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Moon, Sun, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AuthPage({ type }: { type: "signin" | "signup" }) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Read OAuth error from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlError = params.get("error");
    if (urlError) setError(urlError);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setError("");
  };

  const validate = () => {
    const errors = { username: "", email: "", password: "" };
    let valid = true;

    if (!form.username || form.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
      valid = false;
    }
    if (
      type === "signup" &&
      (!form.email || !/\S+@\S+\.\S+/.test(form.email))
    ) {
      errors.email = "Valid email is required";
      valid = false;
    }
    if (!form.password || form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setFieldErrors(errors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setError("");

    try {
      const payload: Record<string, string> = {
        username: form.username,
        password: form.password,
      };
      if (type === "signup") payload.email = form.email;

      const res = await axios.post(`/api/v1/user/${type}`, payload);

      if (type === "signin") {
        localStorage.setItem("token", res.data.token);
        router.push("/create-room");
      } else {
        router.push("/signin");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = (provider: "github" | "google") => {
    setOauthLoading(provider);
    window.location.href = `/api/v1/user/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] flex">
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#6965db] relative overflow-hidden flex-col justify-center items-center p-12">
        {/* Decorative hand-drawn shapes */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.07]"
          viewBox="0 0 600 800"
        >
          <rect
            x="50"
            y="80"
            width="120"
            height="80"
            rx="4"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <circle
            cx="450"
            cy="180"
            r="50"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <polygon
            points="300,350 360,450 240,450"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <line
            x1="80"
            y1="280"
            x2="500"
            y2="300"
            stroke="white"
            strokeWidth="1.5"
            strokeDasharray="8 4"
          />
          <rect
            x="350"
            y="520"
            width="150"
            height="100"
            rx="8"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <ellipse
            cx="180"
            cy="620"
            rx="80"
            ry="50"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <polygon
            points="500,600 540,660 460,660"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <line
            x1="100"
            y1="500"
            x2="300"
            y2="540"
            stroke="white"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
        </svg>

        <div className="relative z-10 text-white text-center max-w-sm">
          <div className="flex items-center justify-center gap-3 mb-10">
            <svg width="40" height="40" viewBox="0 0 100 100">
              <rect
                x="10"
                y="10"
                width="80"
                height="80"
                rx="15"
                fill="none"
                stroke="white"
                strokeWidth="6"
              />
              <line
                x1="30"
                y1="50"
                x2="70"
                y2="50"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <line
                x1="50"
                y1="30"
                x2="50"
                y2="70"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-2xl font-semibold tracking-tight">
              Drawify
            </span>
          </div>
          <h2 className="text-3xl font-handwritten leading-snug mb-4">
            Draw together,
            <br />
            create anything.
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            The open-source whiteboard for teams to sketch, collaborate, and
            bring ideas to life in real-time.
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <svg
              width="24"
              height="24"
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
            <span className="font-semibold text-[#1b1b1f] dark:text-white">
              Drawify
            </span>
          </Link>
          <div className="lg:flex-1" />
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-gray-400" />
            ) : (
              <Moon className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 pb-8">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-bold mb-1 text-[#1b1b1f] dark:text-white">
              {type === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              {type === "signin"
                ? "Sign in to continue to Drawify"
                : "Start drawing and collaborating for free"}
            </p>

            {/* OAuth buttons */}
            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={() => handleOAuth("github")}
                disabled={!!oauthLoading}
                className="flex items-center justify-center gap-3 w-full py-2.5 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors text-sm font-medium text-[#1b1b1f] dark:text-[#e3e3e3] disabled:opacity-60"
              >
                {oauthLoading === "github" ? (
                  <Loader2 className="w-[18px] h-[18px] animate-spin" />
                ) : (
                  <GithubIcon />
                )}
                Continue with GitHub
              </button>
              <button
                onClick={() => handleOAuth("google")}
                disabled={!!oauthLoading}
                className="flex items-center justify-center gap-3 w-full py-2.5 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors text-sm font-medium text-[#1b1b1f] dark:text-[#e3e3e3] disabled:opacity-60"
              >
                {oauthLoading === "google" ? (
                  <Loader2 className="w-[18px] h-[18px] animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                Continue with Google
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                or
              </span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Credential form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field
                label="Username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                error={fieldErrors.username}
                placeholder="Enter your username"
                autoComplete="username"
              />

              {type === "signup" && (
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  error={fieldErrors.email}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              )}

              <div className="relative">
                <Field
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  error={fieldErrors.password}
                  placeholder="••••••••"
                  autoComplete={
                    type === "signin" ? "current-password" : "new-password"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-[#6965db] hover:bg-[#5b57c9] text-white font-medium text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {type === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              {type === "signin"
                ? "Don\u2019t have an account? "
                : "Already have an account? "}
              <Link
                href={type === "signin" ? "/signup" : "/signin"}
                className="text-[#6965db] hover:underline font-medium"
              >
                {type === "signin" ? "Sign up" : "Sign in"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Reusable field component ── */
function Field({
  label,
  error,
  ...props
}: {
  label: string;
  error: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
      </label>
      <input
        {...props}
        className={`w-full px-3 py-2.5 rounded-lg border ${
          error
            ? "border-red-300 dark:border-red-700 focus:ring-red-500"
            : "border-gray-200 dark:border-gray-700 focus:ring-[#6965db]"
        } bg-white dark:bg-[#1e1e1e] text-[#1b1b1f] dark:text-white text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ── OAuth icon components ── */
function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
