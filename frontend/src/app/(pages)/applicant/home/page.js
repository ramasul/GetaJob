"use client";

import Image from "next/image";
import Header from "@/app/components/Header";
import ProfilePicturePopup from "@/app/components/ProfilePicturePopup";
import SkeletonGrid from "@/app/components/JobListSkeleton";
import NoJobsFound from "@/app/components/NoJobsFound";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { applierService } from "@/app/api/applierService";
import { jobService } from "@/app/api/jobService";
import { aiService } from "@/app/api/aiService";
import { useAuth } from "@auth/context";
import JobCarousel from "@/app/components/JobCarousel";
import { set } from "zod";
import Loading from "@/app/components/Loading";

export default function JobSearch() {
  const [jobs, setJobs] = useState([]);
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const job_per_page = 6;

  // Debounced search function
  const debouncedSearch = useCallback(
    (query) => {
      const timeoutId = setTimeout(() => {
        router.push(`/applicant/home?query=${query}&page=1`);
      }, 200);
      return () => clearTimeout(timeoutId);
    },
    [router]
  );

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (user && user.user_type === "applier") {
          const recommendations = await aiService.getJobRecommendations(
            user.id
          );
          const transformedJobRecommendations = recommendations.map((job) => ({
            id: job._id,
            title: job.job_title,
            company: job.company_name,
            location: job.location,
            salary: job.salary_range,
            description: job.description,
            profile_picture_url: job.profile_picture_url,
          }));
          setJobRecommendations(transformedJobRecommendations);
        }
      } catch (error) {
        console.error("Error fetching job recommendations:", error);
      }
    };

    const checkProfileAndFetchJobs = async () => {
      try {
        setIsLoading(true);
        // Check if user has profile picture
        if (user && user.user_type === "applier") {
          const applierData = await applierService.getApplierByID(user.id);
          if (!applierData.profile_picture_url) {
            setShowProfilePopup(true);
          }
        }

        // Get query params
        const query = searchParams.get("query") || "";
        const page = parseInt(searchParams.get("page")) || 1;

        setSearchQuery(query);
        setCurrentPage(page);
        // Fetch jobs

        await fetchRecommendations();
        const response = await jobService.searchJobsWithImage(
          query,
          page,
          job_per_page
        );
        const countResponse = await jobService.countJobs(query);
        const transformedJobs = response.map((job) => ({
          id: job._id,
          title: job.job_title,
          company: job.company_name,
          location: job.location,
          salary: job.salary_range,
          description: job.description,
          profile_picture_url: job.profile_picture_url,
        }));

        setJobs(transformedJobs);
        setTotalPages(Math.ceil(countResponse / job_per_page));
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkProfileAndFetchJobs();
  }, [user, searchParams]);

  const handlePageChange = (page) => {
    router.push(`/applicant/home?query=${searchQuery}&page=${page}`);
  };

  const handleClosePopup = () => {
    setShowProfilePopup(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-gradient-to-tr from-cyan-400 to-cyan-200">
        <Header currentPage="browse-companies" userType="applicant" />

        {/* Profile Picture Popup */}
        {showProfilePopup && <ProfilePicturePopup onClose={handleClosePopup} />}

        {/* Logo Section */}
        <div className="px-4 md:px-8 py-6 md:py-12">
          <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-cyan-700 mb-4">
                Find a job that suits
                <br />
                your interest & skills.
              </h1>
              <p className="text-base md:text-lg text-cyan-800 opacity-80 mb-6 max-w-xl">
                Discover opportunities that match your expertise and career
                goals. Start your journey to success today.
              </p>

              {/* Search Form */}
              <div className="w-full bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search jobs by title, keyword..."
                    className="w-full px-4 py-3 text-gray-700 bg-white border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-cyan-500 absolute right-4 top-1/2 transform -translate-y-1/2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative w-64 h-64 hidden md:block md:w-80 md:h-80">
                <Image
                  src="/image/3DHero.png"
                  alt="Job Search"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {user && user.user_type === "applier" && (
          <div className="px-4 md:px-8">
            <div className="w-full max-w-7xl mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-cyan-700 mb-8">
                For You
              </h1>
              {loading ? (
                <SkeletonGrid count={1} />
              ) : jobRecommendations.length === 0 ? (
                <SkeletonGrid count={1} />
              ) : (
                <>
                  <JobCarousel jobs={jobRecommendations} router={router} />
                </>
              )}
            </div>
          </div>
        )}

        {/* Job Listings */}
        <div className="px-4 md:px-8 py-8">
          <div className="w-full max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-cyan-700 mb-8">
              Newest Job
            </h1>
            {isLoading ? (
              <SkeletonGrid count={job_per_page} />
            ) : jobs.length === 0 ? (
              <NoJobsFound />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() =>
                        router.push(`/applicant/details/${job.id}`)
                      }
                      className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/30 p-6 hover:shadow-xl transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start mb-4">
                        <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center mr-3 bg-cyan-100">
                          {job.profile_picture_url ? (
                            <img
                              src={job.profile_picture_url}
                              alt="Company Logo"
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-cyan-600 font-bold text-lg">
                              {job.company.charAt(0)}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="font-bold text-cyan-800">
                            {job.title}
                          </h3>
                          <p className="text-cyan-600 text-sm">{job.company}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-cyan-500 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span className="text-cyan-700">{job.location}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-cyan-500 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-cyan-700">{job.salary}</span>
                        </div>
                      </div>

                      <p className="text-sm text-cyan-700 line-clamp-3">
                        {job.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages >= 1 && (
                  <div className="flex justify-center mt-8 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          disabled={page === currentPage}
                          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                            currentPage === page
                              ? "bg-cyan-600 text-white"
                              : "bg-white/90 text-cyan-700 hover:bg-cyan-100"
                          } disabled:cursor-not-allowed cursor-pointer`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
