"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/auth/context";
import Header from "@/app/components/Header";
import Loading from "@/app/components/Loading";
import { applicationService } from "@/app/api/applicationService";
import { logService } from "@/app/api/logService";
import Image from "next/image";
import { DEFAULT_IMAGE } from "@/app/utils/constant";

export default function DashboardDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const { user } = useAuth();
  const jobId = params?.id;

  const page = Number(searchParams.get("page")) || 1;
  const itemsPerPage = Number(searchParams.get("per_page")) || 10;

  const [applicants, setApplicants] = useState([]);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    views: 0,
    applications: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id || !jobId) return;

      try {
        setLoading(true);

        // Fetch applicants with pagination
        const applicantsData = await applicationService.getJobApplier(
          jobId,
          page,
          itemsPerPage
        );
        setApplicants(applicantsData);

        // Fetch total applicants count
        const total = await applicationService.getApplierJobCount(jobId);
        setTotalApplicants(total);

        // Fetch job views
        const views = await logService.countJobViews(jobId);

        setStats({
          views: views,
          applications: total,
        });
      } catch (err) {
        console.error("Error fetching dashboard detail data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id, jobId, page, itemsPerPage]);

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

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-cyan-400 to-cyan-200">
      <Header currentPage="dashboard" userType="recruiter" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="lg:w-2/3 bg-white/20 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/30">
            <div className="p-6 border-b border-white/30">
              <h2 className="text-2xl font-bold text-gray-800">Applicants</h2>
            </div>

            {error ? (
              <div className="p-6 text-center text-red-600">Error: {error}</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-white/10">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Full Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Applied Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/5 divide-y divide-gray-200">
                      {applicants.map((application) => (
                        <tr
                          key={application._id}
                          className="hover:bg-white/20 transition-all duration-200 cursor-pointer group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <Image
                                  className="h-10 w-10 rounded-full"
                                  src={
                                    application.applier_details
                                      ?.profile_picture_url || DEFAULT_IMAGE
                                  }
                                  alt=""
                                  width={40}
                                  height={40}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 group-hover:text-cyan-700 transition-colors">
                                  {application.applier_details?.name ||
                                    "Unnamed Applicant"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 group-hover:text-cyan-700 transition-colors">
                            {new Date(
                              application.created_at
                            ).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() =>
                                  router.push(
                                    `/recruiter/dashboard/${jobId}/${application._id}`
                                  )
                                }
                                className="cursor-pointer text-cyan-600 hover:text-cyan-900 bg-cyan-50 hover:bg-cyan-100 px-4 py-2 rounded-md text-sm"
                              >
                                See Application
                              </button>
                            </div>
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
                      disabled={page * itemsPerPage >= totalApplicants}
                      className="cursor-pointer disabled:cursor-not-allowed px-3 py-1 rounded-md text-sm font-medium bg-white/20 text-gray-700 hover:bg-white/30 disabled:opacity-50"
                    >
                      Next
                    </button>
                    <button
                      onClick={() =>
                        handlePageChange(
                          Math.ceil(totalApplicants / itemsPerPage)
                        )
                      }
                      disabled={page * itemsPerPage >= totalApplicants}
                      className="cursor-pointer disabled:cursor-not-allowed px-3 py-1 rounded-md text-sm font-medium bg-white/20 text-gray-700 hover:bg-white/30 disabled:opacity-50"
                    >
                      Last
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Stats Section */}
          <div className="lg:w-1/3 space-y-6">
            {/* Total Views */}
            <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/30 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-cyan-700">
                  Total Views
                </h2>
                <div className="bg-cyan-600 rounded-full p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-800">
                  {stats.views}
                </span>
              </div>
              <p className="text-sm text-gray-700 mt-1">
                Total job listing views
              </p>
            </div>

            {/* Total Applied */}
            <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/30 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-cyan-700">
                  Total Applied
                </h2>
                <div className="bg-cyan-600 rounded-full p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-800">
                  {stats.applications}
                </span>
              </div>
              <p className="text-sm text-gray-700 mt-1">
                Total job applications
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
