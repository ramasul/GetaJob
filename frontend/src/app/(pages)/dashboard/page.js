"use client";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useAuth } from "@auth/context";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    router.push("/"); // Redirect to login after logout
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-black">
        <div className="bg-white p-10 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          {user ? (
            <>
              <p className="mt-4 text-gray-600">Welcome, {user.name}!</p>
              <p className="text-gray-500">Email: {user.email}</p>
              <p className="text-gray-500">Role: {user.user_type}</p>
              <p className="text-red-400">
                Page ini cuma buat bisa logout doang hehe
              </p>
              <button
                onClick={handleLogout}
                className="mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <p className="mt-4 text-red-500">No user data available.</p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
