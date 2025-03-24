"use client";

import Image from "next/image";
import { useState } from "react";
import Header from "@/app/components/Header";

export default function PostingJob() {
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    companyName: "",
    companyLogo: null,
    city: "",
    salaryMin: "5,000",
    salaryMax: "22,000",
    locationDetailed: "",
    employeeCount: "",
    industry: "",
    email: "",
    phoneNumber: "",
    companyDescription: "",
    jobRequirements: [""],
  });

  const [previewLogo, setPreviewLogo] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        companyLogo: file,
      });

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddRequirement = () => {
    setFormData({
      ...formData,
      jobRequirements: [...formData.jobRequirements, ""],
    });
  };

  const handleRequirementChange = (index, value) => {
    const updatedRequirements = [...formData.jobRequirements];
    updatedRequirements[index] = value;

    setFormData({
      ...formData,
      jobRequirements: updatedRequirements,
    });
  };

  const handleRemoveRequirement = (index) => {
    const updatedRequirements = formData.jobRequirements.filter(
      (_, i) => i !== index
    );

    setFormData({
      ...formData,
      jobRequirements: updatedRequirements,
    });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    // Handle form submission or navigation to next step
    console.log("Form data:", formData);
    // You would add your navigation or submission logic here
  };

  const [addedSkills, setAddedSkills] = useState([
    "Graphic Design",
    "Communication",
    "Illustrator",
  ]);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim() !== "" && !addedSkills.includes(newSkill)) {
      setAddedSkills([...addedSkills, newSkill]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setAddedSkills(addedSkills.filter((s) => s !== skill));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-[#45D1DD] to-blue-300 pb-10">
      {/* Use your existing Header component */}
      <Header currentPage="dashboard" userType="recruiter" />

      <div className="max-w-6xl mx-auto p-4">
        <form onSubmit={handleNextStep}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <label className="block mb-1 font-semibold text-blue-700">Job Title</label>
                <p className="text-sm text-blue-500 mb-1">
                  Job titles must describe one position
                </p>
                <input
                  type="text"
                  name="jobTitle"
                  placeholder="e.g. Software Engineer"
                  className="w-full border rounded-md p-2 text-blue-600"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block mb-1 font-semibold text-blue-700">Salary</label>
                <p className="text-sm text-blue-500 mb-1">
                  Please specify the estimated salary range for the role. *You
                  can leave this blank
                </p>
                <div className="flex items-center">
                  <div className="flex items-center">
                    <span className="mr-2 text-blue-600">$</span>
                    <input
                      type="text"
                      name="salaryMin"
                      className="border rounded-md p-2 w-24 text-blue-600"
                      value={formData.salaryMin}
                      onChange={handleInputChange}
                    />
                  </div>
                  <span className="mx-4 text-blue-600">to</span>
                  <div className="flex items-center">
                    <span className="mr-2 text-blue-600">$</span>
                    <input
                      type="text"
                      name="salaryMax"
                      className="border rounded-md p-2 w-24 text-blue-600"
                      value={formData.salaryMax}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-1 font-semibold text-blue-700">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Your company name"
                  className="w-full border rounded-md p-2 text-blue-600"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block mb-1 font-semibold text-blue-700">Company Logo</label>
                <div className="flex items-center">
                  <div className="mr-4 w-16 h-16 border rounded-md flex items-center justify-center overflow-hidden">
                    {previewLogo ? (
                      <img
                        src={previewLogo}
                        alt="Logo Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-blue-400">Logo</span>
                    )}
                  </div>
                  <label className="cursor-pointer bg-blue-100 text-blue-700 px-4 py-2 rounded-md">
                    Upload Logo
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-1 font-semibold text-blue-700">
                  Location (City)
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. New York"
                  className="w-full border rounded-md p-2 text-blue-600"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block mb-1 font-semibold text-blue-700">
                  Detailed Location
                </label>
                <input
                  type="text"
                  name="locationDetailed"
                  placeholder="Full address"
                  className="w-full border rounded-md p-2 text-blue-600"
                  value={formData.locationDetailed}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-6">
                <label className="block mb-1 font-semibold text-blue-700">Employee Count</label>
                <input
                  type="text"
                  name="employeeCount"
                  placeholder="e.g. 50-100"
                  className="w-full border rounded-md p-2 text-blue-600"
                  value={formData.employeeCount}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-6">
                <label className="block mb-1 font-semibold text-blue-700">Industry</label>
                <input
                  type="text"
                  name="industry"
                  placeholder="e.g. Technology"
                  className="w-full border rounded-md p-2 text-blue-600"
                  value={formData.industry}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-6">
                <label className="block mb-1 font-semibold text-blue-700">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="contact@company.com"
                  className="w-full border rounded-md p-2 text-blue-600"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block mb-1 font-semibold text-blue-700">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="+1 123 456 7890"
                  className="w-full border rounded-md p-2 text-blue-600"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-6">
                <label className="block mb-1 font-semibold text-blue-700">
                  Company Description
                </label>
                <textarea
                  name="companyDescription"
                  placeholder="Tell us about your company"
                  rows="4"
                  className="w-full border rounded-md p-2 text-blue-600"
                  value={formData.companyDescription}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>

            {/* Right Column */}
            <div className="bg-white rounded-lg shadow-md p-6 h-[fit-content]">
              <h2 className="text-lg font-semibold text-blue-700 mb-2">Job Descriptions</h2>
              <div className="mb-6">
                <textarea
                  name="jobDescription"
                  placeholder="Enter job description"
                  rows="10"
                  className="w-full border rounded-md p-2 text-blue-600"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-blue-700 mb-2">
                  Job Requirements (Bullet Points)
                </h3>
                {formData.jobRequirements.map((req, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      placeholder="Add a requirement"
                      className="flex-1 border rounded-md p-2 text-blue-600"
                      value={req}
                      onChange={(e) =>
                        handleRequirementChange(index, e.target.value)
                      }
                    />
                    {formData.jobRequirements.length > 1 && (
                      <button
                        type="button"
                        className="ml-2 text-red-500"
                        onClick={() => handleRemoveRequirement(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="mt-2 text-indigo-600 flex items-center"
                  onClick={handleAddRequirement}
                >
                  <span className="mr-1">+</span> Add Requirement
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
            >
              Next Step
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
