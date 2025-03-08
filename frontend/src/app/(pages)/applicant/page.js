"use client"

import Image from "next/image";
import { useState } from "react";

export default function JobSearch() {
  // Sample job data
  const jobs = Array(15).fill().map((_, i) => ({
    id: i + 1,
    title: "Data Analyst",
    company: "Canva",
    location: "Sleman, Yogyakarta",
    salary: "IDR3.000.000/mo",
    description: "Canva is looking for Lead Engineer to help develop and orchestrate the visual and experience design of our products."
  }));

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-cyan-300 to-cyan-500">
      {/* Header/Navigation */}
      <div className="px-6 py-4">
        <div className="w-full max-w-6xl mx-auto bg-white/20 backdrop-blur-md rounded-full shadow-lg py-2 px-4">
          <div className="flex items-center">
            <div className="flex items-center mr-6">
              <div className="bg-blue-500 rounded-full p-2 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <nav className="text-sm font-medium">
                <a href="#" className="text-blue-600 mr-4">Profile</a>
                <a href="#" className="text-gray-700">Browse Companies</a>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-6 py-8">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 mb-4">
              Find a job that suits<br />your interest & skills.
            </h1>
            <p className="text-blue-800 opacity-80 mb-8 max-w-lg">
              Aliquam vitae turpis in diam conguis finibus id at risus. Nullam in scelerisque leo, eget sollicitudin velit vestibulum.
            </p>
            
            {/* Search Form */}
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Job title, Keyword..."
                  className="w-full pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Your Location"
                  className="w-full pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200">
                Find Job
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-64 h-64">
              <div className="absolute top-0 left-0 w-full h-full flex justify-center">
                <div className="relative">
         
                  <div className="relative">
                    <Image
                      src="/image/3DHero.png"
                      alt="Job Search"
                      width={250}
                      height={250}
                      className="relative z-10"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="px-6 py-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map(job => (
              <div key={job.id} className="bg-white/20 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/30 p-4 hover:shadow-xl transition-shadow duration-200">
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">{job.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{job.salary}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 line-clamp-3">{job.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}