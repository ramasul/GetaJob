"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { forgotPasswordService } from "@/app/api/forgotPasswordService";
import { useAuth } from "@/app/auth/context";

const passwordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    // Yang di bawah ini kalau mau ngerese wkwk
    //   .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    //   .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    //   .regex(/[0-9]/, "Password must contain at least one number")
    //   .regex(
    //     /[^A-Za-z0-9]/,
    //     "Password must contain at least one special character"
    //   ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ForgotPasswordStepThree({
  email,
  otp,
  onSuccess,
  setError,
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setValidationErrors({});

    try {
      // Validate passwords
      passwordSchema.parse({ newPassword, confirmPassword });

      const response = await forgotPasswordService.resetPassword(
        email,
        otp,
        newPassword
      );

      onSuccess();
      await login(email, newPassword);
      router.push("/login?reset=success");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors = {};
        err.errors.forEach((error) => {
          errors[error.path[0]] = error.message;
        });
        setValidationErrors(errors);
      } else {
        console.error("Password reset failed", err);
        setError("Password reset failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id="newPassword"
          name="newPassword"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            setValidationErrors((prev) => ({ ...prev, newPassword: "" }));
          }}
          placeholder="New Password"
          className={`w-full px-4 py-3 pl-10 pr-10 bg-white/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 border ${
            validationErrors.newPassword ? "border-red-400" : "border-cyan-200"
          }`}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${validationErrors.newPassword ? "text-red-500" : "text-cyan-500"}`}
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
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-cyan-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-cyan-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                clipRule="evenodd"
              />
              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
            </svg>
          )}
        </button>
      </div>

      {validationErrors.newPassword && (
        <p className="text-sm text-red-600 -mt-2">
          {validationErrors.newPassword}
        </p>
      )}

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setValidationErrors((prev) => ({ ...prev, confirmPassword: "" }));
          }}
          placeholder="Confirm New Password"
          className={`w-full px-4 py-3 pl-10 bg-white/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 border ${
            validationErrors.confirmPassword
              ? "border-red-400"
              : "border-cyan-200"
          }`}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${validationErrors.confirmPassword ? "text-red-500" : "text-cyan-500"}`}
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

      {validationErrors.confirmPassword && (
        <p className="text-sm text-red-600 -mt-2">
          {validationErrors.confirmPassword}
        </p>
      )}

      <div className="mt-2 text-sm text-cyan-700">
        <p>Password must contain:</p>
        <ul className="list-disc ml-5 mt-1 space-y-1">
          <li className={newPassword.length >= 8 ? "text-green-600" : ""}>
            At least 8 characters
          </li>
          {/* Kalau mau rese banyak syarat hehe */}
          {/* <li className={/[A-Z]/.test(newPassword) ? "text-green-600" : ""}>
            At least one uppercase letter
          </li>
          <li className={/[a-z]/.test(newPassword) ? "text-green-600" : ""}>
            At least one lowercase letter
          </li>
          <li className={/[0-9]/.test(newPassword) ? "text-green-600" : ""}>
            At least one number
          </li>
          <li
            className={/[^A-Za-z0-9]/.test(newPassword) ? "text-green-600" : ""}
          >
            At least one special character
          </li> */}
        </ul>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 mt-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition duration-300 flex items-center justify-center cursor-pointer"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
            Processing...
          </>
        ) : (
          "Reset Password"
        )}
      </button>
    </form>
  );
}
