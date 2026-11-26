
"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Clock3, LogOut, ShieldCheck } from "lucide-react";

export default function PanditPendingApprovalPage() {
  const { user, logout } = useAuth();

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <Clock3 size={30} />
        </div>

        <h1 className="text-2xl font-bold">
          Application Under Review
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Thank you, {user?.name || "Pandit"}. Your Pandit
          registration has been submitted successfully.
          Your account will be activated after admin verification.
        </p>

        <div className="mt-6 flex items-center gap-3 rounded-xl bg-muted p-4 text-left">
          <ShieldCheck className="shrink-0 text-primary" size={24} />
          <p className="text-sm text-muted-foreground">
            You will be able to access your Pandit dashboard
            once your application is approved.
          </p>
        </div>

        <button
          onClick={logout}
          className="mt-7 inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium hover:bg-muted"
        >
          <LogOut size={17} />
          Logout
        </button>

        <div className="mt-4">
          <Link href="/" className="text-sm font-medium text-primary hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
