
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock3,
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  Clock,
  Home,
  LogOut,
  Sparkles,
  Headset,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
export default function PendingApprovalPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  // Account verification
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "PANDIT") {
      router.replace("/account");
      return;
    }
    if (user.status === "ACTIVE") {
      router.replace("/pandit/dashboard");
    }
  }, [user, loading, router]);
  // Logout
  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  // Loading
  if (loading || !user || user.status === "ACTIVE") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffdf7]">
        <div className="size-8 animate-spin rounded-full border-4 border-[#ead8c8] border-t-[#c75a2d]" />
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fffdf7] px-4 py-6 sm:px-6">

      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-24 -top-24 size-64 rounded-full bg-[#f9e7d8] opacity-50 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -right-24 size-64 rounded-full bg-[#f9e7d8] opacity-50 blur-3xl" />

      {/* Main Container */}
      <div className="relative w-full max-w-xl">


        {/* Main Card */}
        <div className="overflow-hidden rounded-[24px] border border-[#eadfce] bg-white shadow-[0_8px_30px_rgba(76,48,30,0.07)]">

          {/* Status Banner */}
          <div className="bg-[#fff2e5] px-5 py-7 text-center sm:px-8">

            <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-white shadow-sm">
              <div className="flex size-14 items-center justify-center rounded-full bg-[#fff0df] text-[#c76a35]">
                <Clock3 size={29} strokeWidth={1.7} />
              </div>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-[#f0d2b4] bg-white px-3 py-1.5 text-[10px] font-semibold tracking-wider text-[#b66a35]">
              <span className="size-2 animate-pulse rounded-full bg-[#d97725]" />
              APPLICATION UNDER REVIEW
            </span>

            <h1 className="mt-4 font-display text-2xl font-semibold text-[#39251d] sm:text-3xl">
              Welcome, {user.name?.split(" ")[0]}!
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#806e62]">
              Your Pandit registration has been submitted successfully.
              Our team is currently reviewing your application.
            </p>
          </div>

          {/* Card Content */}
          <div className="space-y-5 p-5 sm:p-7">

            {/* Application Status */}
            <div className="rounded-xl border border-[#f0dfcb] bg-[#fffcf6] p-4">

              <div className="flex items-center gap-3">

                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#fff0df] text-[#bd6439]">
                  <ShieldCheck size={21} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] tracking-wide text-[#978478]">
                    APPLICATION STATUS
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#9b622f]">
                    Pending Admin Approval
                  </p>
                </div>

                <span className="rounded-full bg-[#fff0d7] px-2.5 py-1.5 text-[10px] font-semibold text-[#a56826]">
                  PENDING
                </span>

              </div>

              <div className="mt-4 border-t border-[#eee4d7] pt-3">

                <p className="text-[11px] text-[#978478]">
                  REGISTERED ACCOUNT
                </p>

                <p className="mt-1 text-sm font-semibold text-[#39251d]">
                  {user.name}
                </p>

                <p className="mt-1 text-xs text-[#82736b]">
                  {user.email}
                </p>

                <p className="mt-1 text-xs text-[#82736b]">
                  {user.phone || user.mobile}
                </p>

              </div>
            </div>

            {/* Verification Process */}
            <section>

              <h2 className="font-display text-xl text-[#39251d]">
                What happens next?
              </h2>

              <p className="mt-1 text-xs leading-5 text-[#82736b]">
                Your application goes through these verification steps.
              </p>

              <div className="mt-5 space-y-4">

                {/* Step 1 */}
                <div className="flex gap-3">

                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e6f4e9] text-[#438355]">
                    <CheckCircle2 size={21} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[#39251d]">
                      Registration Completed
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#82736b]">
                      Your Pandit account has been successfully created.
                    </p>

                    <span className="mt-1 inline-block text-[11px] font-medium text-[#438355]">
                      Completed
                    </span>
                  </div>

                </div>

                {/* Step 2 */}
                <div className="flex gap-3">

                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#fff0df] text-[#bd6439]">
                    <Clock size={21} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[#39251d]">
                      Admin Verification
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#82736b]">
                      Our admin team will review your profile and submitted details.
                    </p>

                    <span className="mt-1 inline-block text-[11px] font-medium text-[#bd6439]">
                      In Progress
                    </span>
                  </div>

                </div>

                {/* Step 3 */}
                <div className="flex gap-3">

                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f5f0e9] text-[#a28e80]">
                    <FileCheck size={21} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[#39251d]">
                      Account Activation
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#82736b]">
                      Once approved, you can access your Pandit dashboard and manage bookings.
                    </p>

                    <span className="mt-1 inline-block text-[11px] text-[#978478]">
                      Awaiting Approval
                    </span>
                  </div>

                </div>

              </div>
            </section>

            {/* Information Box */}
            <div className="rounded-xl border border-[#eadfce] bg-[#fcf7ef] p-4">

              <div className="flex items-start gap-3">

                <Sparkles
                  size={19}
                  className="mt-0.5 shrink-0 text-[#bd6439]"
                />

                <div>
                  <h3 className="text-sm font-semibold text-[#39251d]">
                    Thank you for joining MuhuratMitra!
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[#82736b]">
                    We appreciate your interest in joining our spiritual community.
                    Please keep your registered contact details available for verification updates.
                  </p>
                </div>

              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 border-t border-[#eee4d7] pt-5 sm:flex-row">

              <Link
                href="/"
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#e6ddce] px-4 py-3 text-sm font-medium text-[#71594b] transition hover:bg-[#fcf7ef]"
              >
                <Home size={17} />
                Back to Home
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#8c4a32] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#713c2c]"
              >
                <LogOut size={17} />
                Logout
              </button>

            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#a18e81]">
          <Headset size={14} />
          Need assistance? Contact MuhuratMitra Support
        </div>

      </div>
    </main>
  );
}
