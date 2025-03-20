"use client"

import Image from "next/image";
import { useState } from "react";

export default function JobDetail() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-[#45D1DD] to-gray-300">
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
            <div className="ml-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Job title, keyword, company"
                  className="w-64 py-2 px-4 pr-10 rounded-full bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Detail Content */}
      <div className="px-6 py-8">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
          {/* Left Column - Company Info */}
          <div className="w-full md:w-1/3">
            <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/30 p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-blue-600 mb-1">Nomad.Co</h2>
                <div className="flex justify-center mb-4">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-white/50">
                    <Image
                      src="/image/map.png"
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">
                      Jl. Kaliurang Km. 5, Jl. Pandega Karya No.18A 6, Caturtunggal, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">Employees: 4000+</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">Industry: Social & Non-Profit</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="flex items-center bg-white/40 rounded-lg p-2">
                    <div className="flex-shrink-0 text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <p className="text-xs text-gray-700">nomad@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-white/40 rounded-lg p-2">
                    <div className="flex-shrink-0 text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <p className="text-xs text-gray-700">+0274 0129141</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200/50">
                <h3 className="font-medium text-gray-800 mb-3">About Company</h3>
                <p className="text-sm text-gray-700">
                  Nomad is a software platform for starting and running internet businesses. Millions of users rely on Nomad's software tools to accept payments, expand globally, and manage their businesses online. Stripe has been at the forefront of expanding internet commerce, powering new business models and supporting the latest platforms, from marketplaces to mobile commerce sites. We believe that growing the GDP of the internet is a problem rooted in code and design, not finance.
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Column - Job Details */}
          <div className="w-full md:w-2/3">
            <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/30 p-6 mb-6">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">AI Engineer / Data Scientist</h1>
                <p className="text-gray-700 mb-6">
                  We are looking for an AI Engineer to research and develop artificial intelligence products. 
                  We will work together in a team to transform business needs to production-ready 
                  deliverables. In this role, you should be highly analytical with a knack for deep learning, 
                  machine learning, mathematics, statistics, and software engineering. You are expected 
                  to have the skills of a Data Scientist and a Machine Learning Engineer. Additionally, you 
                  should have working knowledge and experience in either Computer Vision or NLP.
                </p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-bold text-blue-600 mb-4">Requirement</h2>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 text-blue-500 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-2 text-gray-700">
                      Conduct research to stay current with advances in the field of AI (especially 
                      computer vision and large language models (LLMs)) and apply new techniques to 
                      improve existing systems.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 text-blue-500 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-2 text-gray-700">
                      Collaborate with other roles (PM, SDE, SRE) to integrate AI (especially computer vision 
                      and large language models (LLMs)) systems into products and applications.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 text-blue-500 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-2 text-gray-700">Solve complex problems using a data-driven approach.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 text-blue-500 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-2 text-gray-700">Produce clean and efficient code.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 text-blue-500 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-2 text-gray-700">Verify and deploy programs and systems.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 text-blue-500 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-2 text-gray-700">Identify valuable data sources and automate collection processes.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 text-blue-500 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-2 text-gray-700">Integrate software components and third-party programs.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 text-blue-500 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-2 text-gray-700">Create technical documentation for reference and reporting.</p>
                  </li>
                </ul>
              </div>
              
              <div className="flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg transition-colors duration-200 flex items-center shadow-lg">
                  <span className="mr-2">Submit CV</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
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