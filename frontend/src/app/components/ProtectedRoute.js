"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@auth/context";
import Loading from "./Loading";

const ProtectedRoute = ({ children, userType, ownerId }) => {
  const { user, loading, isRecruiter, isApplier } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        const redirectPath =
          typeof window !== "undefined"
            ? window.location.pathname
            : router.asPath;
        router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
        return;
      }

      // Cek user type jika diberikan
      if (userType && user?.user_type !== userType) {
        router.push("/unauthorized");
        return;
      }

      // Cek owner ID jika diberikan
      if (ownerId && user?.id !== ownerId) {
        router.push("/unauthorized");
        return;
      }
    }
  }, [user, loading, router, userType, ownerId]);

  if (loading) {
    return <Loading />;
  }

  if (
    !user ||
    (userType && user.user_type !== userType) ||
    (ownerId && user.id !== ownerId)
  ) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
