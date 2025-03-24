// pages/applicants/[id].js
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Instagram, Twitter, Globe, ChevronDown } from 'lucide-react';
import Header from '@/app/components/Header';

export default function ApplicantDetails() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-300 to-cyan-100 py-8 px-4">
      <Head>
        <title>Applicant Details | Recruitment Dashboard</title>
        <meta name="description" content="Applicant profile details" />
      </Head>

      <Header currentPage="dashboard" userType="recruiter" />
        
      
      {/* Main Container */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        
        {/* Header Navigation */}
              
        {/* Main Content */}
        <div className="p-6">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Link href="/applicants" className="mr-3">
                <ArrowLeft className="h-6 w-6 text-gray-700" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Applicant Details</h1>
            </div>

          </div>
          
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column - Profile Card */}
            <div className="bg-white p-6 rounded-xl border">
              <div className="flex flex-col items-center mb-4">
                <div className="relative w-24 h-24 mb-3">
                  <Image 
                    src="/images/jerome-bell.jpg" 
                    alt="Jerome Bell" 
                    className="rounded-full object-cover"
                    fill
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Jerome Bell</h2>
                <p className="text-gray-500">Product Designer</p>
                <div className="flex items-center mt-1">
                  <div className="text-yellow-400">★</div>
                  <span className="ml-1 font-medium">4.0</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 font-medium">Applied Jobs</span>
                  <span className="text-gray-500 text-sm">2 days ago</span>
                </div>
                <div className="mt-3">
                  <h3 className="font-medium text-gray-800">Product Development</h3>
                  <div className="flex gap-2 text-sm mt-1">
                    <span className="text-gray-500">Marketing</span>
                    <span>•</span>
                    <span className="text-gray-500">Full-Time</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-800 mb-4">Contact</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-gray-500 text-sm">Email</p>
                      <a href="mailto:jeromeBell45@email.com" className="text-gray-800 text-sm hover:text-blue-600">
                        jeromeBell45@email.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-gray-500 text-sm">Phone</p>
                      <a href="tel:+441245572135" className="text-gray-800 text-sm hover:text-blue-600">
                        +44 1245 572 135
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Instagram className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-gray-500 text-sm">Instagram</p>
                      <a href="https://instagram.com/jeromebell" className="text-blue-600 text-sm hover:underline">
                        instagram.com/jeromebell
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Twitter className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-gray-500 text-sm">Twitter</p>
                      <a href="https://twitter.com/jeromebell" className="text-blue-600 text-sm hover:underline">
                        twitter.com/jeromebell
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Globe className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-gray-500 text-sm">Website</p>
                      <a href="https://www.jeromebell.com" className="text-blue-600 text-sm hover:underline">
                        www.jeromebell.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Detailed Information */}
            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-xl border mb-6">
                <h3 className="font-medium text-gray-800 mb-4">Personal Info</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Full Name</p>
                    <p className="text-gray-800">Jerome Bell</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Gender</p>
                    <p className="text-gray-800">Male</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Date of Birth</p>
                    <p className="text-gray-800">March 23, 1995 <span className="text-gray-500 text-sm">(26 y.o)</span></p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Language</p>
                    <p className="text-gray-800">English, French, Bahasa</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <p className="text-gray-500 text-sm mb-1">Address</p>
                    <p className="text-gray-800">4517 Washington Ave.</p>
                    <p className="text-gray-800">Manchester, Kentucky 39495</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border">
                <h3 className="font-medium text-gray-800 mb-4">Professional Info</h3>
                
                <div className="mb-6">
                  <p className="text-gray-500 text-sm mb-2">About Me</p>
                  <p className="text-gray-700 mb-3">
                    I'm a product designer + filmmaker currently working remotely at Twitter from beautiful Manchester, United Kingdom. I'm passionate about designing digital products that have a positive impact on the world.
                  </p>
                  <p className="text-gray-700">
                    For 10 years, I've specialised in interface, experience & interaction design as well as working in user research and product strategy for product agencies, big tech companies & start-ups.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Current Job</p>
                    <p className="text-gray-800">Product Designer</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Experience in Years</p>
                    <p className="text-gray-800">4 Years</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Highest Qualification Held</p>
                    <p className="text-gray-800">Bachelors in Engineering</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Skill set</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                        Project Management
                      </span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                        Copywriting
                      </span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                        English
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}