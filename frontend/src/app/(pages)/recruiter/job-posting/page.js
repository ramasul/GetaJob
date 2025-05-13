"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import { useAuth } from '@/app/auth/context';

export default function PostingJob() {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    job_title: "",
    company_name: "",
    location: "",
    employment_type: "",
    salary_range: "",
    age_range: "",
    minimum_education: "",
    required_skills: [],
    gender: "",
    job_experience: "",
    description: "",
    status: "active"
  });

  const [recruiterData, setRecruiterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch recruiter data when component mounts
  useEffect(() => {
    const fetchRecruiterData = async () => {
      if (!user || !user.id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`https://unconscious-puma-universitas-gadjah-mada-f822e818.koyeb.app/recruiters/${user.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch recruiter data');
        }
        
        const data = await response.json();
        setRecruiterData(data);
        
        // Prefill company name and location
        const location = data.address ? 
          `${data.address.city}, ${data.address.state}` : "";
          
        setFormData(prev => ({
          ...prev,
          company_name: data.company_name || "",
          location: location
        }));
      } catch (err) {
        console.error("Error fetching recruiter data:", err);
        setError("Failed to load profile data. Some fields may need to be filled manually.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiterData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() !== "" && !formData.required_skills.includes(newSkill)) {
      setFormData({
        ...formData,
        required_skills: [...formData.required_skills, newSkill],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData({
      ...formData,
      required_skills: formData.required_skills.filter((s) => s !== skill),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage("");

    try {
      if (!user || !user.id) {
        throw new Error("User not authenticated");
      }

      // Create submission data with current timestamp and user ID
      const submissionData = {
        ...formData,
        recruiter_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log("Submitting job data:", submissionData);

      // Send data to API
      const response = await fetch("https://unconscious-puma-universitas-gadjah-mada-f822e818.koyeb.app/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Job posted successfully:", result);
      
      setSuccessMessage("Job posted successfully!");
      
      // Clear form data
      setFormData({
        job_title: "",
        company_name: "",
        location: "",
        employment_type: "",
        salary_range: "",
        age_range: "",
        minimum_education: "",
        required_skills: [],
        gender: "",
        job_experience: "",
        description: "",
        status: "active"
      });

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/recruiter/dashboard");
      }, 2000);
      
    } catch (err) {
      console.error("Error posting job:", err);
      setError(err.message || "Failed to post job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Employment type options
  const employmentTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship",
    "Temporary"
  ];

  // Education level options
  const educationLevels = [
    "High School",
    "Diploma",
    "Bachelor's Degree",
    "Master's Degree",
    "PhD",
    "No Formal Education Required"
  ];

  // Gender options
  const genderOptions = [
    "Male",
    "Female",
    "Any"
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-[#45D1DD] to-blue-300 pb-10">
      <Header currentPage="dashboard" userType="recruiter" />

      <div className="max-w-4xl mx-auto p-4">
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="bg-white p-6 rounded-lg shadow-md flex justify-center items-center h-32">
            <div className="text-gray-600">Loading profile data...</div>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-700 mb-6">Post a Job</h1>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Job Title</label>
            <input
              type="text"
              name="job_title"
              value={formData.job_title}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2 text-gray-700"
              required
              placeholder="e.g. Frontend Developer"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Company Name</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2 text-gray-700 bg-gray-50"
              required
              placeholder="e.g. Tech Solutions Inc."
              readOnly
              title="Company name is automatically filled from your profile"
            />
            <p className="text-xs text-gray-500 mt-1">Auto-filled from your profile</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2 text-gray-700 bg-gray-50"
              required
              placeholder="e.g. Jakarta, Indonesia"
              readOnly
              title="Location is automatically filled from your profile"
            />
            <p className="text-xs text-gray-500 mt-1">Auto-filled from your profile</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Employment Type</label>
            <select
              name="employment_type"
              value={formData.employment_type}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2 text-gray-700"
              required
            >
              <option value="">Select Employment Type</option>
              {employmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Salary Range</label>
            <input
              type="text"
              name="salary_range"
              value={formData.salary_range}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2 text-gray-700"
              placeholder="e.g. Rp5.000.000 - Rp8.000.000"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Age Range</label>
            <input
              type="text"
              name="age_range"
              value={formData.age_range}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2 text-gray-700"
              placeholder="e.g. 20-35"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Minimum Education</label>
            <select
              name="minimum_education"
              value={formData.minimum_education}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2 text-gray-700"
              required
            >
              <option value="">Select Minimum Education</option>
              {educationLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Preferred Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2 text-gray-700"
            >
              <option value="">Select Gender Preference</option>
              {genderOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Job Experience</label>
            <input
              type="text"
              name="job_experience"
              value={formData.job_experience}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2 text-gray-700"
              required
              placeholder="e.g. 2-3 years in web development"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2 text-gray-700"
              rows={5}
              required
              placeholder="Describe the job responsibilities, qualifications, and any other relevant information..."
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Required Skills</label>
            <div className="flex mb-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 border rounded-md p-2 text-gray-700"
                placeholder="Add skill"
              />
              <button 
                type="button" 
                onClick={handleAddSkill} 
                className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.required_skills.map((skill, index) => (
                <div key={index} className="bg-blue-100 text-gray-700 px-3 py-1 rounded-full flex items-center">
                  {skill}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveSkill(skill)} 
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit" 
              className={`px-6 py-3 rounded-md text-white ${
                isSubmitting 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Submit Job"}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}