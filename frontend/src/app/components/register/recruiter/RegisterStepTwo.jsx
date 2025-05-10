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

const companySchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  company_type: z.string().min(1, "Company type is required"),
  company_description: z.string().optional(),
  phone: z.string().optional(),
  address: addressSchema,
  website_url: z.string().optional(),
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
    resolver: zodResolver(companySchema),
    defaultValues: {
      company_name: formData.company_name,
      company_type: formData.company_type,
      company_description: formData.company_description,
      phone: formData.phone,
      address: formData.address,
      website_url: formData.website_url,
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
        Company Information
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-cyan-700 mb-1">
              Company Name*
            </label>
            <div className="relative text-cyan-500">
              <input
                {...register("company_name")}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-9 sm:pl-10 border border-cyan-200"
                placeholder="Acme Corporation"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm3-2a3 3 0 116 0 3 3 0 01-6 0zm2 8a7 7 0 014 0M5.5 8.5a2 2 0 114 0 2 2 0 01-4 0z" />
                </svg>
              </div>
            </div>
            {errors.company_name && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.company_name.message}
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
            Company Type*
          </label>
          <div className="relative text-cyan-500">
            <select
              {...register("company_type")}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-9 sm:pl-10 border border-cyan-200"
            >
              <option value="">Select...</option>
              <option value="Startup">Startup</option>
              <option value="Small Business">Small Business</option>
              <option value="Mid-size Company">Mid-size Company</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Government">Government</option>
              <option value="Non-profit">Non-profit</option>
              <option value="Educational Institution">
                Educational Institution
              </option>
              <option value="Agency">Agency</option>
              <option value="Other">Other</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          {errors.company_type && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.company_type.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-700 mb-1">
            Website URL
          </label>
          <div className="relative text-cyan-500">
            <input
              {...register("website_url")}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 pl-9 sm:pl-10 border border-cyan-200"
              placeholder="https://www.example.com"
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
                  d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="border-t border-cyan-200 pt-4">
          <h3 className="text-base sm:text-lg font-semibold mb-3 text-cyan-700">
            Company Address
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
                  placeholder="123 Business Ave"
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

        {/* Company Description */}
        <div className="border-t border-cyan-200 pt-4">
          <h3 className="text-base sm:text-lg font-semibold mb-3 text-cyan-700">
            About Your Company
          </h3>

          <div>
            <label className="block text-sm font-medium text-cyan-700 mb-1">
              Company Description
            </label>
            <textarea
              {...register("company_description")}
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg text-sm text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-cyan-200"
              placeholder="Tell us about your company, its mission, and values..."
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
