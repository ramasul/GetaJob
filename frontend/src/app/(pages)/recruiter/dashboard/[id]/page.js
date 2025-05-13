'use client'

// pages/dashboard/index.js
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiSearch, FiMoreVertical, FiEye, FiMail, FiArrowUp, FiArrowDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Header from "@/app/components/Header";

export default function Dashboard() {
  const [applicants, setApplicants] = useState([
    { id: 1, name: 'Jake Gyll', status: 'In Review', applied: '13 July, 2021', avatar: '/avatars/jake.jpg' },
    { id: 2, name: 'Guy Hawkins', status: 'In Review', applied: '13 July, 2021', avatar: '/avatars/guy.jpg' },
    { id: 3, name: 'Cyndy Lillibridge', status: 'Shortlisted', applied: '12 July, 2021', avatar: '/avatars/cyndy.jpg' },
    { id: 4, name: 'Rodolfo Goode', status: 'Declined', applied: '11 July, 2021', avatar: '/avatars/rodolfo.jpg' },
    { id: 5, name: 'Jerome Bell', status: 'Interview', applied: '5 July, 2021', avatar: '/avatars/jerome.jpg' },
    { id: 6, name: 'Eleanor Pena', status: 'Declined', applied: '5 July, 2021', avatar: '/avatars/eleanor.jpg' },
    { id: 7, name: 'Darrell Steward', status: 'Shortlisted', applied: '3 July, 2021', avatar: '/avatars/darrell.jpg' },
    { id: 8, name: 'Floyd Miles', status: 'Interview', applied: '1 July, 2021', avatar: '/avatars/floyd.jpg' }
  ]);

  const [sortConfig, setSortConfig] = useState({
    key: 'applied',
    direction: 'desc'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedApplicants, setSelectedApplicants] = useState([]);

  const sortedApplicants = [...applicants].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (name) => {
    if (sortConfig.key === name) {
      return sortConfig.direction === 'asc' ? <FiArrowUp className="ml-1" /> : <FiArrowDown className="ml-1" />;
    }
    return null;
  };

  const toggleSelectAll = () => {
    if (selectedApplicants.length === applicants.length) {
      setSelectedApplicants([]);
    } else {
      setSelectedApplicants(applicants.map(applicant => applicant.id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedApplicants.includes(id)) {
      setSelectedApplicants(selectedApplicants.filter(item => item !== id));
    } else {
      setSelectedApplicants([...selectedApplicants, id]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Shortlisted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Interview':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Declined':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-200 to-cyan-300">
      <Head>
        <title>Recruitment Dashboard</title>
        <meta name="description" content="Applicant tracking system dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
         <Header currentPage="dashboard" userType="recruiter" />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="lg:w-2/3 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h2 className="text-lg font-semibold text-gray-900">Total Applicants: 19</h2>
                <div className="mt-3 sm:mt-0 w-full sm:w-auto flex gap-2">
                  <div className="relative flex-1 sm:flex-initial">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search Applicants"
                    />
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span>Filter</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={selectedApplicants.length === applicants.length}
                          onChange={toggleSelectAll}
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        className="flex items-center font-medium text-gray-500 uppercase tracking-wider"
                        onClick={() => requestSort('name')}
                      >
                        Full Name {getSortIcon('name')}
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        className="flex items-center font-medium text-gray-500 uppercase tracking-wider"
                        onClick={() => requestSort('status')}
                      >
                        Hiring Stage {getSortIcon('status')}
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        className="flex items-center font-medium text-gray-500 uppercase tracking-wider"
                        onClick={() => requestSort('applied')}
                      >
                        Applied Date {getSortIcon('applied')}
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        className="flex items-center font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Action
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedApplicants.map((applicant) => (
                    <tr key={applicant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={selectedApplicants.includes(applicant.id)}
                          onChange={() => toggleSelect(applicant.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={applicant.avatar} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{applicant.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor(applicant.status)}`}>
                          {applicant.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {applicant.applied}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link href={`/dashboard/${applicant.id}`} className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-md text-sm">
                            See Application
                          </Link>
                          <button className="text-gray-400 hover:text-gray-500">
                            <FiMoreVertical />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-700">View</span>
                <select
                  className="border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="ml-2 text-sm text-gray-700">Applicants per page</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Previous</span>
                  <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-blue-500 bg-blue-500 text-sm font-medium text-white">
                  1
                </span>
                <button
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  onClick={() => setCurrentPage(2)}
                >
                  2
                </button>
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  onClick={() => setCurrentPage(Math.min(2, currentPage + 1))}
                  disabled={currentPage === 2}
                >
                  <span className="sr-only">Next</span>
                  <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="lg:w-1/3 space-y-6">
            {/* Traffic Channel */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 text-blue-600">Traffic channel</h2>
              <div className="relative h-48 w-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#eeeeee" strokeWidth="15" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#fbbf24" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="0" transform="rotate(-90 50 50)" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="130.624" transform="rotate(-90 50 50)" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="190.912" transform="rotate(-90 50 50)" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="238.64" transform="rotate(-90 50 50)" />
                  </svg>
                  <span className="absolute text-sm font-semibold bg-gray-700 text-white py-1 px-2 rounded">243</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-400 rounded-sm mr-2"></div>
                  <span className="text-sm text-gray-700">Direct: 48%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-400 rounded-sm mr-2"></div>
                  <span className="text-sm text-gray-700">Social: 23%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-400 rounded-sm mr-2"></div>
                  <span className="text-sm text-gray-700">Organic: 24%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-400 rounded-sm mr-2"></div>
                  <span className="text-sm text-gray-700">Other: 5%</span>
                </div>
              </div>
            </div>

            {/* Total Views */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-blue-600">Total Views</h2>
                <div className="bg-blue-500 rounded-full p-1">
                  <FiEye className="text-white h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-800">23,564</span>
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  +6.4%
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">vs last day</p>
            </div>

            {/* Total Applied */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-blue-600">Total Applied</h2>
                <div className="bg-purple-500 rounded-full p-1">
                  <FiMail className="text-white h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-800">132</span>
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                  -0.4%
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">vs last day</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}