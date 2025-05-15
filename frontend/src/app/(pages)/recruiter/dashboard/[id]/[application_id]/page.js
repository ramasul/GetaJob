"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  User,
  Calendar,
  School,
  ChevronDown,
  ChevronUp,
  Award,
  Briefcase,
  Code,
} from "lucide-react";
import Header from "@/app/components/Header";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useAuth } from "@/app/auth/context";
import Loading from "@/app/components/Loading";
import { applierService } from "@/app/api/applierService";
import { applicationService } from "@/app/api/applicationService";
import { DEFAULT_IMAGE } from "@/app/utils/constant";
import { useParams } from "next/navigation";
import RecruiterRateResumePopup from "@/app/components/RecruiterRateResumePopup";

// Helper to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function ApplicationDetails() {
  const { user, loading } = useAuth();
  const params = useParams();
  const [applier, setApplier] = useState(null);
  const [application, setApplication] = useState(null);
  const [fullAddress, setFullAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    skills: false,
    achievements: false,
    education: false,
    experience: false,
  });
  const [showRateResume, setShowRateResume] = useState(false);

  useEffect(() => {
    console.log(params.application_id);
    async function fetchApplicationData() {
      if (params.application_id) {
        try {
          setIsLoading(true);
          const applicationData = await applicationService.getApplicationByID(
            params.application_id
          );
          setApplication(applicationData);

          const applierResponse = await applierService.getApplierByID(
            applicationData.applier_id
          );
          setApplier({
            ...applierResponse,
            profile_picture_url:
              applierResponse.profile_picture_url || DEFAULT_IMAGE,
            resume_parsed: applierResponse.resume_parsed || {},
          });

          const addressParts = [
            applierResponse.address?.street,
            applierResponse.address?.city,
            applierResponse.address?.state,
            applierResponse.address?.country,
            applierResponse.address?.postal_code,
          ]
            .filter(Boolean)
            .join(", ");
          setFullAddress(addressParts);
        } catch (error) {
          console.error("Error fetching application data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchApplicationData();
  }, [params.application_id]);

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  if (loading || isLoading) {
    return <Loading />;
  }

  return (
    <ProtectedRoute userType="recruiter">
      <div className="min-h-screen bg-gradient-to-tr from-cyan-400 to-cyan-200">
        <Header currentPage="application-detail" userType={user?.user_type} />
        <div className="max-w-6xl mx-auto py-8 px-2 sm:px-4">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center">
                  <Link href="/recruiter/dashboard" className="mr-3">
                    <ArrowLeft className="h-6 w-6 text-gray-700" />
                  </Link>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Applicant Profile
                  </h1>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setShowRateResume(true)}
                    className="flex items-center gap-2 w-full sm:w-auto px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-800 transition-colors cursor-pointer justify-center"
                  >
                    <span>Score this Resume</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="bg-white p-4 sm:p-6 rounded-xl border">
                  <div className="flex flex-col items-center mb-4">
                    <div className="relative w-32 h-32 sm:w-48 sm:h-48 mb-3">
                      {applier?.profile_picture_url ? (
                        <Image
                          src={applier.profile_picture_url}
                          height={400}
                          width={400}
                          alt={applier?.name || "Profile Picture"}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-3xl font-bold text-gray-500">
                            {applier?.name?.charAt(0) || "?"}
                          </span>
                        </div>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {applier?.name || "No Name"}
                    </h2>
                    <p className="text-gray-500">
                      {applier?.resume_parsed?.personal_information
                        ?.description || "Applicant"}
                    </p>
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 font-medium">
                        Application Date
                      </span>
                      <span className="text-gray-500 text-sm">
                        {formatDate(application?.created_at)}
                      </span>
                    </div>
                    <div className="mt-3">
                      <h3 className="font-medium text-gray-800">
                        {applier?.username || "No Username"}
                      </h3>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-800 mb-4">Contact</h3>
                    <div className="space-y-4">
                      <ContactItem
                        icon={Mail}
                        label="Email"
                        value={applier?.email}
                        href={applier?.email ? `mailto:${applier.email}` : null}
                      />
                      <ContactItem
                        icon={Phone}
                        label="Phone"
                        value={applier?.phone}
                        href={applier?.phone ? `tel:${applier.phone}` : null}
                      />
                      <ContactItem
                        icon={MapPin}
                        label="Address"
                        value={fullAddress}
                        href={
                          fullAddress
                            ? `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`
                            : null
                        }
                      />
                      <ContactItem
                        icon={Calendar}
                        label="Date of Birth"
                        value={formatDate(applier?.dob)}
                      />
                    </div>
                    {applier?.resume_url && (
                      <div className="bg-white rounded-xl mt-6">
                        <div className="flex justify-center items-center">
                          <a
                            href={applier.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-colors"
                          >
                            View Resume
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="md:col-span-2">
                  <div className="bg-white p-6 rounded-xl border mb-6">
                    <h3 className="font-medium text-gray-800 mb-4">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field label="Full Name" value={applier?.name} />
                      <Field label="Username" value={applier?.username} />
                      <Field label="Email" value={applier?.email} />
                      <Field label="Phone" value={applier?.phone} />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border mb-6">
                    <h3 className="font-medium text-gray-800 mb-4">
                      Motivational Letter
                    </h3>
                    <div className="mb-3">
                      <p className="text-gray-700 whitespace-pre-line">
                        {application?.motivational_letter ||
                          "No motivational letter provided."}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border mb-6">
                    <h3 className="font-medium text-gray-800 mb-4">Bio</h3>
                    <div className="mb-3">
                      <p className="text-gray-700">
                        {applier?.bio || "No bio provided."}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border mb-6">
                    <h3 className="font-medium text-gray-800 mb-4">
                      Portofolio or Additional Document Url
                    </h3>
                    <div className="mb-3 text-blue-500">
                      <a
                        href={application?.document_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {application?.document_url ||
                          "No Portofolio or Additional Document Url."}
                      </a>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <DropdownSection
                    title="Skills"
                    icon={Code}
                    isExpanded={expandedSections.skills}
                    toggleExpand={() => toggleSection("skills")}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {applier?.resume_parsed?.skills?.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-700">{item.skill}</p>
                        </div>
                      ))}
                      {(!applier?.resume_parsed?.skills ||
                        applier.resume_parsed.skills.length === 0) && (
                        <p className="text-gray-500 italic">No skills listed</p>
                      )}
                    </div>
                  </DropdownSection>

                  {/* Achievements Section */}
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
                            className="bg-gray-50 p-4 rounded-lg"
                          >
                            <div className="flex justify-between">
                              <h4 className="font-medium text-gray-800">
                                {item.achievement}
                              </h4>
                              <span className="text-gray-500 text-sm">
                                {item.date}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                      {(!applier?.resume_parsed?.achievements ||
                        applier.resume_parsed.achievements.length === 0) && (
                        <p className="text-gray-500 italic">
                          No achievements listed
                        </p>
                      )}
                    </div>
                  </DropdownSection>

                  {/* Education Section */}
                  <DropdownSection
                    title="Education"
                    icon={School}
                    isExpanded={expandedSections.education}
                    toggleExpand={() => toggleSection("education")}
                  >
                    <div className="space-y-4">
                      {applier?.resume_parsed?.educations?.map((edu, index) => (
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
                            <p className="text-gray-600 text-sm">
                              {edu.degree}
                            </p>
                          )}
                          {edu.gpa && edu.gpa !== "None" && (
                            <p className="text-gray-600 text-sm">
                              GPA: {edu.gpa}
                            </p>
                          )}
                        </div>
                      ))}
                      {(!applier?.resume_parsed?.educations ||
                        applier.resume_parsed.educations.length === 0) && (
                        <p className="text-gray-500 italic">
                          No education history listed
                        </p>
                      )}
                    </div>
                  </DropdownSection>

                  {/* Experience Section */}
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
                            className="bg-gray-50 p-4 rounded-lg"
                          >
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
                        )
                      )}
                      {(!applier?.resume_parsed?.experiences ||
                        applier.resume_parsed.experiences.length === 0) && (
                        <p className="text-gray-500 italic">
                          No work experience listed
                        </p>
                      )}
                    </div>
                  </DropdownSection>

                  <div className="bg-white p-6 rounded-xl border mt-6">
                    <h3 className="font-medium text-gray-800 mb-4">
                      Address Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field label="Street" value={applier?.address?.street} />
                      <Field label="City" value={applier?.address?.city} />
                      <Field
                        label="State/Province"
                        value={applier?.address?.state}
                      />
                      <Field
                        label="Country"
                        value={applier?.address?.country}
                      />
                      <Field
                        label="Postal Code"
                        value={applier?.address?.postal_code}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showRateResume && (
          <RecruiterRateResumePopup
            onClose={() => setShowRateResume(false)}
            userId={application?.applier_id}
            jobId={application?.job_id}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

// Reusable components
function Field({ label, value }) {
  return (
    <div>
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      <p className="text-gray-800">{value || "N/A"}</p>
    </div>
  );
}

function ContactItem({ icon: Icon, label, value, href }) {
  if (!value) return null;

  return (
    <div className="flex items-start">
      <Icon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        {href ? (
          <a href={href} className="text-blue-600 text-sm hover:underline">
            {value}
          </a>
        ) : (
          <p className="text-gray-800 text-sm">{value}</p>
        )}
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
    <div className="bg-white p-6 rounded-xl border mb-6">
      <div
        className="flex justify-between items-center cursor-pointer"
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

      {isExpanded && <div className="mt-4 pt-4 border-t">{children}</div>}
    </div>
  );
}
