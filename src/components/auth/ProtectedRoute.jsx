

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}) {
  const router = useRouter();

  const {
    user,
    loading,
    isAuthenticated,
    getRedirectPath,
  } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (user.status !== "ACTIVE") {
      router.replace(getRedirectPath(user));
      return;
    }

    if (
      allowedRoles.length > 0 &&
      !allowedRoles.includes(user.role)
    ) {
      router.replace(getRedirectPath(user));
    }
  }, [
    loading,
    isAuthenticated,
    user,
    allowedRoles,
    router,
    getRedirectPath,
  ]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (
    user.status !== "ACTIVE" ||
    (allowedRoles.length > 0 &&
      !allowedRoles.includes(user.role))
  ) {
    return null;
  }

  return children;
}
