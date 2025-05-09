"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function Register() {
  const router = useRouter();
  const [hoverApplier, setHoverApplier] = useState(false);
  const [hoverRecruiter, setHoverRecruiter] = useState(false);

  const handleApplierClick = () => {
    router.push("/register/applier");
  };

  const handleRecruiterClick = () => {
    router.push("/register/recruiter");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-cyan-300 to-cyan-500 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/30 transition-all duration-300">
        {/* Logo */}
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
          <div className="w-full md:w-1/2 p-6 md:p-8">
            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-col items-center justify-center w-full max-w-md">
                <h1 className="text-2xl md:text-3xl font-bold text-cyan-700 mb-4 text-center">
                  Choose Your Path
                </h1>
                <p className="text-cyan-600 text-center mb-8 max-w-sm">
                  Select your role to customize your experience
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 w-full mb-8">
                  <button
                    onClick={handleApplierClick}
                    onMouseEnter={() => setHoverApplier(true)}
                    onMouseLeave={() => setHoverApplier(false)}
                    className={`flex flex-col items-center justify-center p-6 bg-white rounded-xl border ${
                      hoverApplier ? "border-cyan-400" : "border-cyan-200"
                    } shadow-md hover:shadow-lg transition-all duration-200 group cursor-pointer`}
                  >
                    <div
                      className={`relative w-16 h-16 md:w-24 md:h-24 mb-4 transition-transform duration-300 ${
                        hoverApplier ? "scale-110" : ""
                      }`}
                    >
                      <Image
                        src="/image/3DHero.png?height=100&width=100"
                        alt="Applier"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-lg font-medium text-cyan-700 mb-1">
                      Applier
                    </span>
                    <span className="text-xs text-cyan-500 text-center">
                      Find opportunities that match your skills
                    </span>
                  </button>

                  <button
                    onClick={handleRecruiterClick}
                    onMouseEnter={() => setHoverRecruiter(true)}
                    onMouseLeave={() => setHoverRecruiter(false)}
                    className={`flex flex-col items-center justify-center p-6 bg-white rounded-xl border ${
                      hoverRecruiter ? "border-cyan-400" : "border-cyan-200"
                    } shadow-md hover:shadow-lg transition-all duration-200 group cursor-pointer`}
                  >
                    <div
                      className={`relative w-16 h-16 md:w-24 md:h-24 mb-4 transition-transform duration-300 ${
                        hoverRecruiter ? "scale-110" : ""
                      }`}
                    >
                      <Image
                        src="/image/3DHero.png?height=100&width=100"
                        alt="Recruiter"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-lg font-medium text-cyan-700 mb-1">
                      Recruiter
                    </span>
                    <span className="text-xs text-cyan-500 text-center">
                      Connect with qualified candidates
                    </span>
                  </button>
                </div>

                <div className="w-full flex flex-col items-center">
                  <p className="text-center text-cyan-800 text-sm">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-cyan-600 font-medium hover:text-cyan-700 transition-colors"
                    >
                      Login here!
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
