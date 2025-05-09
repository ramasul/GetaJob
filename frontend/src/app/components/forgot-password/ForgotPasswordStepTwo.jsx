"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { OTP_EXPIRED_MINUTES } from "@/app/(pages)/forgot-password/page";
import { forgotPasswordService } from "@/app/api/forgotPasswordService";

// Define OTP schema with zod
const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export default function ForgotPasswordStepTwo({
  email,
  otp,
  setOtp,
  otpExpiry,
  onVerified,
  setError,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(OTP_EXPIRED_MINUTES * 60);
  const [validationError, setValidationError] = useState("");

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const onResend = async () => {
    setIsLoading(true);
    setError("");
    setValidationError("");
    try {
      await forgotPasswordService.requestPasswordReset(email);
    } catch (error) {
      console.error("Failed to resend OTP", error);
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    // Biar cuma digit
    if (!/^\d*$/.test(value)) return;

    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setValidationError("");

    // Autofocus setelah input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setValidationError("");

    try {
      // Combine OTP digits
      const otpValue = otp.join("");

      // Validate OTP format
      otpSchema.parse({ otp: otpValue });

      const response = await forgotPasswordService.verifyOTP(email, otpValue);

      onVerified(otp);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setValidationError(err.errors[0].message);
      } else {
        console.error("OTP verification failed", err);
        setError("OTP verification failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (!otpExpiry) return;

    const calculateRemainingTime = () => {
      const remainingMs = otpExpiry - Date.now();
      return Math.max(0, Math.floor(remainingMs / 1000));
    };

    setRemainingTime(calculateRemainingTime());

    const timer = setInterval(() => {
      const newRemainingTime = calculateRemainingTime();
      setRemainingTime(newRemainingTime);

      if (newRemainingTime <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [otpExpiry]);

  useEffect(() => {
    const firstInput = document.getElementById("otp-0");
    if (firstInput) firstInput.focus();
  }, []);

  return (
    <form onSubmit={handleVerifyOtp} className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-cyan-700 text-sm">OTP sent to {email}</p>
        <p className="text-cyan-600 font-semibold mt-2">
          Time remaining: {formatTime(remainingTime)}
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={otp[index]}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-12 h-12 text-xl text-center rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 border ${
              validationError ? "border-red-400" : "border-cyan-200"
            } bg-white/50`}
            required
            autoComplete="off"
          />
        ))}
      </div>

      {validationError && (
        <p className="text-center text-sm text-red-600">{validationError}</p>
      )}

      <p className="text-center text-sm text-cyan-700 mt-3">
        Didn't receive the code?{" "}
        <button
          type="button"
          onClick={onResend}
          className="text-cyan-600 font-medium hover:text-cyan-700 cursor-pointer"
        >
          Resend
        </button>
      </p>

      <button
        type="submit"
        disabled={
          isLoading || otp.some((digit) => !digit) || remainingTime === 0
        }
        className={`w-full py-3 rounded-lg transition-colors duration-200 font-medium text-white ${
          isLoading || otp.some((digit) => !digit) || remainingTime === 0
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
            Verifying...
          </span>
        ) : remainingTime === 0 ? (
          "OTP Expired"
        ) : (
          "Verify OTP"
        )}
      </button>

      {remainingTime === 0 && (
        <p className="text-center text-red-600 text-sm">
          Your OTP has expired. Please request a new one.
        </p>
      )}
    </form>
  );
}
