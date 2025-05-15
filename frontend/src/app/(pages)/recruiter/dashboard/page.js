"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Link from "next/link";
import { useAuth } from "@/app/auth/context";
import { useRouter, useSearchParams } from "next/navigation";
import { jobService } from "@/app/api/jobService";
import { applicationService } from "@/app/api/applicationService";
import { logService } from "@/app/api/logService";
import Loading from "@/app/components/Loading";

export default function DashboardCompany() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Get URL parameters with defaults
  const page = Number(searchParams.get("page")) || 1;
  const itemsPerPage = Number(searchParams.get("per_page")) || 10;

  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobStats, setJobStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        // Fetch jobs with pagination
        const jobsData = await jobService.getJobByRecruiterID(
          user.id,
          page,
          itemsPerPage
        );
        setJobs(jobsData);

        // Fetch total jobs count
        const total = await jobService.countJobsByRecruiterID(user.id);
        setTotalJobs(total);

        // Fetch stats for each job
        const stats = {};
        for (const job of jobsData) {
          const [applicants, views] = await Promise.all([
            applicationService.getApplierJobCount(job._id),
            logService.countJobViews(job._id),
          ]);
          stats[job._id] = { applicants, views };
        }
        setJobStats(stats);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id, page, itemsPerPage]);

  const handleStatusToggle = async (jobId, currentStatus, e) => {
    e.stopPropagation(); // Prevent row click when clicking the button
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await jobService.updateJob(jobId, { status: newStatus });

      // Update local state
      setJobs(
        jobs.map((job) =>
          job._id === jobId ? { ...job, status: newStatus } : job
        )
      );
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    router.push(`?${params.toString()}`);
  };

  const handlePerPageChange = (newPerPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("per_page", newPerPage);
    params.set("page", "1"); // Reset to first page
    router.push(`?${params.toString()}`);
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-cyan-50 text-cyan-700 border border-cyan-200";
      case "inactive":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-cyan-400 to-cyan-200">
      <Header currentPage="dashboard" userType="recruiter" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/30">
          {/* Header */}
          <div className="p-6 border-b border-white/30">
            <h2 className="text-2xl font-bold text-gray-800">Job List</h2>
          </div>

          {error ? (
            <div className="p-6 text-center text-red-600">Error: {error}</div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Job Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Applicants
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Views
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/5 divide-y divide-gray-200">
                    {jobs.map((job) => (
                      <tr
                        key={job._id}
                        onClick={() =>
                          router.push(`/recruiter/dashboard/${job._id}`)
                        }
                        className="hover:bg-white/20 transition-all duration-200 cursor-pointer group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 group-hover:text-cyan-700 transition-colors">
                            {job.job_title}
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
                          <div className="text-sm text-gray-700 group-hover:text-cyan-700 transition-colors">
                            {jobStats[job._id]?.applicants || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700 group-hover:text-cyan-700 transition-colors">
                            {jobStats[job._id]?.views || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={(e) =>
                              handleStatusToggle(job._id, job.status, e)
                            }
                            className={`cursor-pointer px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                              job.status === "active"
                                ? "bg-red-50 text-red-700 hover:bg-red-100 hover:shadow-md"
                                : "bg-cyan-50 text-cyan-700 hover:bg-cyan-100 hover:shadow-md"
                            }`}
                          >
                            {job.status === "active"
                              ? "Set Inactive"
                              : "Set Active"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white/10 px-4 py-3 flex items-center justify-between border-t border-white/30">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-2">View</span>
                  <select
                    className="cursor-pointer bg-white/20 border border-white/30 rounded-md text-sm text-gray-700 py-1 px-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    value={itemsPerPage}
                    onChange={(e) =>
                      handlePerPageChange(Number(e.target.value))
                    }
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                  <span className="text-sm text-gray-700 ml-2">per page</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={page === 1}
                    className="cursor-pointer disabled:cursor-not-allowed px-3 py-1 rounded-md text-sm font-medium bg-white/20 text-gray-700 hover:bg-white/30 disabled:opacity-50"
                  >
                    First
                  </button>
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="cursor-pointer disabled:cursor-not-allowed px-3 py-1 rounded-md text-sm font-medium bg-white/20 text-gray-700 hover:bg-white/30 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 rounded-md text-sm font-medium bg-cyan-50 text-cyan-700">
                    {page}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page * itemsPerPage >= totalJobs}
                    className="cursor-pointer disabled:cursor-not-allowed px-3 py-1 rounded-md text-sm font-medium bg-white/20 text-gray-700 hover:bg-white/30 disabled:opacity-50"
                  >
                    Next
                  </button>
                  <button
                    onClick={() =>
                      handlePageChange(Math.ceil(totalJobs / itemsPerPage))
                    }
                    disabled={page * itemsPerPage >= totalJobs}
                    className="cursor-pointer disabled:cursor-not-allowed px-3 py-1 rounded-md text-sm font-medium bg-white/20 text-gray-700 hover:bg-white/30 disabled:opacity-50"
                  >
                    Last
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Post Job Button */}
        <div className="mt-6 flex justify-end">
          <Link href="/recruiter/job-posting">
            <button className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
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
    </div>
  );
}
