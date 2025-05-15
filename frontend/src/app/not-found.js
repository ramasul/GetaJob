"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-cyan-400 to-cyan-200 flex items-center justify-center p-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <div className="relative">
            <h1 className="text-9xl font-bold text-cyan-700 animate-bounce">
              404
            </h1>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-cyan-600 rounded-full animate-pulse"></div>
          </div>

          {/* Message */}
          <div className="space-y-4 max-w-md">
            <h2 className="text-3xl font-bold text-cyan-800">
              Oops! Page Not Found
            </h2>
            <p className="text-cyan-700">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
          </div>

          <div className="relative w-64 h-64 animate-float">
            <Image
              src="/image/3DHero.png"
              alt="404 Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.back()}
              className="cursor-pointer px-6 py-3 bg-white/90 text-cyan-700 rounded-lg font-medium hover:bg-white transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Go Back
            </button>
            <button
              onClick={() => router.push("/")}
              className="cursor-pointer px-6 py-3 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>

      {/* Add custom animation styles */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
