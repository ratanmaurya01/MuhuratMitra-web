

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Search,
    RefreshCw,
    Users,
    UserCheck,
    UserX,
    Eye,
    X,
    Mail,
    Phone,
    CalendarDays,
    ShieldCheck,
    Loader2,
    CheckCircle2,
    Ban,
    Filter,
} from "lucide-react";

import {
    getAllUsers,
    getUserById,
    updateUserStatus,
} from "@/services/adminService";

const TABS = [
    { key: "all", label: "All Users", icon: Users },
    { key: "active", label: "Active", icon: UserCheck },
    { key: "blocked", label: "Blocked", icon: UserX },
];

function getUsersArray(response) {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    if (Array.isArray(response?.data?.users)) return response.data.users;
    if (Array.isArray(response?.users)) return response.users;
    return [];
}

function getUserStatus(user) {
    const status = String(user?.status || "active").toLowerCase();
    return status === "blocked" ? "blocked" : "active";
}

function formatDate(date) {
    if (!date) return "—";

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) return "—";

    return value.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

const STATUS_STYLES = {
    active: "bg-green-50 text-green-700",
    blocked: "bg-red-50 text-red-700",
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState("");

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const response = await getAllUsers();
            setUsers(getUsersArray(response));
        } catch (err) {
            console.error("Fetch Users Error:", err);
            setError(err?.message || "Unable to load users.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const counts = useMemo(() => ({
        all: users.length,
        active: users.filter((user) => getUserStatus(user) === "active").length,
        blocked: users.filter((user) => getUserStatus(user) === "blocked").length,
    }), [users]);

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();

        return users.filter((user) => {
            const status = getUserStatus(user);

            const matchesTab =
                activeTab === "all" || status === activeTab;

            const matchesSearch =
                !query ||
                String(user.name || "").toLowerCase().includes(query) ||
                String(user.email || "").toLowerCase().includes(query) ||
                String(user.mobile || "").includes(query);

            return matchesTab && matchesSearch;
        });
    }, [users, activeTab, search]);

   
    const handleStatusChange = async (user) => {
    const currentStatus = getUserStatus(user);

    const nextStatus =
        currentStatus === "blocked" ? "active" : "blocked";

    const confirmed = window.confirm(
        `Are you sure you want to ${
            nextStatus === "blocked" ? "block" : "unblock"
        } this user?`
    );

    if (!confirmed) return;

    try {
        setActionLoading(user.id);

        const response = await updateUserStatus(
            user.id,
            nextStatus
        );

        if (response?.success === false) {
            throw new Error(
                response.message || "Unable to update user status."
            );
        }

        setSelectedUser(null);
        await fetchUsers();

    } catch (error) {
        console.error("Update User Status Error:", error);
        alert(error?.message || "Unable to update user status.");
    } finally {
        setActionLoading(null);
    }
};


    return (
        <div className="min-w-0 space-y-6 pb-8">

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-[#a66a48]">
                        ADMINISTRATION / MANAGEMENT
                    </p>

                    <h1 className="mt-2 text-2xl font-bold text-[#573323] sm:text-3xl">
                        Users Management
                    </h1>

                    <p className="mt-2 text-sm text-[#9a8172]">
                        Manage registered devotees and their accounts.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchUsers}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e8ddce] bg-white px-4 py-3 text-sm font-semibold text-[#705647] transition hover:bg-[#fffaf3] disabled:opacity-50"
                >
                    <RefreshCw
                        size={17}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                    {
                        label: "Total Users",
                        value: counts.all,
                        icon: Users,
                        color: "text-blue-600",
                        bg: "bg-blue-50",
                    },
                    {
                        label: "Active Users",
                        value: counts.active,
                        icon: UserCheck,
                        color: "text-green-600",
                        bg: "bg-green-50",
                    },
                    {
                        label: "Blocked Users",
                        value: counts.blocked,
                        icon: UserX,
                        color: "text-red-600",
                        bg: "bg-red-50",
                    },
                ].map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.label}
                            className="rounded-2xl border border-[#e8ddce] bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                    {item.label}
                                </p>

                                <div className={`rounded-xl p-2 ${item.bg}`}>
                                    <Icon size={21} className={item.color} />
                                </div>
                            </div>

                            <h2 className="mt-4 text-3xl font-bold text-[#573323]">
                                {item.value}
                            </h2>
                        </div>
                    );
                })}
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
                {TABS.map((tab) => {
                    const Icon = tab.icon;

                    return (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key)}
                            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${activeTab === tab.key
                                ? "border-[#8b472e] bg-[#8b472e] text-white"
                                : "border-[#e8ddce] bg-white text-[#705647] hover:bg-[#fffaf3]"
                                }`}
                        >
                            <Icon size={17} />
                            {tab.label}

                            <span className={`rounded-full px-2 py-0.5 text-xs ${activeTab === tab.key
                                ? "bg-white/20 text-white"
                                : "bg-[#f5ede4] text-[#705647]"
                                }`}>
                                {counts[tab.key]}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 rounded-xl border border-[#e8ddce] bg-white px-4 py-3">
                <Search size={19} className="shrink-0 text-gray-400" />

                <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by name, email or mobile..."
                    className="w-full bg-transparent text-sm text-gray-700 outline-none"
                />

                {search && (
                    <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="text-gray-400 hover:text-gray-700"
                    >
                        <X size={17} />
                    </button>
                )}
            </div>

            {/* User List */}
            <div className="overflow-hidden rounded-2xl border border-[#e8ddce] bg-white shadow-sm">

                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee4da] px-5 py-4">
                    <div>
                        <h2 className="font-bold text-[#573323]">
                            {TABS.find((tab) => tab.key === activeTab)?.label}
                        </h2>

                        <p className="mt-1 text-xs text-gray-400">
                            Showing {filteredUsers.length} of {counts.all} users
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#9a8172]">
                        <Filter size={15} />
                        User Directory
                    </div>
                </div>

                {error && (
                    <div className="m-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                        <button
                            type="button"
                            onClick={fetchUsers}
                            className="ml-2 font-semibold underline"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2
                            size={30}
                            className="animate-spin text-[#8b472e]"
                        />
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="px-5 py-16 text-center">
                        <Users size={42} className="mx-auto text-gray-300" />

                        <h3 className="mt-4 font-semibold text-gray-700">
                            No Users Found
                        </h3>

                        <p className="mt-1 text-sm text-gray-400">
                            {search
                                ? "No users match your search."
                                : "There are no users in this section."}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-[#eee4da] text-xs uppercase tracking-wider text-[#9a8172]">
                                        <th className="px-5 py-4 font-semibold">User</th>
                                        <th className="px-5 py-4 font-semibold">Mobile</th>
                                        <th className="px-5 py-4 font-semibold">Joined</th>
                                        <th className="px-5 py-4 font-semibold">Status</th>
                                        <th className="px-5 py-4 text-right font-semibold">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredUsers.map((user, index) => {
                                        const status = getUserStatus(user);

                                        return (
                                            <tr
                                                key={user.id || index}
                                                className="border-b border-[#f1e9e1] last:border-0 hover:bg-[#fffdf9]"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5e9df] font-bold text-[#8b472e]">
                                                            {(user.name || "U").charAt(0).toUpperCase()}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-semibold text-[#573323]">
                                                                {user.name || "Unknown User"}
                                                            </p>
                                                            <p className="truncate text-xs text-gray-400">
                                                                {user.email || "No email"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 text-sm text-gray-600">
                                                    {user.mobile || "—"}
                                                </td>

                                                <td className="px-5 py-4 text-sm text-gray-600">
                                                    {formatDate(user.created_at)}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[status]}`}>
                                                        {status}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedUser(user)}
                                                            title="View Details"
                                                            className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                                                        >
                                                            <Eye size={17} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleStatusChange(user)}
                                                            disabled={actionLoading === user.id}
                                                            title={status === "blocked" ? "Unblock User" : "Block User"}
                                                            className={`rounded-lg p-2 disabled:opacity-50 ${status === "blocked"
                                                                ? "bg-green-50 text-green-700 hover:bg-green-100"
                                                                : "bg-red-50 text-red-600 hover:bg-red-100"
                                                                }`}
                                                        >
                                                            {actionLoading === user.id ? (
                                                                <Loader2 size={17} className="animate-spin" />
                                                            ) : status === "blocked" ? (
                                                                <CheckCircle2 size={17} />
                                                            ) : (
                                                                <Ban size={17} />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="divide-y divide-[#f1e9e1] md:hidden">
                            {filteredUsers.map((user, index) => {
                                const status = getUserStatus(user);

                                return (
                                    <div key={user.id || index} className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f5e9df] font-bold text-[#8b472e]">
                                                {(user.name || "U").charAt(0).toUpperCase()}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate font-semibold text-[#573323]">
                                                    {user.name || "Unknown User"}
                                                </h3>
                                                <p className="truncate text-xs text-gray-500">
                                                    {user.email || "No email"}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-400">
                                                    {user.mobile || "No mobile"}
                                                </p>
                                            </div>

                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[status]}`}>
                                                {status}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-xs text-gray-400">
                                                Joined {formatDate(user.created_at)}
                                            </span>

                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedUser(user)}
                                                    className="rounded-lg border border-gray-200 p-2 text-gray-600"
                                                >
                                                    <Eye size={17} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleStatusChange(user)}
                                                    disabled={actionLoading === user.id}
                                                    className={`rounded-lg p-2 ${status === "blocked"
                                                        ? "bg-green-50 text-green-700"
                                                        : "bg-red-50 text-red-600"
                                                        }`}
                                                >
                                                    {actionLoading === user.id ? (
                                                        <Loader2 size={17} className="animate-spin" />
                                                    ) : status === "blocked" ? (
                                                        <CheckCircle2 size={17} />
                                                    ) : (
                                                        <Ban size={17} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    onClick={() => setSelectedUser(null)}
                >
                    <div
                        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-[#a66a48]">
                                    User Profile
                                </p>
                                <h2 className="mt-1 text-xl font-bold text-[#573323]">
                                    User Details
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedUser(null)}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mt-6 space-y-5">
                            <div className="flex items-center gap-3 rounded-xl bg-[#fff8f1] p-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f0dfd1] text-xl font-bold text-[#8b472e]">
                                    {(selectedUser.name || "U").charAt(0).toUpperCase()}
                                </div>

                                <div className="min-w-0">
                                    <h3 className="truncate font-bold text-[#573323]">
                                        {selectedUser.name || "Unknown User"}
                                    </h3>

                                    <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[getUserStatus(selectedUser)]}`}>
                                        {getUserStatus(selectedUser)}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Mail size={18} className="mt-0.5 text-[#a66a48]" />
                                    <div>
                                        <p className="text-xs text-gray-400">Email Address</p>
                                        <p className="break-all text-sm font-medium text-gray-800">
                                            {selectedUser.email || "—"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone size={18} className="mt-0.5 text-[#a66a48]" />
                                    <div>
                                        <p className="text-xs text-gray-400">Mobile Number</p>
                                        <p className="text-sm font-medium text-gray-800">
                                            {selectedUser.mobile || "—"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <ShieldCheck size={18} className="mt-0.5 text-[#a66a48]" />
                                    <div>
                                        <p className="text-xs text-gray-400">Account Role</p>
                                        <p className="text-sm font-medium text-gray-800">
                                            {selectedUser.role || "DEVOTEE"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <CalendarDays size={18} className="mt-0.5 text-[#a66a48]" />
                                    <div>
                                        <p className="text-xs text-gray-400">Registration Date</p>
                                        <p className="text-sm font-medium text-gray-800">
                                            {formatDate(selectedUser.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-5">
                                <button
                                    type="button"
                                    onClick={() => handleStatusChange(selectedUser)}
                                    disabled={actionLoading === selectedUser.id}
                                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50 ${getUserStatus(selectedUser) === "blocked"
                                        ? "bg-green-600 text-white hover:bg-green-700"
                                        : "bg-red-50 text-red-600 hover:bg-red-100"
                                        }`}
                                >
                                    {actionLoading === selectedUser.id ? (
                                        <Loader2 size={17} className="animate-spin" />
                                    ) : getUserStatus(selectedUser) === "blocked" ? (
                                        <CheckCircle2 size={17} />
                                    ) : (
                                        <Ban size={17} />
                                    )}

                                    {getUserStatus(selectedUser) === "blocked"
                                        ? "Unblock User"
                                        : "Block User"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
