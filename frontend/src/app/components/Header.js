"use client";

export default function Header({ currentPage, userType }) {
  // Define menu items based on user type
  const menuItems =
    userType === "recruiter"
      ? [
          { name: "Company Profile", href: "/company-profile", key: "company-profile" },
          { name: "Dashboard", href: "/dashboard", key: "dashboard" },
        ]
      : [
          { name: "Profile", href: "/profile", key: "profile" },
          { name: "Browse Companies", href: "/browse-companies", key: "browse-companies" },
        ];

  return (
    <div className="px-6 py-4">
      <div className="w-full max-w-6xl mx-auto bg-white/20 backdrop-blur-md rounded-full shadow-lg py-2 px-4">
        <div className="flex items-center">
          <div className="flex items-center mr-6">
            <div className="bg-blue-500 rounded-full p-2 mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
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
            <nav className="text-sm font-medium flex space-x-4 px-[2vw]">
              {menuItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className={`${
                    currentPage === item.key ? "text-blue-600 font-bold" : "text-gray-700"
                  } ${currentPage === "browse-companies" && item.key === "browse-companies" ? "text-blue-600" : ""}`}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
