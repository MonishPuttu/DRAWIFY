"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";

export default function AuthPage({ type }: { type: "signin" | "signup" }) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
    errors: { username: "", email: "", password: "" },
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
      errors: { ...prev.errors, [name]: "" },
    }));
  };

  const validateForm = () => {
    const newErrors = { username: "", email: "", password: "" };
    let isValid = true;

    if (!formState.username) {
      newErrors.username = "Username is required";
      isValid = false;
    }
    if (type === "signup" && !formState.email) {
      newErrors.email = "Email is required";
      isValid = false;
    }
    if (!formState.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setFormState((prev) => ({ ...prev, errors: newErrors }));
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const requestData: { username: string; email?: string; password: string } = {
        username: formState.username,
        password: formState.password,
      };

      if (type === "signup") {
        requestData.email = formState.email;
      }

      const response = await axios.post(
        `/api/v1/user/${type}`,
        requestData
      );

      console.log("Success:", response.data);

      if (type === "signin") {
        localStorage.setItem("token", response.data.token);
        router.push("/create-room"); 
      } else {
        router.push("/signin"); 
      }

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-50 dark:bg-gray-950 transition-colors duration-200">
      <div className="w-full max-w-md p-8 space-y-4 bg-white dark:bg-gray-900 shadow-md rounded-lg border border-purple-200 dark:border-gray-800">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-purple-900 dark:text-white">
            {type === "signin" ? "Sign In" : "Sign Up"}
          </h2>
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-gray-300" />
            ) : (
              <Moon className="h-5 w-5 text-purple-600" />
            )}
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-700 dark:text-gray-300">Username</label>
            <input
              type="text"
              name="username"
              value={formState.username}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-purple-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-purple-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
              autoComplete="username"
            />
            {formState.errors.username && (
              <p className="text-red-500 text-xs">{formState.errors.username}</p>
            )}
          </div>

          {type === "signup" && (
            <div>
              <label className="block text-sm font-medium text-purple-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-purple-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-purple-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                autoComplete="email"
              />
              {formState.errors.email && (
                <p className="text-red-500 text-xs">{formState.errors.email}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-purple-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={formState.password}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-purple-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-purple-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
              autoComplete="current-password"
            />
            {formState.errors.password && (
              <p className="text-red-500 text-xs">{formState.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-2 text-white bg-purple-600 rounded hover:bg-purple-700 transition-colors"
          >
            {type === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-purple-700 dark:text-gray-300">
          {type === "signin"
            ? "Don't have an account? "
            : "Already have an account? "}
          <Link
            href={type === "signin" ? "/signup" : "/signin"}
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            {type === "signin" ? "Sign Up" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
}
