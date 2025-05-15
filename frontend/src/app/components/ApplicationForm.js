"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { applierService } from "@/app/api/applierService";
import { applicationService } from "@/app/api/applicationService";
import { useAuth } from "@/app/auth/context";
import { z } from "zod";
import {
  ChevronDown,
  ChevronUp,
  Code,
  Award,
  School,
  Briefcase,
  User,
  X,
} from "lucide-react";

const applicationSchema = z.object({
  document_url: z.string().url().optional().or(z.literal("")),
  motivational_letter: z
    .string()
    .min(1, "Motivational letter is required")
    .max(900, "Motivational letter must be less than 900 characters"),
});

export default function ApplicationForm({ jobId, onClose }) {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [applier, setApplier] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [formData, setFormData] = useState({
    document_url: "",
    motivational_letter: "",
  });
  const [errors, setErrors] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    personal: false,
    skills: false,
    achievements: false,
    education: false,
    experience: false,
  });

  useEffect(() => {
    const fetchApplierData = async () => {
      try {
        const response = await applierService.getApplierByID(user.id);
        setApplier({
          ...response,
          resume_parsed: response.resume_parsed || {},
        });
      } catch (error) {
        console.error("Error fetching applier data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchApplierData();
    }
  }, [user]);

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const validateForm = () => {
    try {
      applicationSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await applicationService.addApplication({
        applier_id: applier._id,
        job_id: jobId,
        document_url: formData.document_url || null,
        motivational_letter: formData.motivational_letter,
      });
      showToastMessage("Your application has been submitted successfully!");
      setTimeout(() => {
        onClose();
        router.push(`/applicant/details/${jobId}`);
      }, 1000);
    } catch (error) {
      console.error("Error submitting application:", error);
      setErrors({ submit: error.response.data.detail });
      showToastMessage(
        error.response.data.detail || "Failed to submit application",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
            toastType === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
          style={{
            animation: "slideIn 0.3s ease-out",
          }}
        >
          {toastMessage}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-cyan-700">
            Submit Application
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-cyan-700 mb-4">
                  Use your current resume?
                </h3>
                {applier?.resume_url ? (
                  <div className="space-y-4">
                    <a
                      href={applier.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-600 hover:text-cyan-700"
                    >
                      View Current Resume
                    </a>

                    {/* Resume Preview Sections */}
                    <div className="space-y-4">
                      <DropdownSection
                        title="Personal Information"
                        icon={User}
                        isExpanded={expandedSections.personal}
                        toggleExpand={() => toggleSection("personal")}
                      >
                        <div className="bg-white p-4 rounded-lg space-y-3">
                          {applier?.resume_parsed?.personal_information && (
                            <>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">Name</p>
                                  <p className="font-medium text-gray-800">
                                    {
                                      applier.resume_parsed.personal_information
                                        .name
                                    }
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Email</p>
                                  <p className="font-medium text-gray-800">
                                    {
                                      applier.resume_parsed.personal_information
                                        .email
                                    }
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Phone</p>
                                  <p className="font-medium text-gray-800">
                                    {
                                      applier.resume_parsed.personal_information
                                        .phone
                                    }
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Location
                                  </p>
                                  <p className="font-medium text-gray-800">
                                    {
                                      applier.resume_parsed.personal_information
                                        .location
                                    }
                                  </p>
                                </div>
                              </div>
                              {applier.resume_parsed.personal_information
                                .description && (
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Description
                                  </p>
                                  <p className="text-gray-700">
                                    {
                                      applier.resume_parsed.personal_information
                                        .description
                                    }
                                  </p>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </DropdownSection>

                      <DropdownSection
                        title="Skills"
                        icon={Code}
                        isExpanded={expandedSections.skills}
                        toggleExpand={() => toggleSection("skills")}
                      >
                        <div className="grid grid-cols-2 gap-2">
                          {applier?.resume_parsed?.skills?.map(
                            (item, index) => (
                              <div
                                key={index}
                                className="bg-white p-3 rounded-lg"
                              >
                                <p className="text-gray-700">{item.skill}</p>
                              </div>
                            )
                          )}
                        </div>
                      </DropdownSection>

                      <DropdownSection
                        title="Achievements"
                        icon={Award}
                        isExpanded={expandedSections.achievements}
                        toggleExpand={() => toggleSection("achievements")}
                      >
                        <div className="space-y-4">
                          {applier?.resume_parsed?.achievements?.map(
                            (item, index) => (
                              <div
                                key={index}
                                className="bg-white p-4 rounded-lg"
                              >
                                <h4 className="font-medium text-gray-800">
                                  {item.achievement}
                                </h4>
                                <span className="text-gray-500 text-sm">
                                  {item.date}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </DropdownSection>

                      <DropdownSection
                        title="Education"
                        icon={School}
                        isExpanded={expandedSections.education}
                        toggleExpand={() => toggleSection("education")}
                      >
                        <div className="space-y-4">
                          {applier?.resume_parsed?.educations?.map(
                            (edu, index) => (
                              <div
                                key={index}
                                className="bg-white p-4 rounded-lg"
                              >
                                <h4 className="font-medium text-gray-800">
                                  {edu.institution}
                                </h4>
                                <p className="text-gray-700">
                                  {edu.field_of_study}
                                </p>
                                <p className="text-gray-600 text-sm">
                                  {edu.start_date} - {edu.end_date}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </DropdownSection>

                      <DropdownSection
                        title="Experience"
                        icon={Briefcase}
                        isExpanded={expandedSections.experience}
                        toggleExpand={() => toggleSection("experience")}
                      >
                        <div className="space-y-4">
                          {applier?.resume_parsed?.experiences?.map(
                            (exp, index) => (
                              <div
                                key={index}
                                className="bg-white p-4 rounded-lg"
                              >
                                <h4 className="font-medium text-gray-800">
                                  {exp.position}
                                </h4>
                                <p className="text-gray-700">
                                  {exp.company} • {exp.location}
                                </p>
                                <p className="text-gray-600 text-sm">
                                  {exp.start_date} - {exp.end_date}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </DropdownSection>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">No resume uploaded yet.</p>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => router.push("/applicant/profile")}
                  className="cursor-pointer px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  No, Update Resume
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="cursor-pointer px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  Yes, Continue
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio or Additional Files URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.document_url}
                  onChange={(e) =>
                    setFormData({ ...formData, document_url: e.target.value })
                  }
                  className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="https://..."
                />
                {errors.document_url && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.document_url}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivational Letter <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    value={formData.motivational_letter}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        motivational_letter: e.target.value,
                      })
                    }
                    maxLength={900}
                    rows={6}
                    className={`text-black w-full px-4 py-2 border ${
                      errors.motivational_letter
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                    placeholder="Write your motivational letter here..."
                  />
                  <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                    {formData.motivational_letter.length}/900
                  </div>
                </div>
                {errors.motivational_letter && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.motivational_letter}
                  </p>
                )}
              </div>

              {errors.submit && (
                <p className="text-sm text-red-600">{errors.submit}</p>
              )}

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="cursor-pointer px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Add custom styles for toast animation */}
        <style jsx>{`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

function DropdownSection({
  title,
  icon: Icon,
  children,
  isExpanded,
  toggleExpand,
}) {
  return (
    <div className="bg-white rounded-lg border">
      <div
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center">
          <Icon className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-600" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-600" />
        )}
      </div>

      {isExpanded && <div className="p-4 border-t">{children}</div>}
    </div>
  );
}
