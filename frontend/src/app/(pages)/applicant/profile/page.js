"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Mail, Phone, MapPin, User, Calendar, School, 
  ChevronDown, ChevronUp, Award, Briefcase, Code
} from 'lucide-react';
import Header from "@/app/components/Header";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useAuth } from "@/app/auth/context";

// Helper to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function ApplierProfile() {
  const { user } = useAuth();
  const [applier, setApplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    skills: false,
    achievements: false,
    education: false,
    experience: false
  });

  useEffect(() => {
    if (user?.id) {
      fetch(`https://unconscious-puma-universitas-gadjah-mada-f822e818.koyeb.app/appliers/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setApplier(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch applier data:", err);
          setLoading(false);
        });
    }
  }, [user]);

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  if (loading || !applier) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  const fullAddress = [
    applier.address?.street,
    applier.address?.city,
    applier.address?.state,
    applier.address?.country,
    applier.address?.postal_code
  ].filter(Boolean).join(", ");

  return (
    <ProtectedRoute userType="applier">
      <div className="min-h-screen bg-gradient-to-tr from-[#45D1DD] to-gray-300">
        <Header currentPage="profile" userType="applicant" />

        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Link href="/dashboard" className="mr-3">
                    <ArrowLeft className="h-6 w-6 text-gray-700" />
                  </Link>
                  <h1 className="text-2xl font-bold text-gray-800">Applicant Profile</h1>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="bg-white p-6 rounded-xl border">
                  <div className="flex flex-col items-center mb-4">
                    <div className="relative w-24 h-24 mb-3">
                      {applier.profile_picture_url ? (
                        <img 
                          src={applier.profile_picture_url} 
                          alt={applier.name} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-3xl font-bold text-gray-500">
                            {applier.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">{applier.name}</h2>
                    <p className="text-gray-500">{applier.resume_parsed?.personal_information?.description || "Applicant"}</p>
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 font-medium">Member Since</span>
                      <span className="text-gray-500 text-sm">{formatDate(applier.created_at)}</span>
                    </div>
                    <div className="mt-3">
                      <h3 className="font-medium text-gray-800">{applier.username}</h3>
                      <div className="flex gap-2 text-sm mt-1 text-gray-500">
                        <span>Last Updated: {formatDate(applier.updated_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-800 mb-4">Contact</h3>
                    <div className="space-y-4">
                      <ContactItem icon={Mail} label="Email" value={applier.email} href={`mailto:${applier.email}`} />
                      <ContactItem icon={Phone} label="Phone" value={applier.phone} href={`tel:${applier.phone}`} />
                      <ContactItem icon={MapPin} label="Address" value={fullAddress} href={`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`} />
                      <ContactItem icon={Calendar} label="Date of Birth" value={formatDate(applier.dob)} />
                    </div>
                    {applier.resume_url && (
                    <div className="bg-white rounded-xl  mt-6">
                      <div className="flex justify-between items-center">
                        <a 
                          href={applier.resume_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                    <h3 className="font-medium text-gray-800 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field label="Full Name" value={applier.name} />
                      <Field label="Username" value={applier.username} />
                      <Field label="Email" value={applier.email} />
                      <Field label="Phone" value={applier.phone} />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border mb-6">
                    <h3 className="font-medium text-gray-800 mb-4">Bio</h3>
                    <div className="mb-3">
                      <p className="text-gray-700">{applier.bio || "No bio provided."}</p>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <DropdownSection 
                    title="Skills" 
                    icon={Code}
                    isExpanded={expandedSections.skills}
                    toggleExpand={() => toggleSection('skills')}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {applier.resume_parsed?.skills?.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-700">{item.skill}</p>
                        </div>
                      ))}
                      {(!applier.resume_parsed?.skills || applier.resume_parsed.skills.length === 0) && (
                        <p className="text-gray-500 italic">No skills listed</p>
                      )}
                    </div>
                  </DropdownSection>

                  {/* Achievements Section */}
                  <DropdownSection 
                    title="Achievements" 
                    icon={Award}
                    isExpanded={expandedSections.achievements}
                    toggleExpand={() => toggleSection('achievements')}
                  >
                    <div className="space-y-4">
                      {applier.resume_parsed?.achievements?.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between">
                            <h4 className="font-medium text-gray-800">{item.achievement}</h4>
                            <span className="text-gray-500 text-sm">{item.date}</span>
                          </div>
                        </div>
                      ))}
                      {(!applier.resume_parsed?.achievements || applier.resume_parsed.achievements.length === 0) && (
                        <p className="text-gray-500 italic">No achievements listed</p>
                      )}
                    </div>
                  </DropdownSection>

                  {/* Education Section */}
                  <DropdownSection 
                    title="Education" 
                    icon={School}
                    isExpanded={expandedSections.education}
                    toggleExpand={() => toggleSection('education')}
                  >
                    <div className="space-y-4">
                      {applier.resume_parsed?.educations?.map((edu, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between mb-1">
                            <h4 className="font-medium text-gray-800">{edu.institution}</h4>
                            <span className="text-gray-500 text-sm">{edu.start_date} - {edu.end_date}</span>
                          </div>
                          <p className="text-gray-700">{edu.field_of_study || "N/A"}</p>
                          {edu.degree && <p className="text-gray-600 text-sm">{edu.degree}</p>}
                          {edu.gpa && edu.gpa !== "None" && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                        </div>
                      ))}
                      {(!applier.resume_parsed?.educations || applier.resume_parsed.educations.length === 0) && (
                        <p className="text-gray-500 italic">No education history listed</p>
                      )}
                    </div>
                  </DropdownSection>

                  {/* Experience Section */}
                  <DropdownSection 
                    title="Experience" 
                    icon={Briefcase}
                    isExpanded={expandedSections.experience}
                    toggleExpand={() => toggleSection('experience')}
                  >
                    <div className="space-y-4">
                      {applier.resume_parsed?.experiences?.map((exp, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between mb-1">
                            <h4 className="font-medium text-gray-800">{exp.position}</h4>
                            <span className="text-gray-500 text-sm">{exp.start_date} - {exp.end_date}</span>
                          </div>
                          <p className="text-gray-700 mb-2">{exp.company} • {exp.location}</p>
                          {exp.responsibilities && exp.responsibilities.length > 0 && (
                            <div>
                              <p className="text-gray-600 font-medium text-sm mb-1">Responsibilities:</p>
                              <ul className="list-disc list-inside text-gray-600 text-sm pl-2">
                                {exp.responsibilities.map((resp, idx) => (
                                  <li key={idx}>{resp}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                      {(!applier.resume_parsed?.experiences || applier.resume_parsed.experiences.length === 0) && (
                        <p className="text-gray-500 italic">No work experience listed</p>
                      )}
                    </div>
                  </DropdownSection>

                  <div className="bg-white p-6 rounded-xl border mt-6">
                    <h3 className="font-medium text-gray-800 mb-4">Address Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field label="Street" value={applier.address?.street} />
                      <Field label="City" value={applier.address?.city} />
                      <Field label="State/Province" value={applier.address?.state} />
                      <Field label="Country" value={applier.address?.country} />
                      <Field label="Postal Code" value={applier.address?.postal_code} />
                    </div>
                  </div>

                  
                </div>
              </div>
            </div>
          </div>
        </div>
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
          <a href={href} className="text-blue-600 text-sm hover:underline">{value}</a>
        ) : (
          <p className="text-gray-800 text-sm">{value}</p>
        )}
      </div>
    </div>
  );
}

function DropdownSection({ title, icon: Icon, children, isExpanded, toggleExpand }) {
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
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t">
          {children}
        </div>
      )}
    </div>
  );
}