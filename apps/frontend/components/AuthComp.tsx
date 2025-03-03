"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthPage({ type }: { type: "signin" | "signup" }) {
  const router = useRouter();
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
    errors: { username: "", email: "", password: "" },
  });

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
        `http://localhost:3001/api/v1/user/${type}`,
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center">
          {type === "signin" ? "Sign In" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formState.username}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded"
              autoComplete="username"
            />
            {formState.errors.username && (
              <p className="text-red-500 text-xs">{formState.errors.username}</p>
            )}
          </div>

          {type === "signup" && (
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded"
                autoComplete="email"
              />
              {formState.errors.email && (
                <p className="text-red-500 text-xs">{formState.errors.email}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formState.password}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded"
              autoComplete="current-password"
            />
            {formState.errors.password && (
              <p className="text-red-500 text-xs">{formState.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            {type === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm">
          {type === "signin"
            ? "Don't have an account? "
            : "Already have an account? "}
          <Link
            href={type === "signin" ? "/signup" : "/signin"}
            className="text-blue-500 hover:underline"
          >
            {type === "signin" ? "Sign Up" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
}
