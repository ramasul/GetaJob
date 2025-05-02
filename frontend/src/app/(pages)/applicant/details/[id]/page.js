"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/app/utils/api";

export default function JobDetailPage() {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const jobId = searchParams.get("id");

  useEffect(() => {
    if (!jobId) return; // prevent running fetch on undefined

    const fetchJob = async () => {
      try {
        const response = await axiosInstance.get(`/jobs/${jobId}`);
        setJob(response.data);
        console.log("Job details:", response.data);
      } catch (err) {
        console.error("Failed to fetch job details", err);
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!job) return <p>Job not found</p>;

  return (
    <div>
      <h1>{job.job_title}</h1>
      <p>{job.description}</p>
      {/* Add more fields as needed */}
    </div>
  );
}
