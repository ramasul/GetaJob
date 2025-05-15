import Image from "next/image";
import { useRouter } from "next/navigation";

export default function JobNotActive() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-cyan-400 to-cyan-200 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-8 text-center max-w-md">
        <div className="relative w-48 h-48 mx-auto mb-6">
          <Image
            src="/image/3DHero.png"
            alt="Job Not Active"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h2 className="text-2xl font-bold text-cyan-700 mb-4">
          Job Not Available
        </h2>
        <p className="text-cyan-800 mb-6">
          This job posting is currently not active. It may have been filled or
          removed by the employer.
        </p>
        <button
          onClick={() => router.push("/home")}
          className="cursor-pointer px-6 py-3 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Browse Other Jobs
        </button>
      </div>
    </div>
  );
}
