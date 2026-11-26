"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

function PanditDashboardContent() {
  const { user } = useAuth();

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <h1 className="text-3xl font-bold">
        Pandit Dashboard
      </h1>
      <p className="mt-2 text-muted-foreground">
        Welcome, {user?.name}
      </p>
    </main>
  );
}

export default function PanditDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["PANDIT"]}>
      <PanditDashboardContent />
    </ProtectedRoute>
  );
}