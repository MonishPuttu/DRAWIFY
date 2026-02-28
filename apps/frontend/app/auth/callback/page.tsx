"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (token) {
      localStorage.setItem("token", token);
      router.replace("/create-room");
    } else if (error) {
      router.replace(`/signin?error=${encodeURIComponent(error)}`);
    } else {
      router.replace("/signin");
    }
  }, [searchParams, router]);

  return null;
}

export default function AuthCallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#121212]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#6965db] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Signing you in...
        </p>
      </div>
      <Suspense>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
