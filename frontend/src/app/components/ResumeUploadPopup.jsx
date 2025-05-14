"use client";

import { useState, useRef } from "react";
import { uploadPdf } from "@/app/api/cloudinary";
import { applierService } from "@/app/api/applierService";
import { aiService } from "@/app/api/aiService";
import {
  ChevronDown,
  ChevronUp,
  Upload,
  X,
  Code,
  Award,
  School,
  Briefcase,
  User,
} from "lucide-react";

export default function ResumeUploadPopup({ onClose, userId }) {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [useOCR, setUseOCR] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    personal_information: false,
    skills: false,
    achievements: false,
    educations: false,
    experiences: false,
  });
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file) return "Please select a file";
    if (useOCR) {
      if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
        return "Only PDF, JPEG, or PNG files are allowed";
      }
    } else {
      if (file.type !== "application/pdf") return "Only PDF files are allowed";
    }
    if (file.size > 2 * 1024 * 1024) return "File size must be less than 2MB";
    return null;
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    const validationError = validateFile(selectedFile);

    if (validationError) {
      setError(validationError);
      setFile(null);
      setParsedData(null);
      return;
    }

    setError(null);
    setFile(selectedFile);
    setIsLoading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", selectedFile);

      const parsedResult = useOCR
        ? await aiService.parseResumeWithOCR(formData)
        : await aiService.parseResume(formData);
      setParsedData(parsedResult);
    } catch (err) {
      console.error("Error parsing resume:", err);
      setError("Failed to parse resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!file || !parsedData) return;

    setIsLoading(true);
    try {
      // Upload PDF to Cloudinary
      const secure_url = await uploadPdf(file, userId, "applier");

      // Prepare the data in the correct format
      const updateData = {
        resume_url: secure_url,
        resume_parsed: parsedData,
      };

      // Update resume data in database
      await applierService.updateResume(userId, updateData);

      onClose();
      // Refresh the page after successful upload
      window.location.reload();
    } catch (err) {
      console.error("Error saving resume:", err);
      setError("Failed to save resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const handleOCRClick = () => {
    setUseOCR(true);
    setFile(null);
    setParsedData(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 sm:p-8 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-cyan-700 mb-2">
            Upload Resume
          </h2>
          <p className="text-gray-600">
            {useOCR
              ? "Upload your resume in PDF, JPEG, or PNG format (max 2MB)"
              : "Upload your resume in PDF format (max 2MB, 3 pages)"}
          </p>
        </div>

        <div className="mb-6">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-cyan-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={useOCR ? ".pdf,.jpg,.jpeg,.png" : ".pdf"}
              className="hidden"
            />
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">
              {file ? file.name : "Click to select file"}
            </p>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
        </div>

        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Processing...</p>
          </div>
        )}

        {parsedData && !isLoading && (
          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
            {/* Personal Information */}
            <div className="bg-white p-6 rounded-xl border">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("personal_information")}
              >
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="font-medium text-gray-800">
                    Personal Information
                  </h3>
                </div>
                {expandedSections.personal_information ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </div>
              {expandedSections.personal_information && (
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(parsedData.personal_information || {}).map(
                      ([key, value]) => (
                        <div key={key}>
                          <p className="text-gray-500 text-sm mb-1">
                            {key.replace(/_/g, " ").toUpperCase()}
                          </p>
                          <p className="text-gray-800">{value || "N/A"}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white p-6 rounded-xl border">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("skills")}
              >
                <div className="flex items-center">
                  <Code className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="font-medium text-gray-800">Skills</h3>
                </div>
                {expandedSections.skills ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </div>
              {expandedSections.skills && (
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {parsedData.skills?.map((item, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-700">{item.skill}</p>
                      </div>
                    ))}
                    {(!parsedData.skills || parsedData.skills.length === 0) && (
                      <p className="text-gray-500 italic">No skills listed</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Achievements */}
            <div className="bg-white p-6 rounded-xl border">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("achievements")}
              >
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="font-medium text-gray-800">Achievements</h3>
                </div>
                {expandedSections.achievements ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </div>
              {expandedSections.achievements && (
                <div className="mt-4 pt-4 border-t">
                  <div className="space-y-4">
                    {parsedData.achievements?.map((item, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-800">
                            {item.achievement}
                          </h4>
                          <span className="text-gray-500 text-sm">
                            {item.date}
                          </span>
                        </div>
                      </div>
                    ))}
                    {(!parsedData.achievements ||
                      parsedData.achievements.length === 0) && (
                      <p className="text-gray-500 italic">
                        No achievements listed
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Education */}
            <div className="bg-white p-6 rounded-xl border">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("educations")}
              >
                <div className="flex items-center">
                  <School className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="font-medium text-gray-800">Education</h3>
                </div>
                {expandedSections.educations ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </div>
              {expandedSections.educations && (
                <div className="mt-4 pt-4 border-t">
                  <div className="space-y-4">
                    {parsedData.educations?.map((edu, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between mb-1">
                          <h4 className="font-medium text-gray-800">
                            {edu.institution}
                          </h4>
                          <span className="text-gray-500 text-sm">
                            {edu.start_date} - {edu.end_date}
                          </span>
                        </div>
                        <p className="text-gray-700">
                          {edu.field_of_study || "N/A"}
                        </p>
                        {edu.degree && (
                          <p className="text-gray-600 text-sm">{edu.degree}</p>
                        )}
                        {edu.gpa && edu.gpa !== "None" && (
                          <p className="text-gray-600 text-sm">
                            GPA: {edu.gpa}
                          </p>
                        )}
                      </div>
                    ))}
                    {(!parsedData.educations ||
                      parsedData.educations.length === 0) && (
                      <p className="text-gray-500 italic">
                        No education history listed
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Experience */}
            <div className="bg-white p-6 rounded-xl border">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("experiences")}
              >
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="font-medium text-gray-800">Experience</h3>
                </div>
                {expandedSections.experiences ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </div>
              {expandedSections.experiences && (
                <div className="mt-4 pt-4 border-t">
                  <div className="space-y-4">
                    {parsedData.experiences?.map((exp, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between mb-1">
                          <h4 className="font-medium text-gray-800">
                            {exp.position}
                          </h4>
                          <span className="text-gray-500 text-sm">
                            {exp.start_date} - {exp.end_date}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">
                          {exp.company} • {exp.location}
                        </p>
                        {exp.responsibilities &&
                          exp.responsibilities.length > 0 && (
                            <div>
                              <p className="text-gray-600 font-medium text-sm mb-1">
                                Responsibilities:
                              </p>
                              <ul className="list-disc list-inside text-gray-600 text-sm pl-2">
                                {exp.responsibilities.map((resp, idx) => (
                                  <li key={idx}>{resp}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>
                    ))}
                    {(!parsedData.experiences ||
                      parsedData.experiences.length === 0) && (
                      <p className="text-gray-500 italic">
                        No work experience listed
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={handleOCRClick}
            className="text-cyan-600 hover:text-cyan-700 text-sm font-medium cursor-pointer"
          >
            Can't upload your PDF or your PDF is an image? Click here
          </button>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!file || !parsedData || isLoading}
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
