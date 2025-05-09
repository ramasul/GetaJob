"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RegisterStepOne from "@/app/components/register/RegisterStepOne";
import RegisterStepTwo from "@/app/components/register/RegisterStepTwo";
import { applierService } from "@/app/api/applierService";
import { useAuth } from "@auth/context";
import Loading from "@/app/components/Loading";

export default function RegisterPage() {
  const { login, loading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    username: "",
    email: "",
    password: "",
    // Step 2
    name: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "Indonesia",
      postal_code: "",
    },
    dob: "",
    last_education: {
      education_level: "",
      institution: "",
      degree: "",
      field_of_study: "",
      graduation_year: null,
    },
    bio: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState(null);

  const updateFormData = (newData) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <Loading />;
  }

  const handleSubmit = async (newData = {}) => {
    setIsLoading(true);
    setError(null);
    setValidationErrors(null);

    try {
      const dataToSubmit = {
        ...formData,
        ...newData,
      };

      // Format date for backend (YYYY-MM-DD)
      const formattedData = {
        ...dataToSubmit,
        dob: dataToSubmit.dob
          ? new Date(dataToSubmit.dob).toISOString().split("T")[0]
          : "",
      };

      const response = await applierService.register(formattedData);
      await login(formData.username, formData.password);
      router.push("/login?register=success");
    } catch (err) {
      let parsedError;

      try {
        parsedError = JSON.parse(err.message);
      } catch {
        // If error isn't in JSON format, use the raw message
        setError(err.message || "Registration failed. Please try again.");
        console.error("Registration error:", err);
        return;
      }

      console.error("Registration error:", parsedError);

      switch (parsedError.type) {
        case "BAD_REQUEST":
          setStep(1);
          setError(parsedError.message);
          break;

        case "VALIDATION_ERROR":
          setError(parsedError.message);
          setValidationErrors(parsedError.details);

          if (parsedError.details) {
            const fields = Object.keys(parsedError.details);
            if (
              fields.some((field) =>
                ["username", "email", "password"].includes(field)
              )
            ) {
              setStep(1);
            } else if (
              fields.some(
                (field) =>
                  [
                    "name",
                    "phone",
                    "dob",
                    "bio",
                    "address",
                    "last_education",
                  ].includes(field) ||
                  field.startsWith("address.") ||
                  field.startsWith("last_education.")
              )
            ) {
              setStep(2);
            }
          }
          break;

        default:
          setError(
            parsedError.message || "Registration failed. Please try again."
          );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getFormattedValidationErrors = () => {
    if (!validationErrors) return null;

    if (Array.isArray(validationErrors)) {
      return (
        <ul className="list-disc pl-5">
          {validationErrors.map((err, index) => (
            <li key={index}>{err.msg || err.message || JSON.stringify(err)}</li>
          ))}
        </ul>
      );
    }

    return (
      <ul className="list-disc pl-5">
        {Object.entries(validationErrors).map(([field, error]) => (
          <li key={field}>
            <strong>{field}:</strong>{" "}
            {typeof error === "string" ? error : JSON.stringify(error)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-cyan-300 to-cyan-500 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/30">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <h1 className="text-xl sm:text-2xl font-bold text-cyan-700">
                Create Your Account
              </h1>
              <div className="text-sm text-cyan-600">Step {step} of 2</div>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-white/30 rounded-full h-2 sm:h-2.5 mb-4 sm:mb-6 border border-cyan-500">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(step / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded mb-4 sm:mb-6">
              <p className="font-bold">{error}</p>
              {getFormattedValidationErrors()}
            </div>
          )}

          <div className="w-full max-w-3xl mx-auto">
            {step === 1 && (
              <RegisterStepOne
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                validationErrors={validationErrors}
              />
            )}
            {step === 2 && (
              <RegisterStepTwo
                formData={formData}
                updateFormData={updateFormData}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                prevStep={prevStep}
                validationErrors={validationErrors}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
