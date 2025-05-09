"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import ForgotPasswordStepOne from "@/app/components/forgot-password/ForgotPasswordStepOne";
import ForgotPasswordStepTwo from "@/app/components/forgot-password/ForgotPasswordStepTwo";
import ForgotPasswordStepThree from "@/app/components/forgot-password/ForgotPasswordStepThree";

// Constants
export const OTP_EXPIRED_MINUTES = 15;

export default function ForgotPassword() {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [otpExpiry, setOtpExpiry] = useState(null);

  const handleEmailSubmit = (submittedEmail) => {
    setEmail(submittedEmail);

    const expiryTime = Date.now() + OTP_EXPIRED_MINUTES * 60 * 1000;
    setOtpExpiry(expiryTime);

    setCurrentStep(2);
  };

  const handleOtpVerified = (otpValue) => {
    setOtp(otpValue);
    setCurrentStep(3);
  };

  const handlePasswordReset = () => {
    setEmail("");
    setOtp(["", "", "", "", "", ""]);
    setOtpExpiry(null);
    setError("");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-cyan-300 to-cyan-500 flex items-center justify-center p-4 text-cyan-500">
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/30">
        {/* Untuk mobile */}
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
          {/* Untuk PC */}
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

          {/* Form */}
          <div className="w-full md:w-1/2 p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-cyan-700 mb-4 text-center">
              {currentStep === 1 && "Forgot Password"}
              {currentStep === 2 && "Enter OTP"}
              {currentStep === 3 && "Reset Password"}
            </h1>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            {/* Step 1: Email Input */}
            {currentStep === 1 && (
              <ForgotPasswordStepOne
                email={email}
                onSubmit={handleEmailSubmit}
                setError={setError}
              />
            )}

            {/* Step 2: OTP Verification */}
            {currentStep === 2 && (
              <ForgotPasswordStepTwo
                email={email}
                otp={otp}
                setOtp={setOtp}
                otpExpiry={otpExpiry}
                onVerified={handleOtpVerified}
                setError={setError}
              />
            )}

            {/* Step 3: Password Reset */}
            {currentStep === 3 && (
              <ForgotPasswordStepThree
                email={email}
                otp={otp.join("")}
                onSuccess={handlePasswordReset}
                setError={setError}
              />
            )}

            <p className="text-center text-cyan-700 mt-6 text-sm">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-cyan-600 font-medium hover:text-cyan-700 transition-colors"
              >
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
