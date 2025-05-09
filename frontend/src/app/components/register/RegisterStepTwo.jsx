"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().min(1, "State is required"),
  country: z.string().default("Indonesia"),
  postal_code: z.string().optional(),
});

const educationSchema = z.object({
  education_level: z.string().min(1, "Education level is required"),
  institution: z.string().optional(),
  degree: z.string().optional(),
  field_of_study: z.string().optional(),
  graduation_year: z
    .preprocess(
      (val) => {
        if (val === "" || val === null || val === undefined) return undefined;
        const num = Number(val);
        return Number.isNaN(num) ? undefined : num;
      },
      z
        .number()
        .int()
        .min(1950, "Graduation year must be >= 1950")
        .max(
          new Date().getFullYear() + 10,
          `Graduation year must be <= ${new Date().getFullYear() + 10}`
        )
        .optional()
    )
    .optional(),
});

const stepTwoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  address: addressSchema,
  dob: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    { message: "Invalid date of birth" }
  ),
  last_education: educationSchema,
  bio: z.string().optional(),
});

export default function RegisterStepTwo({
  formData,
  updateFormData,
  prevStep,
  handleSubmit: submitRegistration,
  isLoading,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      dob: formData.dob,
      last_education: formData.last_education,
      bio: formData.bio,
    },
  });

  const onSubmit = (data) => {
    updateFormData(data);
    submitRegistration({
      ...formData,
      ...data,
    });
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-cyan-700">
        Personal Information
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-cyan-700 mb-1">
              Full Name*
            </label>
            <div className="relative text-cyan-500">
              <input
                {...register("name")}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-9 sm:pl-10 border border-cyan-200"
                placeholder="John Doe"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-700 mb-1">
              Phone Number
            </label>
            <div className="relative text-cyan-500">
              <input
                {...register("phone")}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-9 sm:pl-10 border border-cyan-200"
                placeholder="+1234567890"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-700 mb-1">
            Date of Birth*
          </label>
          <div className="relative text-cyan-500">
            <input
              {...register("dob")}
              type="date"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-9 sm:pl-10 border border-cyan-200"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          {errors.dob && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.dob.message}
            </p>
          )}
        </div>

        {/* Education Information */}
        <div className="border-t border-cyan-200 pt-4">
          <h3 className="text-base sm:text-lg font-semibold mb-3 text-cyan-700">
            Education
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Education Level*
              </label>
              <select
                {...register("last_education.education_level")}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-cyan-500 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-cyan-200"
              >
                <option value="">Select...</option>
                <option value="Elementary School">Elementary School</option>
                <option value="Middle School">Middle School</option>
                <option value="High School">High School</option>
                <option value="Associate">Associate Degree</option>
                <option value="Bachelor">Bachelor's Degree</option>
                <option value="Master">Master's Degree</option>
                <option value="Doctorate">Doctorate</option>
                <option value="Other">Other</option>
              </select>
              {errors.last_education?.education_level && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.last_education.education_level.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Institution
              </label>
              <div className="relative text-cyan-500">
                <input
                  {...register("last_education.institution")}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-9 sm:pl-10 border border-cyan-200"
                  placeholder="University Name"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4">
            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Degree
              </label>
              <div className="relative text-cyan-500">
                <input
                  {...register("last_education.degree")}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-9 sm:pl-10 border border-cyan-200"
                  placeholder="Bachelor of Science"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Field of Study
              </label>
              <div className="relative text-cyan-500">
                <input
                  {...register("last_education.field_of_study")}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-9 sm:pl-10 border border-cyan-200"
                  placeholder="Computer Science"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Graduation Year
              </label>
              <div className="relative text-cyan-500">
                <input
                  {...register("last_education.graduation_year", {
                    valueAsNumber: true,
                    setValueAs: (v) => (v === "" ? null : parseInt(v, 10)),
                  })}
                  type="number"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-9 sm:pl-10 border border-cyan-200"
                  placeholder="2023"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              {errors.last_education?.graduation_year && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.last_education.graduation_year.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="border-t border-cyan-200 pt-4">
          <h3 className="text-base sm:text-lg font-semibold mb-3 text-cyan-700">
            Address
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Street
              </label>
              <div className="relative text-cyan-500">
                <input
                  {...register("address.street")}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-9 sm:pl-10 border border-cyan-200"
                  placeholder="123 Main St"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                City
              </label>
              <div className="relative text-cyan-500">
                <input
                  {...register("address.city")}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-9 sm:pl-10 border border-cyan-200"
                  placeholder="Jakarta"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4">
            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                State/Province*
              </label>
              <div className="relative text-cyan-500">
                <input
                  {...register("address.state")}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-9 sm:pl-10 border border-cyan-200"
                  placeholder="West Java"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              {errors.address?.state && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.address.state.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Country
              </label>
              <div className="relative text-cyan-500">
                <input
                  {...register("address.country")}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-9 sm:pl-10 border border-cyan-200"
                  defaultValue="Indonesia"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700 mb-1">
                Postal Code
              </label>
              <div className="relative text-cyan-500">
                <input
                  {...register("address.postal_code")}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-9 sm:pl-10 border border-cyan-200"
                  placeholder="12345"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="border-t border-cyan-200 pt-4">
          <h3 className="text-base sm:text-lg font-semibold mb-3 text-cyan-700">
            About You
          </h3>

          <div>
            <label className="block text-sm font-medium text-cyan-700 mb-1">
              Bio
            </label>
            <textarea
              {...register("bio")}
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg text-sm text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-cyan-200"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
          <button
            type="button"
            onClick={prevStep}
            className="w-full sm:w-auto px-6 py-2 sm:py-3 text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition font-medium cursor-pointer"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? "Creating Account..." : "Complete Registration"}
          </button>
        </div>
      </form>
    </div>
  );
}
