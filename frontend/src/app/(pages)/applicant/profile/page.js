"use client";

import Image from "next/image";
import Header from "@/app/components/Header";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function Profile() {
  return (
    <ProtectedRoute userType="applier">
      <div className="min-h-screen w-full bg-gradient-to-tr from-[#45D1DD] to-gray-300">
        <Header currentPage="profile" userType="applicant" />

        <div className="px-[3vw] py-[3vw]">
          <div className="w-[90vw] mx-auto flex  gap-6">
            {/* Left Panel - User Profile */}
            <div className="shadow-md p-[2vw] flex flex-col w-[30vw] ">
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
            <div className="flex flex-col ">
              <div className="bg-white rounded-3xl shadow-md p-[2vw] w-[60vw] h-[33vw] overflow-x-auto  ">
                <div>
                  <h2 className="text-[2vw] font-bold text-gray-700 mb-4">
                    Applications History
                  </h2>
                  <div className="w-full">
                    <table className="w-full table-auto text-sm text-left border-separate border-spacing-y-2">
                      <thead className="sticky top-0 bg-white z-10">
                        <tr className="text-gray-600 border-b text-[1.2vw]">
                          <th className="pb-3"></th>
                          <th className="pb-3">Company Name</th>
                          <th className="pb-3">Roles</th>
                          <th className="pb-3">Date Applied</th>
                          <th className="pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700 text-[1vw]">
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
                            className="even:bg-gray-50 hover:bg-blue-50 transition-colors duration-200 text-[1vw] py-[1vw]"
                          >
                            <td className="py-[1vw]">{i + 1}</td>
                            <td className="py-[1vw] font-medium text-gray-800">
                              {app.name}
                            </td>
                            <td className="py-[1vw] text-gray-900">
                              {app.role}
                            </td>
                            <td className="py-[1vw] text-gray-600">
                              {app.date}
                            </td>
                            <td className="py-[1vw]">
                              <span
                                className={`py-[0.2vw] px-[0.3vw] rounded-full text-xs font-semibold ${app.color} text-[1vw]`}
                              >
                                {app.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* Pagination */}
              <div className="flex justify-center items-center mt-[2vw] gap-[0.5vw] text-[1vw] overflow-x-auto">
                <button className="px-[1vw] py-[0.5vw] rounded-full bg-white hover:bg-gray-200 text-gray-700 font-medium">
                  &larr; Prev
                </button>

                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`px-[1vw] py-[0.5vw] rounded-full font-medium transition-colors ${
                      page === 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <span className="px-[1vw] py-[0.5vw] text-gray-500">...</span>

                <button className="px-[1vw] py-[0.5vw] rounded-full bg-white hover:bg-gray-200 text-gray-700 font-medium">
                  33
                </button>

                <button className="px-[1vw] py-[0.5vw] rounded-full bg-white hover:bg-gray-200 text-gray-700 font-medium">
                  Next &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
