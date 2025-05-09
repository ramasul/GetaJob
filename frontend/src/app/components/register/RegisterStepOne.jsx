"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const stepOneSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .refine((val) => !val.includes("@"), {
        message: "Username cannot be in email format",
      })
      .refine((val) => !/\s/.test(val), {
        message: "Username must not contain whitespace",
      }),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function RegisterStepOne({
  formData,
  updateFormData,
  nextStep,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(stepOneSchema),
    mode: "onChange",
    defaultValues: {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.password,
    },
  });

  const onSubmit = (data) => {
    const { confirmPassword, ...stepData } = data;
    updateFormData(stepData);
    nextStep();
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-cyan-700">
        Account Information
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-cyan-700 mb-1">
            Username*
          </label>
          <div className="relative text-cyan-500">
            <input
              {...register("username")}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-9 sm:pl-10 border border-cyan-200"
              placeholder="johndoe (min 3 characters)"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500"
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
          {errors.username && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-700 mb-1">
            Email Address*
          </label>
          <div className="relative text-cyan-500">
            <input
              {...register("email")}
              type="email"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-9 sm:pl-10 border border-cyan-200"
              placeholder="john@example.com"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-700 mb-1">
            Password*
          </label>
          <div className="relative text-cyan-500">
            <input
              {...register("password")}
              type="password"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-9 sm:pl-10 border border-cyan-200"
              placeholder="Min 8 characters"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500"
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
          {errors.password && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-700 mb-1">
            Confirm Password*
          </label>
          <div className="relative text-cyan-500">
            <input
              {...register("confirmPassword")}
              type="password"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-9 sm:pl-10 border border-cyan-200"
              placeholder="Confirm password"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500"
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
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 sm:py-3 px-4 rounded-lg transition font-medium cursor-pointer"
          >
            Continue
          </button>
          <p className="text-xs sm:text-sm text-cyan-800 mt-3 sm:mt-4 text-center">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-cyan-600 hover:underline font-medium"
            >
              Log in
            </a>
          </p>
          <p className="text-xs sm:text-sm text-cyan-800 mt-2 sm:mt-3 text-center">
            Registrating as a recruiter?{" "}
            <a
              href="/register/recruiter"
              className="text-cyan-600 hover:underline font-medium"
            >
              Click here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
