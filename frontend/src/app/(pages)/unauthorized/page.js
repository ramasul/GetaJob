"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@auth/context";
import Loading from "@/app/components/Loading";
import Header from "@/app/components/Header";

const Unauthorized = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  const getDashboardLink = () => {
    if (user.user_type === "recruiter") {
      return "/recruiter/dashboard";
    } else if (user.user_type === "applier") {
      return "/home";
    } else {
      return "/dashboard";
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-cyan-400 to-cyan-200">
      {/* Header/Navigation */}
      <Header currentPage={"unauthorized"} userType={user?.user_type} />

      {/* Unauthorized Content */}
      <div className="px-6 py-8 flex items-center justify-center">
        <div className="w-full max-w-3xl mx-auto flex flex-col md:flex-row items-center bg-white/20 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/30 p-8">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <div className="relative w-64 h-64 mx-auto">
              <div className="absolute top-0 left-0 w-full h-full flex justify-center">
                <svg
                  className="w-full h-full text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
              Access Denied
            </h1>
            <p className="text-blue-800 opacity-80 mb-8">
              Sorry, you don&apos;t have permission to access this page. Please
              check your credentials or contact support for assistance.
            </p>

            {user ? (
              <Link
                href={getDashboardLink()}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition-colors duration-200"
              >
                Return to your dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition-colors duration-200"
              >
                Return to login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 mt-auto">
        <div className="w-full max-w-6xl mx-auto bg-white/20 backdrop-blur-md rounded-xl shadow-lg py-4 px-6 text-center text-gray-700 text-sm">
          <p>
            If you believe this is an error, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
