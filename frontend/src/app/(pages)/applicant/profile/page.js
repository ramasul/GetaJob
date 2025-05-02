"use client";

import Image from "next/image";
import Header from "@/app/components/Header";

export default function Profile() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-[#45D1DD] to-gray-300">
      <Header currentPage="profile" userType="applicant" />

      <div className="px-6 py-8">
        <div className="w-[90vw] mx-auto flex flex-col lg:flex-row gap-6">
          {/* Left Panel - User Profile */}
          <div className="bg-white rounded-3xl shadow-md p-6 flex flex-col w-full lg:w-1/3">
            <Image
              src="/image/cvdummy.png"
              alt="Login"
              width={500}
              height={500}
              className="relative z-10 w-full h-auto scale-[1.2]"
              priority
            />
          </div>

          {/* Right Panel - Application History */}
          <div className="bg-white rounded-3xl shadow-md p-6 w-full lg:w-2/3 overflow-x-auto">
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              Applications History
            </h2>
            <div className="w-full">
              <table className="w-full table-auto text-sm text-left border-separate border-spacing-y-2">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="text-gray-600 border-b">
                    <th className="pb-3">#</th>
                    <th className="pb-3">Company Name</th>
                    <th className="pb-3">Roles</th>
                    <th className="pb-3">Date Applied</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: "Nomad",
                      role: "Social Media Assistant",
                      date: "24 July 2021",
                      status: "In Review",
                      color: "bg-yellow-100 text-yellow-800",
                    },
                    {
                      name: "Udacity",
                      role: "Social Media Assistant",
                      date: "20 July 2021",
                      status: "Shortlisted",
                      color: "bg-green-100 text-green-800",
                    },
                    {
                      name: "Packer",
                      role: "Social Media Assistant",
                      date: "16 July 2021",
                      status: "Offered",
                      color: "bg-blue-100 text-blue-800",
                    },
                    {
                      name: "Divvy",
                      role: "Social Media Assistant",
                      date: "14 July 2021",
                      status: "Interviewing",
                      color: "bg-yellow-100 text-yellow-800",
                    },
                    {
                      name: "DigitalOcean",
                      role: "Social Media Assistant",
                      date: "10 July 2021",
                      status: "Unsuitable",
                      color: "bg-red-100 text-red-800",
                    },
                  ].map((app, i) => (
                    <tr
                      key={i}
                      className="even:bg-gray-50 hover:bg-blue-50 transition-colors duration-200"
                    >
                      <td className="py-3">{i + 1}</td>
                      <td className="py-3 font-medium text-gray-800">
                        {app.name}
                      </td>
                      <td className="py-3 text-gray-900">{app.role}</td>
                      <td className="py-3 text-gray-600">{app.date}</td>
                      <td className="py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${app.color}`}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6 gap-2">
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 ${
                    page === 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}
              <span className="px-3 py-1 text-gray-500">...</span>
              <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 text-sm font-medium">
                33
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
