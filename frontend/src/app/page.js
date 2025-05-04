"use client";

import Image from "next/image";
import { useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@auth/context";

export default function Login() {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("applier");
  const { login, error, user } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (user) {
      let dashboardPath = "/"; // default kalau ada apa apa

      if (user.user_type === "recruiter") {
        dashboardPath = "/recruiter/dashboard";
      } else if (user.user_type === "applier") {
        dashboardPath = "/applicant/home";
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
    // Handle form submission (e.g., API call, etc.)
    console.log(formData);
    console.log("User type:", activeTab);
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
    <div className="min-h-screen w-full bg-gradient-to-b from-cyan-300 to-cyan-500 flex items-center justify-center p-4">
      <div className="w-[60vw] bg-white backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/30">
        <div className=" p-6 flex items-center justify-center">
          {/* Logo and branding */}
          <div className="flex flex-col justify-center items-center w-[20vw] mx-auto">
            <Image
              src="/image/3DHero.png"
              alt="Login"
              width={500}
              height={500}
              className="relative z-10 w-full h-auto scale-[0.8]"
              priority
            />
            <span className="text-blue-600 text-xl font-bold ml-2">
              Get a Job
            </span>
          </div>

          <div className=" flex flex-col w-[30vw] items-center justify-center">
            {/* Toggle Applier/Recruiter */}
            {/* <div className="flex w-full max-w-xs mb-6 bg-white/30 rounded-full p-1 border border-cyan-500">
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
            </div> */}

            {/* Login form */}
            <form onSubmit={handleSubmit} className="w-[28vw] space-y-4">
              {error && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <div className="relative text-cyan-500">
                <input
                  type="text"
                  id="identifier"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  placeholder="Username or Email"
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

              <div className="relative text-cyan-500">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-10 pr-10"
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

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg transition-colors duration-200 font-medium text-white ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-cyan-500 hover:bg-cyan-600"
                }`}
              >
                {isLoading ? "Logging in... wait" : "Login"}
              </button>
            </form>

            <p className="text-center text-cyan-800 mt-6 text-sm">
              Belum memiliki akun?{" "}
              <a href="/register" className="text-blue-600 font-medium">
                register disini
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
