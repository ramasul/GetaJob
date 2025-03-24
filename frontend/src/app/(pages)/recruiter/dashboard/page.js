"use client";

import Image from "next/image";
import { useState } from "react";
import Header from "@/app/components/Header";
import Link from "next/link";

export default function DashboardCompany() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sample job data
  const jobs = [
    {
      id: 1,
      role: "Social Media Assistant",
      status: "Live",
      datePosted: "20 May 2020",
      dueDate: "24 May 2020",
      jobType: "Fulltime",
      applicants: 19,
      needs: "4 / 11",
    },
    {
      id: 2,
      role: "Senior Designer",
      status: "Live",
      datePosted: "16 May 2020",
      dueDate: "24 May 2020",
      jobType: "Fulltime",
      applicants: 1234,
      needs: "0 / 20",
    },
    {
      id: 3,
      role: "Visual Designer",
      status: "Live",
      datePosted: "15 May 2020",
      dueDate: "24 May 2020",
      jobType: "Freelance",
      applicants: 2435,
      needs: "1 / 5",
    },
    {
      id: 4,
      role: "Data Sience",
      status: "Closed",
      datePosted: "13 May 2020",
      dueDate: "24 May 2020",
      jobType: "Freelance",
      applicants: 6234,
      needs: "10 / 10",
    },
    {
      id: 5,
      role: "Kotlin Developer",
      status: "Closed",
      datePosted: "12 May 2020",
      dueDate: "24 May 2020",
      jobType: "Fulltime",
      applicants: 12,
      needs: "20 / 20",
    },
    {
      id: 6,
      role: "React Developer",
      status: "Closed",
      datePosted: "11 May 2020",
      dueDate: "24 May 2020",
      jobType: "Fulltime",
      applicants: 14,
      needs: "10 / 10",
    },
  ];

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Live":
        return "bg-cyan-50 text-cyan-500 border border-cyan-200";
      case "Closed":
        return "bg-red-50 text-red-500 border border-red-200";
      default:
        return "bg-gray-50 text-gray-500 border border-gray-200";
    }
  };

  // Get job type badge color
  const getJobTypeBadgeColor = (jobType) => {
    switch (jobType) {
      case "Fulltime":
        return "bg-indigo-50 text-indigo-500 border border-indigo-200";
      case "Freelance":
        return "bg-amber-50 text-amber-500 border border-amber-200";
      default:
        return "bg-gray-50 text-gray-500 border border-gray-200";
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-[#45D1DD] to-gray-300">
      {/* Use your existing Header component */}
      <Header currentPage="dashboard" userType="recruiter" />

      {/* Job List Container */}
      <div className="w-[90vw]  mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Job List Header */}
          <div className="p-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Job List</h2>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
            </button>
          </div>

          {/* Job List Table */}
          <div className="overflow-x-auto scale-[0.98]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Roles
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date Posted
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Due Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Job Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Applicants
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Needs
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {job.role}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusBadgeColor(job.status)}`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {job.datePosted}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{job.dueDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getJobTypeBadgeColor(job.jobType)}`}
                      >
                        {job.jobType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {job.applicants}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{job.needs}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-500 hover:text-gray-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">View</span>
              <div className="relative">
                <select
                  className="appearance-none h-8 rounded border-gray-300 py-0 pl-3 pr-8 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={40}>40</option>
                  <option value={50}>50</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-gray-500">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <span className="text-sm text-gray-700 ml-2">
                Applicants per page
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-none text-white bg-indigo-600 hover:bg-indigo-700">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Job Button */}
      <div className="max-w-7xl mx-auto px-4 pb-8 flex justify-end">
        <Link href="/recruiter/job-posting">
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Post a job
          </button>
        </Link>
      </div>
    </div>
  );
}
