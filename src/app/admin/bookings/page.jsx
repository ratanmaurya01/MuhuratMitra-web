
"use client";

import { useCallback, useEffect, useState } from "react";
import {
    Search,
    RefreshCw,
    CalendarDays,
    Clock3,
    UserRound,
    Eye,
    X,
    MapPin,
    Phone,
    Mail,
    IndianRupee,
    Filter,
    ChevronLeft,
    ChevronRight,
    Loader2,
    ClipboardList,
} from "lucide-react";

import {
    getAllBookings,
    getAdminBookingById,
    updateAdminBookingStatus,
} from "@/services/adminService";

const STATUS_OPTIONS = [
    "pending",
    "accepted",
    "rejected",
    "completed",
    "cancelled",
];

const STATUS_STYLES = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    accepted: "bg-blue-50 text-blue-700 border-blue-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-gray-100 text-gray-600 border-gray-200",
};

const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "—";

    return parsed.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatTime = (time) => {
    if (!time) return "—";

    const value = String(time).slice(0, 5);
    const [hours, minutes] = value.split(":");

    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return "—";

    return `₹${Number(amount).toLocaleString("en-IN")}`;
};

function StatusBadge({ status }) {
    const value = status?.toLowerCase() || "pending";

    return (
        <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                STATUS_STYLES[value] || STATUS_STYLES.pending
            }`}
        >
            {value}
        </span>
    );
}

function StatCard({ title, value, icon: Icon, color }) {
    return (
        <div className="rounded-2xl border border-[#eee3d8] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-[#82736b]">{title}</p>
                    <h3 className="mt-2 text-2xl font-bold text-[#39251d]">
                        {value}
                    </h3>
                </div>

                <div className={`rounded-xl p-3 ${color}`}>
                    <Icon size={22} />
                </div>
            </div>
        </div>
    );
}

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [bookingType, setBookingType] = useState("");

    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 0,
        limit: 20,
    });

    const [selectedBooking, setSelectedBooking] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState("");

    
const fetchBookings = useCallback(async (showLoader = true) => {
    try {
        if (showLoader) setLoading(true);
        else setRefreshing(true);

        setError("");

        const response = await getAllBookings({
            page,
            limit: 20,
            search: search.trim(),
            status,
            booking_type: bookingType,
        });

        console.log("Bookings API Response:", response);

        if (response?.success === false) {
            throw new Error(response.message || "Unable to fetch bookings.");
        }

        setBookings(
            Array.isArray(response?.data) ? response.data : []
        );

        setPagination(
            response?.pagination || {
                total: response?.data?.length || 0,
                totalPages: 1,
                limit: 20,
            }
        );

    } catch (err) {
        console.error("Fetch Bookings Error:", err);
        setError(err.message || "Something went wrong.");
        setBookings([]);
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
}, [page, search, status, bookingType]);


    useEffect(() => {
        const timer = setTimeout(() => {
            fetchBookings();
        }, 350);

        return () => clearTimeout(timer);
    }, [fetchBookings]);

    const openBookingDetails = async (id) => {
        try {
            setDetailsLoading(true);
            setSelectedBooking(null);

            const response = await getAdminBookingById(id);

            if (response?.success === false) {
                throw new Error(response.message || "Unable to load details.");
            }

            setSelectedBooking(response?.data || null);
        } catch (err) {
            alert(err.message || "Unable to load booking details.");
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleStatusUpdate = async (booking, nextStatus) => {
        if (!booking?.id || !nextStatus) return;

        if (booking.status === nextStatus) return;

        const confirmed = window.confirm(
            `Are you sure you want to change this booking status to ${nextStatus}?`
        );

        if (!confirmed) return;

        try {
            setUpdatingId(booking.id);

            const response = await updateAdminBookingStatus(
                booking.id,
                nextStatus
            );

            if (response?.success === false) {
                throw new Error(response.message || "Status update failed.");
            }

            await fetchBookings(false);

            if (selectedBooking?.id === booking.id) {
                setSelectedBooking((prev) => ({
                    ...prev,
                    status: nextStatus,
                }));
            }
        } catch (err) {
            alert(err.message || "Unable to update booking status.");
        } finally {
            setUpdatingId(null);
        }
    };

    const resetFilters = () => {
        setSearch("");
        setStatus("");
        setBookingType("");
        setPage(1);
    };

    const changeFilter = (setter, value) => {
        setter(value);
        setPage(1);
    };

    const totalPages = pagination.totalPages || 1;

    return (
        <div className="space-y-6 pb-10">

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-[#d6531d]">
                        Admin Management
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-[#39251d] sm:text-3xl">
                        Bookings
                    </h1>

                    <p className="mt-1 text-sm text-[#82736b]">
                        Manage Puja and Service bookings.
                    </p>
                </div>

                <button
                    onClick={() => fetchBookings(false)}
                    disabled={refreshing}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#eadfd4] bg-white px-4 py-3 text-sm font-semibold text-[#39251d] hover:bg-[#fff8ec] disabled:opacity-60"
                >
                    <RefreshCw
                        size={17}
                        className={refreshing ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Bookings"
                    value={pagination.total}
                    icon={ClipboardList}
                    color="bg-orange-50 text-[#d6531d]"
                />

                <StatCard
                    title="Current Page"
                    value={page}
                    icon={CalendarDays}
                    color="bg-blue-50 text-blue-600"
                />

                <StatCard
                    title="Total Pages"
                    value={pagination.totalPages || 0}
                    icon={Filter}
                    color="bg-purple-50 text-purple-600"
                />

                <StatCard
                    title="Showing Results"
                    value={bookings.length}
                    icon={UserRound}
                    color="bg-emerald-50 text-emerald-600"
                />
            </div>

            {/* Filters */}
            <div className="rounded-2xl border border-[#eee3d8] bg-white p-4 shadow-sm">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">

                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9b8c82]"
                        />

                        <input
                            value={search}
                            onChange={(e) =>
                                changeFilter(setSearch, e.target.value)
                            }
                            placeholder="Search booking, devotee, mobile..."
                            className="w-full rounded-xl border border-[#eadfd4] py-3 pl-10 pr-3 text-sm outline-none focus:border-[#d6531d]"
                        />
                    </div>

                    <select
                        value={bookingType}
                        onChange={(e) =>
                            changeFilter(setBookingType, e.target.value)
                        }
                        className="rounded-xl border border-[#eadfd4] bg-white px-3 py-3 text-sm outline-none focus:border-[#d6531d]"
                    >
                        <option value="">All Booking Types</option>
                        <option value="puja">Puja Booking</option>
                        <option value="service">Service Booking</option>
                    </select>

                    <select
                        value={status}
                        onChange={(e) =>
                            changeFilter(setStatus, e.target.value)
                        }
                        className="rounded-xl border border-[#eadfd4] bg-white px-3 py-3 text-sm outline-none focus:border-[#d6531d]"
                    >
                        <option value="">All Statuses</option>
                        {STATUS_OPTIONS.map((item) => (
                            <option key={item} value={item}>
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={resetFilters}
                        className="rounded-xl border border-[#eadfd4] px-4 py-3 text-sm font-semibold text-[#6f5a4e] hover:bg-[#fff8ec]"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                    <button
                        onClick={() => fetchBookings()}
                        className="ml-2 font-bold underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Booking Table */}
            <div className="overflow-hidden rounded-2xl border border-[#eee3d8] bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-[#eee3d8] px-5 py-4">
                    <div>
                        <h2 className="font-bold text-[#39251d]">
                            All Bookings
                        </h2>
                        <p className="mt-1 text-xs text-[#82736b]">
                            {pagination.total} total records
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex min-h-64 items-center justify-center">
                        <Loader2 className="animate-spin text-[#d6531d]" size={30} />
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
                        <ClipboardList size={42} className="text-[#c8b7a8]" />
                        <h3 className="mt-4 font-bold text-[#39251d]">
                            No bookings found
                        </h3>
                        <p className="mt-1 text-sm text-[#82736b]">
                            Try changing your search or filters.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1050px] text-left">
                                <thead className="bg-[#fffaf4] text-xs uppercase tracking-wide text-[#82736b]">
                                    <tr>
                                        <th className="px-5 py-4">Booking</th>
                                        <th className="px-5 py-4">Devotee</th>
                                        <th className="px-5 py-4">Pandit</th>
                                        <th className="px-5 py-4">Type</th>
                                        <th className="px-5 py-4">Date & Time</th>
                                        <th className="px-5 py-4">Amount</th>
                                        <th className="px-5 py-4">Status</th>
                                        <th className="px-5 py-4">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-[#f0e8df]">
                                    {bookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-[#fffdf9]">
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-[#39251d]">
                                                    {booking.booking_number || `#${booking.id}`}
                                                </p>
                                                <p className="mt-1 text-xs text-[#9b8c82]">
                                                    ID: {booking.id}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="font-medium text-[#39251d]">
                                                    {booking.devotee_name || booking.registered_devotee_name || "—"}
                                                </p>
                                                <p className="mt-1 text-xs text-[#82736b]">
                                                    {booking.devotee_mobile || "—"}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-[#514139]">
                                                {booking.pandit_name || "—"}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-semibold capitalize text-[#d6531d]">
                                                    {booking.booking_type || "—"}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="text-sm font-medium text-[#39251d]">
                                                    {formatDate(booking.booking_date)}
                                                </p>
                                                <p className="mt-1 text-xs text-[#82736b]">
                                                    {formatTime(booking.booking_time)}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4 text-sm font-semibold text-[#39251d]">
                                                {formatAmount(booking.service_price)}
                                            </td>

                                            <td className="px-5 py-4">
                                                <StatusBadge status={booking.status} />
                                            </td>

                                            <td className="px-5 py-4">
                                                <button
                                                    onClick={() => openBookingDetails(booking.id)}
                                                    className="inline-flex items-center gap-2 rounded-lg border border-[#eadfd4] px-3 py-2 text-xs font-semibold text-[#d6531d] hover:bg-orange-50"
                                                >
                                                    <Eye size={15} />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col gap-3 border-t border-[#eee3d8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-[#82736b]">
                                Page {page} of {totalPages}
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    disabled={page <= 1}
                                    onClick={() => setPage((prev) => prev - 1)}
                                    className="rounded-lg border border-[#eadfd4] p-2 disabled:opacity-40"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                <span className="min-w-10 text-center text-sm font-semibold text-[#39251d]">
                                    {page}
                                </span>

                                <button
                                    disabled={page >= totalPages}
                                    onClick={() => setPage((prev) => prev + 1)}
                                    className="rounded-lg border border-[#eadfd4] p-2 disabled:opacity-40"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Booking Details Modal */}
            {(detailsLoading || selectedBooking) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                        <div className="sticky top-0 flex items-center justify-between border-b border-[#eee3d8] bg-white px-5 py-4">
                            <div>
                                <h2 className="text-lg font-bold text-[#39251d]">
                                    Booking Details
                                </h2>
                                {selectedBooking && (
                                    <p className="mt-1 text-xs text-[#82736b]">
                                        {selectedBooking.booking_number}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="rounded-full p-2 hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {detailsLoading ? (
                            <div className="flex min-h-64 items-center justify-center">
                                <Loader2 className="animate-spin text-[#d6531d]" size={30} />
                            </div>
                        ) : selectedBooking && (
                            <div className="space-y-5 p-5">

                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs text-[#82736b]">
                                            Booking Number
                                        </p>
                                        <h3 className="mt-1 font-bold text-[#39251d]">
                                            {selectedBooking.booking_number || `#${selectedBooking.id}`}
                                        </h3>
                                    </div>
                                    <StatusBadge status={selectedBooking.status} />
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div className="rounded-xl bg-[#fffaf4] p-4">
                                        <p className="text-xs text-[#82736b]">
                                            Booking Type
                                        </p>
                                        <p className="mt-1 font-semibold capitalize text-[#39251d]">
                                            {selectedBooking.booking_type}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-[#fffaf4] p-4">
                                        <p className="text-xs text-[#82736b]">
                                            Amount
                                        </p>
                                        <p className="mt-1 font-semibold text-[#39251d]">
                                            {formatAmount(selectedBooking.service_price)}
                                        </p>
                                    </div>
                                </div>

                                <section>
                                    <h3 className="mb-3 font-bold text-[#39251d]">
                                        Devotee Information
                                    </h3>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <InfoItem
                                            icon={UserRound}
                                            label="Name"
                                            value={selectedBooking.devotee_name || selectedBooking.registered_devotee_name}
                                        />
                                        <InfoItem
                                            icon={Phone}
                                            label="Mobile"
                                            value={selectedBooking.devotee_mobile}
                                        />
                                        <InfoItem
                                            icon={Mail}
                                            label="Email"
                                            value={selectedBooking.devotee_email}
                                        />
                                        <InfoItem
                                            icon={MapPin}
                                            label="City"
                                            value={selectedBooking.city}
                                        />
                                    </div>
                                </section>

                                <section>
                                    <h3 className="mb-3 font-bold text-[#39251d]">
                                        Booking Information
                                    </h3>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <InfoItem
                                            icon={UserRound}
                                            label="Pandit"
                                            value={selectedBooking.pandit_name}
                                        />
                                        <InfoItem
                                            icon={CalendarDays}
                                            label="Booking Date"
                                            value={formatDate(selectedBooking.booking_date)}
                                        />
                                        <InfoItem
                                            icon={Clock3}
                                            label="Booking Time"
                                            value={formatTime(selectedBooking.booking_time)}
                                        />
                                        <InfoItem
                                            icon={ClipboardList}
                                            label="Puja / Service"
                                            value={
                                                selectedBooking.booking_type === "puja"
                                                    ? selectedBooking.puja_name || `Puja #${selectedBooking.puja_id || "—"}`
                                                    : selectedBooking.service_name || `Service #${selectedBooking.service_id || "—"}`
                                            }
                                        />
                                    </div>
                                </section>

                                <section>
                                    <h3 className="mb-2 font-bold text-[#39251d]">
                                        Address
                                    </h3>
                                    <p className="rounded-xl bg-[#fffaf4] p-4 text-sm text-[#514139]">
                                        {selectedBooking.address || "No address provided"}
                                    </p>
                                </section>

                                <section>
                                    <h3 className="mb-2 font-bold text-[#39251d]">
                                        Special Instructions
                                    </h3>
                                    <p className="rounded-xl bg-[#fffaf4] p-4 text-sm text-[#514139]">
                                        {selectedBooking.special_instructions || "No special instructions"}
                                    </p>
                                </section>

                                <section>
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <h3 className="font-bold text-[#39251d]">
                                            Payment Status
                                        </h3>
                                        <span className="rounded-full bg-[#fff3e8] px-3 py-1 text-xs font-semibold capitalize text-[#d6531d]">
                                            {selectedBooking.payment_status || "pending"}
                                        </span>
                                    </div>
                                </section>

                                <section className="border-t border-[#eee3d8] pt-5">
                                    <label className="mb-2 block text-sm font-semibold text-[#39251d]">
                                        Update Booking Status
                                    </label>

                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <select
                                            id="booking-status-select"
                                            defaultValue={selectedBooking.status}
                                            className="min-w-0 flex-1 rounded-xl border border-[#eadfd4] bg-white px-3 py-3 text-sm outline-none focus:border-[#d6531d]"
                                        >
                                            {STATUS_OPTIONS.map((item) => (
                                                <option
                                                    key={item}
                                                    value={item}
                                                    disabled={
                                                        item === selectedBooking.status ||
                                                        !({
                                                            pending: ["accepted", "rejected", "cancelled"],
                                                            accepted: ["completed", "cancelled"],
                                                            rejected: [],
                                                            completed: [],
                                                            cancelled: [],
                                                        }[selectedBooking.status] || []).includes(item)
                                                    }
                                                >
                                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                                </option>
                                            ))}
                                        </select>

                                        <button
                                            disabled={updatingId === selectedBooking.id}
                                            onClick={() => {
                                                const nextStatus = document.getElementById(
                                                    "booking-status-select"
                                                )?.value;

                                                handleStatusUpdate(
                                                    selectedBooking,
                                                    nextStatus
                                                );
                                            }}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d6531d] px-5 py-3 text-sm font-semibold text-white hover:bg-[#b94315] disabled:opacity-60"
                                        >
                                            {updatingId === selectedBooking.id && (
                                                <Loader2 size={16} className="animate-spin" />
                                            )}
                                            Update Status
                                        </button>
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="flex min-w-0 items-start gap-3 rounded-xl border border-[#f0e8df] p-3">
            <div className="rounded-lg bg-orange-50 p-2 text-[#d6531d]">
                <Icon size={17} />
            </div>

            <div className="min-w-0">
                <p className="text-xs text-[#82736b]">{label}</p>
                <p className="mt-1 break-words text-sm font-medium text-[#39251d]">
                    {value || "—"}
                </p>
            </div>
        </div>
    );
}
