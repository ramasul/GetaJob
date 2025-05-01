// pages/applicants/[id].js
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft, Mail, Phone, Instagram, Twitter, Globe,
} from 'lucide-react';
import Header from '@/app/components/Header';

// ⬇️ Dynamic applicant data object
const applicant = {
  name: "Jerome Paul",
  title: "Product Designer",
  avatar: "/images/jerome-bell.jpg",
  rating: 4.0,
  email: "jeromeBell45@email.com",
  phone: "+44 1245 572 135",
  social: {
    instagram: "https://instagram.com/jeromebell",
    twitter: "https://twitter.com/jeromebell",
    website: "https://www.jeromebell.com",
  },
  appliedJob: {
    position: "Product Development",
    category: "Marketing",
    type: "Full-Time",
    appliedDate: "2 days ago",
  },
  personal: {
    gender: "Male",
    dob: "March 23, 1995",
    age: "26 y.o",
    language: "English, French, Bahasa",
    address: ["4517 Washington Ave.", "Manchester, Kentucky 39495"],
  },
  professional: {
    about: [
      "I'm a product designer + filmmaker currently working remotely at Twitter from beautiful Manchester, United Kingdom.",
      "For 10 years, I've specialised in interface, experience & interaction design...",
    ],
    currentJob: "Product Designer",
    experienceYears: "4 Years",
    qualification: "Bachelors in Engineering",
    skills: ["Project Management", "Copywriting", "English"],
  },
};

export default function ApplicantDetails() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-300 to-cyan-100 py-8 px-4">
      <Head>
        <title>Applicant Details | Recruitment Dashboard</title>
        <meta name="description" content="Applicant profile details" />
      </Head>

      <Header currentPage="dashboard" userType="recruiter" />

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Link href="/applicants" className="mr-3">
                <ArrowLeft className="h-6 w-6 text-gray-700" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Applicant Details</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="bg-white p-6 rounded-xl border">
              <div className="flex flex-col items-center mb-4">
                <div className="relative w-24 h-24 mb-3">
                  <Image src={applicant.avatar} alt={applicant.name} fill className="rounded-full object-cover" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{applicant.name}</h2>
                <p className="text-gray-500">{applicant.title}</p>
                <div className="flex items-center mt-1">
                  <div className="text-yellow-400">★</div>
                  <span className="ml-1 font-medium">{applicant.rating}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 font-medium">Applied Jobs</span>
                  <span className="text-gray-500 text-sm">{applicant.appliedJob.appliedDate}</span>
                </div>
                <div className="mt-3">
                  <h3 className="font-medium text-gray-800">{applicant.appliedJob.position}</h3>
                  <div className="flex gap-2 text-sm mt-1 text-gray-500">
                    <span>{applicant.appliedJob.category}</span>
                    <span>•</span>
                    <span>{applicant.appliedJob.type}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-800 mb-4">Contact</h3>
                <div className="space-y-4">
                  <ContactItem icon={Mail} label="Email" value={applicant.email} href={`mailto:${applicant.email}`} />
                  <ContactItem icon={Phone} label="Phone" value={applicant.phone} href={`tel:${applicant.phone}`} />
                  <ContactItem icon={Instagram} label="Instagram" value={applicant.social.instagram} href={applicant.social.instagram} />
                  <ContactItem icon={Twitter} label="Twitter" value={applicant.social.twitter} href={applicant.social.twitter} />
                  <ContactItem icon={Globe} label="Website" value={applicant.social.website} href={applicant.social.website} />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-xl border mb-6">
                <h3 className="font-medium text-gray-800 mb-4">Personal Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Full Name" value={applicant.name} />
                  <Field label="Gender" value={applicant.personal.gender} />
                  <Field label="Date of Birth" value={`${applicant.personal.dob} (${applicant.personal.age})`} />
                  <Field label="Language" value={applicant.personal.language} />
                  <div className="md:col-span-2">
                    <Field label="Address" value={applicant.personal.address.join(", ")} />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border">
                <h3 className="font-medium text-gray-800 mb-4">Professional Info</h3>
                <div className="mb-6">
                  <p className="text-gray-500 text-sm mb-2">About Me</p>
                  {applicant.professional.about.map((para, i) => (
                    <p key={i} className="text-gray-700 mb-3">{para}</p>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Field label="Current Job" value={applicant.professional.currentJob} />
                  <Field label="Experience in Years" value={applicant.professional.experienceYears} />
                  <Field label="Highest Qualification Held" value={applicant.professional.qualification} />
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Skill set</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {applicant.professional.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}

// ⬇️ Reusable Components

function Field({ label, value }) {
  return (
    <div>
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      <p className="text-gray-800">{value}</p>
    </div>
  );
}

function ContactItem({ icon: Icon, label, value, href }) {
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
