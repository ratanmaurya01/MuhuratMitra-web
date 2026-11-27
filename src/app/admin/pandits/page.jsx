
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Search,
    RefreshCw,
    Eye,
    CheckCircle2,
    XCircle,
    Clock3,
    Users,
    UserCheck,
    Loader2,
    X,
    ShieldCheck,
    Mail,
    Phone,
    CalendarDays,
} from "lucide-react";

import {
    getAllPandits,
    getPanditById,
    approvePandit,
    rejectPandit,
} from "@/services/adminService";

const TABS = [
    { key: "pending", label: "Pending", icon: Clock3 },
    { key: "active", label: "Approved", icon: UserCheck },
    { key: "rejected", label: "Rejected", icon: XCircle },
    { key: "all", label: "All Pandits", icon: Users },
];

const STATUS_STYLES = {
    pending: "bg-orange-50 text-orange-700",
    active: "bg-green-50 text-green-700",
    rejected: "bg-red-50 text-red-700",
    blocked: "bg-gray-100 text-gray-600",
};

export default function AdminPanditsPage() {
    const [pandits, setPandits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("pending");
    const [selectedPandit, setSelectedPandit] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    // Fetch all Pandits
    const fetchPandits = useCallback(async () => {
        try {
            setLoading(true);

            const response = await getAllPandits("all");

            if (response?.success) {
                setPandits(Array.isArray(response.data) ? response.data : []);
            } else {
                setPandits([]);
            }
        } catch (error) {
            console.error("Fetch Pandits Error:", error);
            setPandits([]);
            alert(error.message || "Failed to load Pandits");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPandits();
    }, [fetchPandits]);

    // Normalize status
    const getStatus = (status) => status?.toLowerCase() || "pending";

    // Status counts
    const counts = useMemo(() => {
        return {
            pending: pandits.filter(
                (p) => getStatus(p.status) === "pending"
            ).length,

            active: pandits.filter(
                (p) => getStatus(p.status) === "active"
            ).length,

            rejected: pandits.filter(
                (p) => getStatus(p.status) === "rejected"
            ).length,

            all: pandits.length,
        };
    }, [pandits]);

    // Filter by tab and search
    const filteredPandits = useMemo(() => {
        return pandits.filter((pandit) => {
            const status = getStatus(pandit.status);

            const matchesTab =
                activeTab === "all" || status === activeTab;

            const searchValue = search.trim().toLowerCase();

            const matchesSearch =
                !searchValue ||
                pandit.name?.toLowerCase().includes(searchValue) ||
                pandit.email?.toLowerCase().includes(searchValue) ||
                String(pandit.mobile || "").includes(searchValue);

            return matchesTab && matchesSearch;
        });
    }, [pandits, activeTab, search]);

    // View details
    const handleViewDetails = async (id) => {
        try {
            setDetailsLoading(true);
            setSelectedPandit(null);

            const response = await getPanditById(id);

            if (response?.success) {
                setSelectedPandit(response.data);
            } else {
                alert(response?.message || "Pandit details not found");
            }
        } catch (error) {
            console.error("Pandit Details Error:", error);
            alert(error.message || "Unable to fetch Pandit details");
        } finally {
            setDetailsLoading(false);
        }
    };

    // Approve / Reject
    const handleAction = async (id, action) => {
        const confirmed = window.confirm(
            `Are you sure you want to ${action} this Pandit?`
        );

        if (!confirmed) return;

        try {
            setActionLoading(`${id}-${action}`);

            const response =
                action === "approve"
                    ? await approvePandit(id)
                    : await rejectPandit(id);

            if (response?.success === false) {
                throw new Error(response.message || `Failed to ${action} Pandit`);
            }

            setSelectedPandit(null);

            await fetchPandits();

            alert(
                action === "approve"
                    ? "Pandit approved successfully!"
                    : "Pandit rejected successfully!"
            );
        } catch (error) {
            console.error(`${action} Pandit Error:`, error);
            alert(error.message || `Failed to ${action} Pandit`);
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-[#a66a48]">
                        ADMINISTRATION / MANAGEMENT
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-[#573323]">
                        Pandit Management
                    </h1>

                    <p className="mt-2 text-sm text-[#9a8172]">
                        Review, approve and manage all registered Pandits.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchPandits}
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

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                {[
                    {
                        label: "Total Pandits",
                        value: counts.all,
                        icon: Users,
                        color: "text-blue-600",
                        bg: "bg-blue-50",
                    },
                    {
                        label: "Pending Requests",
                        value: counts.pending,
                        icon: Clock3,
                        color: "text-orange-600",
                        bg: "bg-orange-50",
                    },
                    {
                        label: "Approved Pandits",
                        value: counts.active,
                        icon: UserCheck,
                        color: "text-green-600",
                        bg: "bg-green-50",
                    },
                    {
                        label: "Rejected Pandits",
                        value: counts.rejected,
                        icon: XCircle,
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
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-sm text-gray-500">
                                    {item.label}
                                </p>

                                <div className={`rounded-xl p-2 ${item.bg}`}>
                                    <Icon size={20} className={item.color} />
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
                            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                                activeTab === tab.key
                                    ? "border-[#8b472e] bg-[#8b472e] text-white"
                                    : "border-[#e8ddce] bg-white text-[#705647] hover:bg-[#fffaf3]"
                            }`}
                        >
                            <Icon size={17} />
                            {tab.label}

                            <span
                                className={`rounded-full px-2 py-0.5 text-xs ${
                                    activeTab === tab.key
                                        ? "bg-white/20 text-white"
                                        : "bg-[#f5ede4] text-[#705647]"
                                }`}
                            >
                                {counts[tab.key]}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 rounded-xl border border-[#e8ddce] bg-white px-4 py-3">
                <Search className="shrink-0 text-gray-400" size={19} />

                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
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

            {/* Pandit List */}
            <div className="overflow-hidden rounded-2xl border border-[#e8ddce] bg-white shadow-sm">

                <div className="flex flex-col justify-between gap-2 border-b border-[#eee4da] px-5 py-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="font-bold text-[#573323]">
                            {TABS.find((tab) => tab.key === activeTab)?.label}
                        </h2>

                        <p className="mt-1 text-xs text-gray-400">
                            Showing {filteredPandits.length} of {counts.all} Pandits
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2
                            className="animate-spin text-[#8b472e]"
                            size={30}
                        />
                    </div>
                ) : filteredPandits.length === 0 ? (
                    <div className="px-5 py-16 text-center">
                        <Users
                            className="mx-auto text-gray-300"
                            size={42}
                        />

                        <h3 className="mt-4 font-semibold text-gray-700">
                            No Pandits Found
                        </h3>

                        <p className="mt-1 text-sm text-gray-400">
                            {search
                                ? "No Pandits match your search."
                                : `There are no ${activeTab === "all" ? "" : activeTab} Pandits here.`}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-[#f1e9e1]">
                        {filteredPandits.map((pandit) => {
                            const status = getStatus(pandit.status);
                            const isPending = status === "pending";

                            return (
                                <div
                                    key={pandit.id}
                                    className="flex flex-col justify-between gap-4 p-5 transition hover:bg-[#fffdf9] sm:flex-row sm:items-center"
                                >
                                    {/* Pandit Info */}
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f5e9df] text-lg font-bold text-[#8b472e]">
                                            {pandit.name?.charAt(0)?.toUpperCase() || "P"}
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="truncate font-semibold text-[#573323]">
                                                {pandit.name || "Unnamed Pandit"}
                                            </h3>

                                            <p className="truncate text-sm text-gray-500">
                                                {pandit.email || "No email"}
                                            </p>

                                            <p className="text-xs text-gray-400">
                                                {pandit.mobile || "No mobile"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status and Actions */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                                STATUS_STYLES[status] ||
                                                "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {status}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => handleViewDetails(pandit.id)}
                                            disabled={detailsLoading}
                                            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                                            title="View Details"
                                        >
                                            <Eye size={17} />
                                        </button>

                                        {isPending && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleAction(pandit.id, "approve")
                                                    }
                                                    disabled={!!actionLoading}
                                                    className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                                                >
                                                    {actionLoading === `${pandit.id}-approve` ? (
                                                        <Loader2
                                                            size={14}
                                                            className="animate-spin"
                                                        />
                                                    ) : (
                                                        <CheckCircle2 size={15} />
                                                    )}
                                                    Approve
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleAction(pandit.id, "reject")
                                                    }
                                                    disabled={!!actionLoading}
                                                    className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                                                >
                                                    {actionLoading === `${pandit.id}-reject` ? (
                                                        <Loader2
                                                            size={14}
                                                            className="animate-spin"
                                                        />
                                                    ) : (
                                                        <XCircle size={15} />
                                                    )}
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {(selectedPandit || detailsLoading) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-[#a66a48]">
                                    Pandit Profile
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-[#573323]">
                                    Pandit Details
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedPandit(null)}
                                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {detailsLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2
                                    className="animate-spin text-[#8b472e]"
                                    size={28}
                                />
                            </div>
                        ) : selectedPandit && (
                            <div className="mt-6 space-y-5">
                                <div className="flex items-center gap-3 rounded-xl bg-[#fff8f1] p-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f0dfd1] text-xl font-bold text-[#8b472e]">
                                        {selectedPandit.name?.charAt(0)?.toUpperCase() || "P"}
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="truncate font-bold text-[#573323]">
                                            {selectedPandit.name || "Unnamed Pandit"}
                                        </h3>

                                        <span
                                            className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                                STATUS_STYLES[getStatus(selectedPandit.status)] ||
                                                "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {selectedPandit.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Mail size={18} className="mt-0.5 text-[#a66a48]" />
                                        <div>
                                            <p className="text-xs text-gray-400">Email Address</p>
                                            <p className="break-all text-sm font-medium text-gray-800">
                                                {selectedPandit.email || "—"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Phone size={18} className="mt-0.5 text-[#a66a48]" />
                                        <div>
                                            <p className="text-xs text-gray-400">Mobile Number</p>
                                            <p className="text-sm font-medium text-gray-800">
                                                {selectedPandit.mobile || "—"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <ShieldCheck size={18} className="mt-0.5 text-[#a66a48]" />
                                        <div>
                                            <p className="text-xs text-gray-400">Role</p>
                                            <p className="text-sm font-medium capitalize text-gray-800">
                                                {selectedPandit.role || "Pandit"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <CalendarDays size={18} className="mt-0.5 text-[#a66a48]" />
                                        <div>
                                            <p className="text-xs text-gray-400">Registration Date</p>
                                            <p className="text-sm font-medium text-gray-800">
                                                {formatDate(selectedPandit.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {getStatus(selectedPandit.status) === "pending" && (
                                    <div className="flex gap-3 border-t border-gray-100 pt-5">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleAction(selectedPandit.id, "approve")
                                            }
                                            disabled={!!actionLoading}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                                        >
                                            <CheckCircle2 size={17} />
                                            Approve
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleAction(selectedPandit.id, "reject")
                                            }
                                            disabled={!!actionLoading}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                                        >
                                            <XCircle size={17} />
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
