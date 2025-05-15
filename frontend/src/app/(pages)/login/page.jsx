"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@auth/context";
import Link from "next/link";

export default function Login() {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, user } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (user) {
      let dashboardPath = "/";
      if (user.user_type === "recruiter") {
        dashboardPath = "/recruiter/dashboard";
      } else if (user.user_type === "applier") {
        dashboardPath = "/home"; // Tolong nanti disesuaikan menjadi applier/home bukan applicant
      }

      const redirectParam =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("redirect")
          : null;

      const redirectPath = redirectParam || dashboardPath;
      router.push(decodeURIComponent(redirectPath));
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(formData.identifier, formData.password);
      const redirectPath =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("redirect") ||
            "/dashboard"
          : "/dashboard";
      router.push(decodeURIComponent(redirectPath));
    } catch (err) {
      console.error("Login failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-cyan-300 to-cyan-500 flex items-center justify-center p-4 text-cyan-500">
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/30">
        {/* Logo disini*/}
        <div className="md:hidden w-full py-5 px-4 bg-gradient-to-r from-cyan-50 to-cyan-100 flex justify-center items-center">
          <div className="flex items-center space-x-4">
            <div className="relative w-24 h-24">
              <Image
                src="/image/3DHero.png"
                alt="GetaJob Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-4xl font-bold text-cyan-700">GetaJob</h1>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="hidden md:flex md:w-1/2 p-8 flex-col items-center justify-center bg-gradient-to-br from-cyan-50 to-cyan-100">
            <div className="relative w-48 h-48 mb-6">
              <Image
                src="/image/3DHero.png"
                alt="GetaJob Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-cyan-600 tracking-tight">
              GetaJob
            </h1>
            <p className="text-cyan-700 mt-2 text-center max-w-sm">
              Find your dream job today
            </p>
          </div>

          {/* Formnya */}
          <div className="w-full md:w-1/2 p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-cyan-700 mb-4 text-center">
              Login
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    id="identifier"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="Username or Email"
                    className="w-full px-4 py-3 pl-10 bg-white/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-cyan-200"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-cyan-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full px-4 py-3 pl-10 pr-10 bg-white/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-cyan-200"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-cyan-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/forgot-password"
                  className="text-sm text-cyan-600 hover:text-cyan-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg transition-colors duration-200 font-medium text-white ${
                  isLoading
                    ? "bg-cyan-400 cursor-not-allowed"
                    : "bg-cyan-500 hover:bg-cyan-600"
                } disabled:cursor-not-allowed cursor-pointer`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <p className="text-center text-cyan-700 mt-6 text-sm">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-cyan-600 font-medium hover:text-cyan-700 transition-colors"
              >
                Register here!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
