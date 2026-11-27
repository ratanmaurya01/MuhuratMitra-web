
"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

import PanditSidebar from "@/components/pandit/PanditSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function PanditLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["PANDIT"]}>
      <div className="min-h-screen bg-[#FAF7F2] text-[#35251E]">
        {/* Mobile Header */}
        {/* <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#EADFD2] bg-white px-4 lg:hidden">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="rounded-xl p-2 hover:bg-[#F7F0E8]"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="text-lg font-bold text-[#713F2B]">
                MuhuratMitra
              </p>
              <p className="text-[10px] text-[#92796A]">
                Pandit Dashboard
              </p>
            </div>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3E5D5] font-semibold text-[#8A4B2D]">
            {user?.name?.charAt(0)?.toUpperCase() || "P"}
          </div>
        </header> */}

        <div className="flex min-h-screen">
          {/* Desktop Sidebar */}
          <aside className="hidden w-64 shrink-0 border-r border-[#EADFD2] bg-white lg:block">
            <PanditSidebar />
          </aside>

          {/* Mobile Sidebar */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                aria-label="Close menu overlay"
                className="absolute inset-0 bg-black/40"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              <aside className="relative z-10 h-full w-[280px] max-w-[85%] overflow-y-auto bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-[#EADFD2] p-4">
                  <div>
                    <p className="font-bold text-[#713F2B]">
                      MuhuratMitra
                    </p>
                    <p className="text-xs text-[#92796A]">
                      Pandit Panel
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-lg p-2 hover:bg-[#F7F0E8]"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                <PanditSidebar
                  onNavigate={() => setIsMobileMenuOpen(false)}
                />
              </aside>
            </div>
          )}

          {/* Main Content */}
          <main className="min-w-0 flex-1">
            {/* Desktop Topbar */}
            <div className="hidden h-16 items-center justify-between border-b border-[#EADFD2] bg-white px-6 lg:flex">
              <div>
                <p className="text-sm font-medium text-[#8B7668]">
                  Pandit Panel
                </p>
                <p className="text-xs text-[#B09B8B]">
                  {pathname}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3E5D5] text-[#8A4B2D]">
                    <UserRound size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      {user?.name || "Pandit"}
                    </p>
                    <p className="text-xs text-[#92796A]">
                      Pandit Account
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl border border-[#EADFD2] px-3 py-2 text-sm font-medium text-[#8A4B2D] transition hover:bg-[#FFF5EC]"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile User Info */}
            <div className="flex items-center justify-between border-b border-[#EADFD2] bg-white px-4 py-3 lg:hidden">
              <div>
                <p className="text-sm font-semibold">
                  Welcome, {user?.name || "Pandit"}
                </p>
                <p className="text-xs text-[#92796A]">
                  Manage your Pandit account
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
