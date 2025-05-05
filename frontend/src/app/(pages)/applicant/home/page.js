"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import axios from "axios";
import axiosInstance from "@/app/utils/api";


export default function JobSearch() {

  const [jobs, setJobs] = useState([]);
  const router = useRouter();

  // Sample job data
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axiosInstance.get("/jobs");

        // Transform the response to match your desired structure
        const transformedJobs = response.data.map((job, i) => ({
          id: job._id,
          title: job.job_title,
          company: job.company_name,
          location: job.location,
          salary: job.salary_range,
          description: job.description,
        }));

        setJobs(transformedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-[#45D1DD] to-gray-300">
      <Header currentPage="browse-companies" userType="applicant" />
      {/* Hero Section */}
      <div className="px-[2vw] py-[1.2vw]">
        <div className="w-[80vw] mx-auto flex flex-row items-center ">
          <div className="items-center justify-center">
            <h1 className="text-[4vw]/[4.3vw] font-bold text-blue-600 mb-[1vw]">
              Find a job that suits
              <br />
              your interest & skills.
            </h1>
            <p className="text-[1.5vw]/[1.7vw] text-blue-800 opacity-80 mb-[2vw] w-[40vw]">
              Aliquam vitae turpis in diam conguis finibus id at risus. Nullam
              in scelerisque leo, eget sollicitudin velit vestibulum.
            </p>

            {/* Search Form */}
            <div className="flex flex-row  items-center bg-white h-[4.5vw] rounded-[0.7vw] ">
              <div className="relative flex h-[3vw] border border-gray-300 rounded-md mx-[0.5vw]">
                <div className=" flex items-center pointer-events-none w-[0vw]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-500 absolute right-[1vw]"
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
                <input
                  type="text"
                  placeholder="Job title, Keyword..."
                  className="px-[1vw] text-[1.2vw] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black w-[30vw]"
                />
              </div>

              {/* Location Search bar */}
              {/* <div className="relative flex h-[3vw] border border-gray-300 rounded-md mx-[0.5vw]">
                <div className="mx-[1vw]  flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-500"
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
                <input
                  type="text"
                  placeholder="Your Location"
                  className="w-[10vw] px-[1vw]  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div> */}

              <button className="bg-blue-600 hover:bg-blue-700 text-white text-[1.1vw] py-[0.6vw] px-[1.2vw] rounded-md transition-colors duration-200 mx-[0.5vw] w-[8vw]">
                Find Job
              </button>
            </div>
          </div>

          <div className="mx-auto flex justify-center">
          <div className="relative">
                    <Image
                      src="/image/3DHero.png"
                      alt="Job Search"
                      width={250}
                      height={250}
                      className="relative z-10 w-[20vw]"
                      priority
                    />
                  </div>
          </div>
        </div>
      </div>
      {/* Job Listings */}
      <div className="px-6 py-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => router.push(`/applicant/details/${job.id}`)}
                className="bg-white/20 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/30 p-4 hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-400 flex-shrink-0 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">C</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{job.title}</h3>
                    <p className="text-gray-700 text-sm">{job.company}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-600 mr-1"
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
                    <span className="text-gray-700">{job.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-600 mr-1"
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
                    <span className="text-gray-700">{job.salary}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 line-clamp-3">
                  {job.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
