"use client";

import { useState } from "react";
import { z } from "zod";
import { forgotPasswordService } from "@/app/api/forgotPasswordService";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPasswordStepOne({
  email: initialEmail,
  onSubmit,
  setError,
}) {
  const [email, setEmail] = useState(initialEmail || "");
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setValidationError("");

    try {
      emailSchema.parse({ email });
      const response = await forgotPasswordService.requestPasswordReset(email);
      onSubmit(email);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setValidationError(err.errors[0].message);
      } else {
        console.error("Failed to send OTP", err);
        setError("Failed to send OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleEmailSubmit} className="space-y-4">
      <div className="relative">
        <input
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setValidationError("");
          }}
          placeholder="Enter your email address"
          className={`w-full px-4 py-3 pl-10 bg-white/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 border ${
            validationError ? "border-red-400" : "border-cyan-200"
          }`}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${validationError ? "text-red-500" : "text-cyan-500"}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        </div>
      </div>

      {validationError && (
        <p className="text-sm text-red-600 -mt-2">{validationError}</p>
      )}

      <p className="text-sm text-cyan-700">
        We'll send a one-time password to your email.
      </p>

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
            Sending OTP...
          </span>
        ) : (
          "Send OTP"
        )}
      </button>
    </form>
  );
}
