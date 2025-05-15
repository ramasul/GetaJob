"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Upload,
  Pencil,
} from "lucide-react";
import Header from "@/app/components/Header";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useAuth } from "@/app/auth/context";
import Loading from "@/app/components/Loading";
import { recruiterService } from "@/app/api/recruiterService";
import { DEFAULT_IMAGE } from "@/app/utils/constant";
import ProfilePictureOptions from "@/app/components/ProfilePictureOptions";
import UploadImage from "@/app/components/UploadImage";
import { uploadImage } from "@/app/api/cloudinary";

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

export default function CompanyProfile() {
  const { user, loading } = useAuth();
  const [recruiter, setRecruiter] = useState(null);
  const [fullAddress, setFullAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showUploadImage, setShowUploadImage] = useState(false);

  useEffect(() => {
    async function fetchRecruiterData() {
      if (user) {
        try {
          setIsLoading(true);
          const response = await recruiterService.getRecruiterByID(user.id);
          setRecruiter({
            ...response,
            profile_picture_url: response.profile_picture_url || DEFAULT_IMAGE,
          });
          const addressParts = [
            response.address?.street,
            response.address?.city,
            response.address?.state,
            response.address?.country,
            response.address?.postal_code,
          ]
            .filter(Boolean)
            .join(", ");
          setFullAddress(addressParts);
        } catch (error) {
          console.error("Error fetching recruiter data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchRecruiterData();
  }, [user]);

  const handleDeleteProfilePicture = async () => {
    try {
      await recruiterService.deleteProfilePicture(user.id);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting profile picture:", error);
    }
  };

  const handleSaveProfilePicture = async (croppedImage) => {
    try {
      const secure_url = await uploadImage(croppedImage, user.id, "recruiter");
      await recruiterService.updateProfile(user.id, {
        profile_picture_url: secure_url,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  if (loading || isLoading) {
    return <Loading />;
  }

  return (
    <ProtectedRoute userType="recruiter">
      <div className="min-h-screen bg-gradient-to-tr from-cyan-400 to-cyan-200">
        <Header currentPage="profile" userType="recruiter" />
        <div className="max-w-6xl mx-auto py-8 px-2 sm:px-4">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center">
                  <Link href="/recruiter/dashboard" className="mr-3">
                    <ArrowLeft className="h-6 w-6 text-gray-700" />
                  </Link>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Company Profile
                  </h1>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="bg-white p-4 sm:p-6 rounded-xl border">
                  <div className="flex flex-col items-center mb-4">
                    <div className="relative w-32 h-32 sm:w-48 sm:h-48 mb-3 group">
                      {recruiter?.profile_picture_url ? (
                        <Image
                          src={recruiter.profile_picture_url}
                          height={400}
                          width={400}
                          alt={recruiter?.company_name || "Company Logo"}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-3xl font-bold text-gray-500">
                            {recruiter?.company_name?.charAt(0) || "?"}
                          </span>
                        </div>
                      )}
                      <div
                        className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        onClick={() => setShowProfileOptions(true)}
                      >
                        <Pencil className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {recruiter?.company_name || "No Company Name"}
                    </h2>
                    <p className="text-gray-500">
                      {recruiter?.company_type || "Company"}
                    </p>
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 font-medium">
                        Member Since
                      </span>
                      <span className="text-gray-500 text-sm">
                        {formatDate(recruiter?.created_at)}
                      </span>
                    </div>
                    <div className="mt-3">
                      <h3 className="font-medium text-gray-800">
                        {recruiter?.username || "No Username"}
                      </h3>
                      <div className="flex gap-2 text-sm mt-1 text-gray-500">
                        <span>
                          Last Updated: {formatDate(recruiter?.updated_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-800 mb-4">Contact</h3>
                    <div className="space-y-4">
                      <ContactItem
                        icon={Mail}
                        label="Email"
                        value={recruiter?.email}
                        href={
                          recruiter?.email ? `mailto:${recruiter.email}` : null
                        }
                      />
                      <ContactItem
                        icon={Phone}
                        label="Phone"
                        value={recruiter?.phone}
                        href={
                          recruiter?.phone ? `tel:${recruiter.phone}` : null
                        }
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
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="md:col-span-2">
                  <div className="bg-white p-6 rounded-xl border mb-6">
                    <h3 className="font-medium text-gray-800 mb-4">
                      Company Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field
                        label="Company Name"
                        value={recruiter?.company_name}
                      />
                      <Field label="Username" value={recruiter?.username} />
                      <Field label="Email" value={recruiter?.email} />
                      <Field label="Phone" value={recruiter?.phone} />
                      <Field
                        label="Company Type"
                        value={recruiter?.company_type}
                      />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border mb-6">
                    <h3 className="font-medium text-gray-800 mb-4">
                      About Company
                    </h3>
                    <div className="mb-3">
                      <p className="text-gray-700">
                        {recruiter?.company_description ||
                          "No company description provided."}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border mt-6">
                    <h3 className="font-medium text-gray-800 mb-4">
                      Address Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field
                        label="Street"
                        value={recruiter?.address?.street}
                      />
                      <Field label="City" value={recruiter?.address?.city} />
                      <Field
                        label="State/Province"
                        value={recruiter?.address?.state}
                      />
                      <Field
                        label="Country"
                        value={recruiter?.address?.country}
                      />
                      <Field
                        label="Postal Code"
                        value={recruiter?.address?.postal_code}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showProfileOptions && (
          <ProfilePictureOptions
            onClose={() => setShowProfileOptions(false)}
            onDelete={handleDeleteProfilePicture}
            onChange={() => {
              setShowProfileOptions(false);
              setShowUploadImage(true);
            }}
          />
        )}

        {showUploadImage && (
          <UploadImage
            onClose={() => setShowUploadImage(false)}
            onSave={handleSaveProfilePicture}
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
