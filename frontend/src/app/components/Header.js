"use client";
import { useAuth } from "@auth/context";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header({ currentPage, userType }) {
  const { logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems =
    userType === "recruiter"
      ? [
          {
            name: "Company Profile",
            href: "/recruiter/company-profile",
            key: "company-profile",
          },
          { name: "Dashboard", href: "/recruiter/dashboard", key: "dashboard" },
        ]
      : [
          { name: "Profile", href: "/applicant/profile", key: "profile" },
          {
            name: "Browse Companies",
            href: "/applicant/home",
            key: "browse-companies",
          },
        ];

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="px-4 py-3 sm:px-6 md:px-8">
      <div className="w-full mx-auto bg-white/20 backdrop-blur-md md:rounded-full rounded-3xl shadow-lg py-2 px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Left side: Logo and Nav (desktop) */}
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-full p-2 mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex text-sm lg:text-base font-medium space-x-2 lg:space-x-4 px-2 lg:px-6">
              {menuItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className={`${
                    currentPage === item.key
                      ? "text-blue-600 font-bold"
                      : "text-gray-700"
                  } ${
                    currentPage === "browse-companies" &&
                    item.key === "browse-companies"
                      ? "text-blue-600"
                      : ""
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex items-center text-gray-700 cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Right side: Logout (desktop) */}
          <button
            onClick={handleLogout}
            className="hidden md:block bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm lg:text-base font-semibold px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-full transition-colors duration-150 cursor-pointer"
          >
            Log out
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-2">
            <nav className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className={`${
                    currentPage === item.key
                      ? "text-blue-600 font-bold"
                      : "text-gray-700"
                  } px-2 py-1 rounded-lg block`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-2 py-1.5 rounded-lg mt-2 text-sm text-center transition-colors duration-150 cursor-pointer"
              >
                Log out
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
