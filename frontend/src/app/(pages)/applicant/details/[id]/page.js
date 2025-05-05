"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/app/components/Header";
import axios from "axios";

export default function JobDetail() {
  const params = useParams();
  const jobId = params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [company, setCompany] = useState(null);
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setLoading(true);
        // Fetch job details
        const jobResponse = await axios.get(
          `https://unconscious-puma-universitas-gadjah-mada-f822e818.koyeb.app/jobs/${jobId}`
        );
        
        const jobData = jobResponse.data;
        setJob({
          title: jobData.job_title,
          description: jobData.description,
          requirements: jobData.required_skills || [],
          location: jobData.location,
          employmentType: jobData.employment_type,
          salaryRange: jobData.salary_range,
        });

        // Fetch company details using recruiter_id from job data
        const recruiterId = jobData.recruiter_id;
        const companyResponse = await axios.get(
          `https://unconscious-puma-universitas-gadjah-mada-f822e818.koyeb.app/recruiters/${recruiterId}`
        );
        
        const companyData = companyResponse.data;
        setCompany({
          title: companyData.company_name,
          image: "/image/map.png", // Default image - you might want to add this field to your API
          location: `${companyData.address?.street || ''}, ${companyData.address?.city || ''}, ${companyData.address?.state || ''}, ${companyData.address?.country || ''}`,
          employeeQuantity: "N/A", // Not in API data, could be added later
          industry: companyData.company_type,
          email: companyData.email,
          phone: companyData.phone,
          companyDescription: companyData.company_description,
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load job details. Please try again later.");
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobData();
    }
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-tr from-[#45D1DD] to-gray-300 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-blue-600" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-gray-700">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-tr from-[#45D1DD] to-gray-300 flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!company || !job) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-tr from-[#45D1DD] to-gray-300 flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Not Found</h2>
          <p className="text-gray-700">The job details you're looking for could not be found.</p>
          <button 
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-[#45D1DD] to-gray-300">
      {/* Header/Navigation */}
      <Header currentPage="browse-companies" />

      {/* Job Detail Content */}
      <div className="px-6 py-8">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
          {/* Left Column - Company Info */}
          <div className="w-full md:w-1/3">
            <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/30 p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-blue-600 mb-1">
                  {company.title}
                </h2>
                <div className="flex justify-center mb-4">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-white/50">
                    <Image
                      src={company.image}
                      alt="Company Location"
                      layout="fill"
                      objectFit="cover"
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 text-blue-500 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">{company.location}</p>
                  </div>
                </div>

                {company.employeeQuantity && (
                  <div className="flex items-center">
                    <div className="flex-shrink-0 text-blue-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
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
                    <div className="ml-3">
                      <p className="text-sm text-gray-700">
                        Employees: {company.employeeQuantity}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <div className="flex-shrink-0 text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">
                      Industry: {company.industry}
                    </p>
                  </div>
                </div>

                <div className="grid gap-2 mt-4">
                  <div className="flex justify-center items-center bg-white/40 rounded-lg p-2">
                    <div className="flex-shrink-0 text-blue-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
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
                    <div className="ml-2">
                      <p className="text-xs text-gray-700">{company.email}</p>
                    </div>
                  </div>

                  <div className="flex justify-center items-center bg-white/40 rounded-lg p-2">
                    <div className="flex-shrink-0 text-blue-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <p className="text-xs text-gray-700">{company.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200/50">
                <h3 className="font-medium text-gray-800 mb-3">
                  About Company
                </h3>
                <p className="text-sm text-gray-700">
                  {company.companyDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Job Details */}
          <div className="w-full md:w-2/3">
            <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/30 p-6 mb-6">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
                  {job.title}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.location && (
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                      {job.location}
                    </span>
                  )}
                  {job.employmentType && (
                    <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                      {job.employmentType}
                    </span>
                  )}
                  {job.salaryRange && (
                    <span className="bg-yellow-100 text-yellow-600 text-xs px-2 py-1 rounded-full">
                      {job.salaryRange}
                    </span>
                  )}
                </div>
                <p className="text-gray-700 mb-6">{job.description}</p>
              </div>

              {job.requirements && job.requirements.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-blue-600 mb-4">
                    Requirements
                  </h2>
                  <ul className="space-y-3">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 text-blue-500 mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <p className="ml-2 text-gray-700">{req}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg transition-colors duration-200 flex items-center shadow-lg">
                  <span className="mr-2">Submit CV</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}