"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <main className="mx-auto max-w-7xl px-5 py-10">
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage users, Pandits, Pujas and bookings.
        </p>
      </main>
    </ProtectedRoute>
  );
}