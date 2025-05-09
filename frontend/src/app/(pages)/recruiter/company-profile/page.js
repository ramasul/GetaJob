// pages/company-profile.js
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft, Mail, Phone, Instagram, Twitter, Globe, MapPin
} from 'lucide-react';
import Header from '@/app/components/Header';

// Static company data object (will be replaced with API fetch later)
const company = {
  "username": "dzakiwismadi",
  "company_name": "ArachnoVa",
  "company_type": "Technology",
  "company_description": "Menargetkan pembuatan berbagai jenis website seperti Landing Page, Profiling, dan Custom termasuk website administrasi dan dashboard, dengan tujuan meningkatkan esensi kesan profesional bagi setiap klien.",
  "email": "dzakiwismadi@example.com",
  "phone": "081809252706",
  "address": {
    "street": "Kaliurang",
    "city": "Sleman",
    "state": "Yogyakarta",
    "country": "Indonesia",
    "postal_code": "55569"
  },
  "website_url": "https://www.arachnova.id/",
  "created_at": "2025-05-04T14:21:28.464000",
  "updated_at": "2025-05-04T14:21:28.464000",
  "_id": "68177844a72a751680a7ea95"
};

export default function CompanyProfile() {
  // Format the full address
  const fullAddress = [
    company.address.street,
    company.address.city,
    company.address.state,
    company.address.country,
    company.address.postal_code
  ].filter(Boolean).join(", ");

  // Format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-300 to-cyan-100 py-8 px-4">
      <Head>
        <title>Company Profile | Recruitment Dashboard</title>
        <meta name="description" content="Company profile details" />
      </Head>

      <Header currentPage="profile" userType="recruiter" />

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Link href="/dashboard" className="mr-3">
                <ArrowLeft className="h-6 w-6 text-gray-700" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Company Profile</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="bg-white p-6 rounded-xl border">
              <div className="flex flex-col items-center mb-4">
                <div className="relative w-24 h-24 mb-3">
                  <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                    {/* Company initial as placeholder */}
                    <span className="text-3xl font-bold text-gray-500">
                      {company.company_name.charAt(0)}
                    </span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-800">{company.company_name}</h2>
                <p className="text-gray-500">{company.company_type}</p>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 font-medium">Member Since</span>
                  <span className="text-gray-500 text-sm">{formatDate(company.created_at)}</span>
                </div>
                <div className="mt-3">
                  <h3 className="font-medium text-gray-800">{company.username}</h3>
                  <div className="flex gap-2 text-sm mt-1 text-gray-500">
                    <span>Last Updated: {formatDate(company.updated_at)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-800 mb-4">Contact</h3>
                <div className="space-y-4">
                  <ContactItem icon={Mail} label="Email" value={company.email} href={`mailto:${company.email}`} />
                  <ContactItem icon={Phone} label="Phone" value={company.phone} href={`tel:${company.phone}`} />
                  <ContactItem icon={Globe} label="Website" value={company.website_url} href={company.website_url} />
                  <ContactItem icon={MapPin} label="Address" value={fullAddress} href={`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`} />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-xl border mb-6">
                <h3 className="font-medium text-gray-800 mb-4">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Company Name" value={company.company_name} />
                  <Field label="Company Type" value={company.company_type} />
                  <Field label="Username" value={company.username} />
                  <Field label="Website" value={company.website_url} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border mb-6">
                <h3 className="font-medium text-gray-800 mb-4">Company Description</h3>
                <div className="mb-3">
                  <p className="text-gray-700">{company.company_description}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border">
                <h3 className="font-medium text-gray-800 mb-4">Address Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Street" value={company.address.street} />
                  <Field label="City" value={company.address.city} />
                  <Field label="State/Province" value={company.address.state} />
                  <Field label="Country" value={company.address.country} />
                  <Field label="Postal Code" value={company.address.postal_code} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}

// Reusable Components
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
        <a href={href} className="text-blue-600 text-sm hover:underline">{value}</a>
      </div>
    </div>
  );
}