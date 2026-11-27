"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
    return (
        <ProtectedRoute allowedRoles={["ADMIN"]}>
            <div className="min-h-screen bg-[#faf7f1]">
                <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 px-5 py-6 lg:grid-cols-[270px_minmax(0,1fr)]">

                    <aside className="hidden lg:block">
                        <AdminSidebar />
                    </aside>

                    <main className="min-w-0">
                        {children}
                    </main>

                </div>
            </div>
        </ProtectedRoute>
    );
}