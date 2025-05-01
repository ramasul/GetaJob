"use client";

import Image from "next/image";
import { useState } from "react";
import Header from "@/app/components/Header";

export default function PostingJob() {
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
    recruiter_id: "",
    status: "active"
  });

  const [newSkill, setNewSkill] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data to submit:", formData);
    // Submit to API logic here
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-[#45D1DD] to-blue-300 pb-10">
      <Header currentPage="dashboard" userType="recruiter" />

      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-blue-700 mb-6">Post a Job</h1>

          {[
            ["job_title", "Job Title"],
            ["company_name", "Company Name"],
            ["location", "Location"],
            ["employment_type", "Employment Type"],
            ["salary_range", "Salary Range"],
            ["age_range", "Age Range"],
            ["minimum_education", "Minimum Education"],
            ["gender", "Preferred Gender"],
            ["job_experience", "Job Experience"],
          ].map(([key, label]) => (
            <div className="mb-4" key={key}>
              <label className="block text-blue-700 font-semibold mb-1">{label}</label>
              <input
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 text-blue-600"
                required={key !== "gender" && key !== "salary_range" && key !== "age_range"}
              />
            </div>
          ))}

          <div className="mb-4">
            <label className="block text-blue-700 font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2 text-blue-600"
              rows={5}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-blue-700 font-semibold mb-1">Required Skills</label>
            <div className="flex mb-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 border rounded-md p-2 text-blue-600"
                placeholder="Add skill"
              />
              <button type="button" onClick={handleAddSkill} className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-md">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.required_skills.map((skill, index) => (
                <div key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center">
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="ml-2 text-red-500">×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700">
              Submit Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
