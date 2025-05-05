"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Assuming you'll have a register function in your auth context
// import { useAuth } from "@auth/context";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("applier");
  const [error, setError] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  // const { register, error: authError, user } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Check password match when either password or confirmPassword changes
    if (name === "password" || name === "confirmPassword") {
      if (name === "confirmPassword" && value !== formData.password) {
        setPasswordMatch(false);
      } else if (name === "password" && value !== formData.confirmPassword && formData.confirmPassword) {
        setPasswordMatch(false);
      } else {
        setPasswordMatch(true);
      }
    }
  };

  // Similar to login page, redirect if user is already logged in
  // useEffect(() => {
  //   if (user) {
  //     let dashboardPath = "/";
  //
  //     if (user.user_type === "recruiter") {
  //       dashboardPath = "/recruiter/dashboard";
  //     } else if (user.user_type === "applier") {
  //       dashboardPath = "/applicant/home";
  //     }
  //
  //     router.push(dashboardPath);
  //   }
  // }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      setError("Passwords do not match");
      return;
    }
    
    // Validate password strength (optional)
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call your registration API
      // await register(formData.username, formData.password, activeTab);
      console.log("Registering user:", {
        username: formData.username,
        password: formData.password,
        userType: activeTab
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to login page after successful registration
      router.push("/login");
    } catch (err) {
      console.error("Registration failed", err);
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-cyan-300 to-cyan-500 flex items-center justify-center p-4">
      <div className="w-[60vw] bg-white backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/30">
        <div className="p-6 flex items-center justify-center">
          {/* Logo and branding */}
          <div className="flex flex-col justify-center items-center w-[20vw] mx-auto">
            <Image
              src="/image/3DHero.png"
              alt="Register"
              width={500}
              height={500}
              className="relative z-10 w-full h-auto scale-[0.8]"
              priority
            />
            <span className="text-blue-600 text-xl font-bold ml-2">
              Get a Job
            </span>
          </div>

          <div className="flex flex-col w-[30vw] items-center justify-center">
            <h1 className="text-2xl font-bold text-cyan-700 mb-4">Create Account</h1>
            
            <div className="flex w-full max-w-xs mb-6 bg-white/30 rounded-full p-1 border border-cyan-500">
              <button
                onClick={() => setActiveTab("applier")}
                className={`py-2 px-4 w-1/2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === "applier"
                    ? "bg-cyan-500 text-white"
                    : "text-gray-600 hover:bg-white/20"
                }`}
              >
                Applier
              </button>
              <button
                onClick={() => setActiveTab("recruiter")}
                className={`py-2 px-4 w-1/2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === "recruiter"
                    ? "bg-cyan-500 text-white"
                    : "text-gray-600 hover:bg-white/20"
                }`}
              >
                Recruiter
              </button>
            </div>

            {/* Registration form */}
            <form onSubmit={handleSubmit} className="w-[28vw] space-y-4">
              {error && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              
              {/* Username field */}
              <div className="relative text-cyan-500">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full px-4 py-3 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-10"
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

              {/* Password field */}
              <div className="relative text-cyan-500">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-10"
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

              {/* Confirm Password field */}
              <div className="relative text-cyan-500">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={`w-full px-4 py-3 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-10 ${
                    !passwordMatch && formData.confirmPassword 
                      ? "border-2 border-red-500" 
                      : ""
                  }`}
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${!passwordMatch && formData.confirmPassword ? "text-red-500" : "text-cyan-500"}`}
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
                {!passwordMatch && formData.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !passwordMatch}
                className={`w-full py-3 rounded-lg transition-colors duration-200 font-medium text-white ${
                  isLoading || !passwordMatch
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-cyan-500 hover:bg-cyan-600"
                }`}
              >
                {isLoading ? "Creating Account..." : "Register"}
              </button>
            </form>

            <p className="text-center text-cyan-800 mt-6 text-sm">
              Sudah memiliki akun?{" "}
              <Link href="/" className="text-blue-600 font-medium">
                login disini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}