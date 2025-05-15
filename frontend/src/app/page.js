"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth/context";
import { useEffect } from "react";

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      let dashboardPath = "/";
      if (user.user_type === "recruiter") {
        dashboardPath = "/recruiter/dashboard";
      } else if (user.user_type === "applier") {
        dashboardPath = "/applicant/home"; // Tolong nanti disesuaikan menjadi applier/home bukan applicant
      }

      const redirectParam =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("redirect")
          : null;

      const redirectPath = redirectParam || dashboardPath;
      router.push(decodeURIComponent(redirectPath));
    }
  }, [user, router]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-cyan-400 to-cyan-200">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image
              src="/image/3DHero.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-cyan-700 text-xl font-bold">Get a Job</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/login")}
              className="cursor-pointer px-4 py-2 text-cyan-700 hover:text-cyan-800 font-medium transition-colors duration-200"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push("/register")}
              className="cursor-pointer px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Logo Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-cyan-700 leading-tight">
                Find Your Dream Job
                <span className="block text-cyan-600">With Confidence</span>
              </h1>
              <p className="text-lg text-cyan-800 opacity-80 max-w-xl">
                Connect with top employers and discover opportunities that match
                your skills and aspirations. Our AI-powered platform helps you
                find the perfect job match.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push("/register")}
                className="cursor-pointer px-6 py-3 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
              <button
                onClick={() => router.push("/login")}
                className="cursor-pointer px-6 py-3 bg-white/90 text-cyan-700 rounded-lg font-medium hover:bg-white transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-64 h-64 md:w-96 md:h-96">
              <Image
                src="/image/3DHero.png"
                alt="Hero"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-cyan-700 text-center mb-12">
          Why Choose Get a Job?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-200">
            <div className="bg-cyan-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-cyan-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-cyan-800 mb-2">
              Smart Job Matching
            </h3>
            <p className="text-cyan-700">
              Our AI-powered system matches you with jobs that align with your
              skills and career goals.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-200">
            <div className="bg-cyan-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-cyan-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-cyan-800 mb-2">
              Secure Platform
            </h3>
            <p className="text-cyan-700">
              Your data is protected with enterprise-grade security measures and
              privacy controls.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-200">
            <div className="bg-cyan-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-cyan-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-cyan-800 mb-2">
              Quick Apply
            </h3>
            <p className="text-cyan-700">
              Apply to multiple jobs with just a few clicks using our
              streamlined application process.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white/90 backdrop-blur-md rounded-xl p-8 shadow-lg border border-white/30 text-center">
          <h2 className="text-3xl font-bold text-cyan-700 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-cyan-800 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have found their dream jobs
            through our platform.
          </p>
          <button
            onClick={() => router.push("/register")}
            className="cursor-pointer px-8 py-3 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Create Your Account
          </button>
        </div>
      </div>
    </div>
  );
}
