
"use client";

import { useCallback, useEffect, useState } from "react";
import {
    Search,
    RefreshCw,
    CreditCard,
    IndianRupee,
    Clock3,
    CheckCircle2,
    XCircle,
    RotateCcw,
    Eye,
    X,
    CalendarDays,
    UserRound,
    Phone,
    Mail,
    MapPin,
    ClipboardList,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Receipt,
} from "lucide-react";

import {
    getAllPayments,
    getAdminPaymentById,
} from "@/services/adminService";

const PAYMENT_STATUSES = [
    "paid",
    "pending",
    "failed",
    "refunded",
];

const STATUS_STYLES = {
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    failed: "bg-red-50 text-red-700 border-red-200",
    refunded: "bg-purple-50 text-purple-700 border-purple-200",
};

const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return "—";

    return `₹${Number(amount).toLocaleString("en-IN")}`;
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

    const [hours, minutes] = String(time).slice(0, 5).split(":");

    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

function PaymentStatusBadge({ status }) {
    const value = status?.toLowerCase() || "pending";

    return (
        <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                STATUS_STYLES[value] || STATUS_STYLES.pending
            }`}
        >
            {value}
        </span>
    );
}

function StatCard({ title, value, icon: Icon, color, subtitle }) {
    return (
        <div className="rounded-2xl border border-[#eee3d8] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm text-[#82736b]">{title}</p>

                    <h3 className="mt-2 text-2xl font-bold text-[#39251d]">
                        {value}
                    </h3>

                    {subtitle && (
                        <p className="mt-1 text-xs text-[#9b8c82]">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className={`rounded-xl p-3 ${color}`}>
                    <Icon size={22} />
                </div>
            </div>
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

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState([]);

    const [summary, setSummary] = useState({
        total_transactions: 0,
        successful_payments: 0,
        pending_payments: 0,
        failed_payments: 0,
        refunded_payments: 0,
        total_paid: 0,
    });

    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
    });

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [page, setPage] = useState(1);

    const [selectedPayment, setSelectedPayment] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const fetchPayments = useCallback(async (showLoader = true) => {
        try {
            if (showLoader) setLoading(true);
            else setRefreshing(true);

            setError("");

            const response = await getAllPayments({
                page,
                limit: 20,
                search: search.trim(),
                payment_status: paymentStatus,
            });

            console.log("Admin Payments Response:", response);

            if (response?.success === false) {
                throw new Error(
                    response.message || "Unable to fetch payments."
                );
            }

            setPayments(
                Array.isArray(response?.payments)
                    ? response.payments
                    : []
            );

            setSummary(
                response?.summary || {
                    total_transactions: 0,
                    successful_payments: 0,
                    pending_payments: 0,
                    failed_payments: 0,
                    refunded_payments: 0,
                    total_paid: 0,
                }
            );

            setPagination(
                response?.pagination || {
                    total: 0,
                    page: 1,
                    limit: 20,
                    totalPages: 0,
                }
            );
        } catch (err) {
            console.error("Fetch Payments Error:", err);

            setError(err.message || "Something went wrong.");
            setPayments([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [page, search, paymentStatus]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPayments();
        }, 350);

        return () => clearTimeout(timer);
    }, [fetchPayments]);

    const openPaymentDetails = async (bookingId) => {
        try {
            setDetailsLoading(true);
            setSelectedPayment(null);

            const response = await getAdminPaymentById(bookingId);

            if (response?.success === false) {
                throw new Error(
                    response.message || "Unable to fetch payment details."
                );
            }

            setSelectedPayment(response?.data || null);
        } catch (err) {
            alert(err.message || "Unable to load payment details.");
        } finally {
            setDetailsLoading(false);
        }
    };

    const resetFilters = () => {
        setSearch("");
        setPaymentStatus("");
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
                        Payments
                    </h1>

                    <p className="mt-1 text-sm text-[#82736b]">
                        Monitor payment history and transaction statuses.
                    </p>
                </div>

                <button
                    onClick={() => fetchPayments(false)}
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

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                <StatCard
                    title="Total Transactions"
                    value={summary.total_transactions}
                    icon={CreditCard}
                    color="bg-orange-50 text-[#d6531d]"
                    subtitle="All booking payment records"
                />

                <StatCard
                    title="Total Amount Received"
                    value={formatAmount(summary.total_paid)}
                    icon={IndianRupee}
                    color="bg-emerald-50 text-emerald-600"
                    subtitle="Only successfully paid bookings"
                />

                <StatCard
                    title="Successful Payments"
                    value={summary.successful_payments}
                    icon={CheckCircle2}
                    color="bg-green-50 text-green-600"
                />

                <StatCard
                    title="Pending Payments"
                    value={summary.pending_payments}
                    icon={Clock3}
                    color="bg-amber-50 text-amber-600"
                />

                <StatCard
                    title="Failed Payments"
                    value={summary.failed_payments}
                    icon={XCircle}
                    color="bg-red-50 text-red-600"
                />

                <StatCard
                    title="Refunded Payments"
                    value={summary.refunded_payments}
                    icon={RotateCcw}
                    color="bg-purple-50 text-purple-600"
                />
            </div>

            {/* Search and Filters */}
            <div className="rounded-2xl border border-[#eee3d8] bg-white p-4 shadow-sm">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

                    <div className="relative md:col-span-2">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9b8c82]"
                        />

                        <input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Search booking number, devotee, mobile..."
                            className="w-full rounded-xl border border-[#eadfd4] py-3 pl-10 pr-3 text-sm outline-none focus:border-[#d6531d]"
                        />
                    </div>

                    <select
                        value={paymentStatus}
                        onChange={(e) => {
                            setPaymentStatus(e.target.value);
                            setPage(1);
                        }}
                        className="rounded-xl border border-[#eadfd4] bg-white px-3 py-3 text-sm outline-none focus:border-[#d6531d]"
                    >
                        <option value="">All Payment Statuses</option>

                        {PAYMENT_STATUSES.map((status) => (
                            <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mt-3 flex justify-end">
                    <button
                        onClick={resetFilters}
                        className="rounded-xl border border-[#eadfd4] px-4 py-2.5 text-sm font-semibold text-[#6f5a4e] hover:bg-[#fff8ec]"
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
                        onClick={() => fetchPayments()}
                        className="ml-2 font-bold underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Payments Table */}
            <div className="overflow-hidden rounded-2xl border border-[#eee3d8] bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-[#eee3d8] px-5 py-4">
                    <div>
                        <h2 className="font-bold text-[#39251d]">
                            Payment History
                        </h2>

                        <p className="mt-1 text-xs text-[#82736b]">
                            {pagination.total} total records
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex min-h-64 items-center justify-center">
                        <Loader2
                            className="animate-spin text-[#d6531d]"
                            size={30}
                        />
                    </div>
                ) : payments.length === 0 ? (
                    <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
                        <Receipt size={42} className="text-[#c8b7a8]" />

                        <h3 className="mt-4 font-bold text-[#39251d]">
                            No payments found
                        </h3>

                        <p className="mt-1 text-sm text-[#82736b]">
                            Try changing your search or payment status filter.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1050px] text-left">
                                <thead className="bg-[#fffaf4] text-xs uppercase tracking-wide text-[#82736b]">
                                    <tr>
                                        <th className="px-5 py-4">
                                            Booking
                                        </th>

                                        <th className="px-5 py-4">
                                            Devotee
                                        </th>

                                        <th className="px-5 py-4">
                                            Pandit
                                        </th>

                                        <th className="px-5 py-4">
                                            Type
                                        </th>

                                        <th className="px-5 py-4">
                                            Amount
                                        </th>

                                        <th className="px-5 py-4">
                                            Payment Date
                                        </th>

                                        <th className="px-5 py-4">
                                            Payment Status
                                        </th>

                                        <th className="px-5 py-4">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-[#f0e8df]">
                                    {payments.map((payment) => (
                                        <tr
                                            key={payment.booking_id}
                                            className="hover:bg-[#fffdf9]"
                                        >
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-[#39251d]">
                                                    {payment.booking_number || `#${payment.booking_id}`}
                                                </p>

                                                <p className="mt-1 text-xs text-[#9b8c82]">
                                                    ID: {payment.booking_id}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="font-medium text-[#39251d]">
                                                    {payment.devotee_name || payment.registered_devotee_name || "—"}
                                                </p>

                                                <p className="mt-1 text-xs text-[#82736b]">
                                                    {payment.devotee_mobile || "—"}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-[#514139]">
                                                {payment.pandit_name || "—"}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-semibold capitalize text-[#d6531d]">
                                                    {payment.booking_type || "—"}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-sm font-bold text-[#39251d]">
                                                {formatAmount(payment.amount)}
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="text-sm font-medium text-[#39251d]">
                                                    {formatDate(payment.created_at)}
                                                </p>

                                                <p className="mt-1 text-xs text-[#82736b]">
                                                    {formatTime(payment.booking_time)}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <PaymentStatusBadge
                                                    status={payment.payment_status}
                                                />
                                            </td>

                                            <td className="px-5 py-4">
                                                <button
                                                    onClick={() =>
                                                        openPaymentDetails(payment.booking_id)
                                                    }
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

            {/* Payment Details Modal */}
            {(detailsLoading || selectedPayment) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                        <div className="sticky top-0 flex items-center justify-between border-b border-[#eee3d8] bg-white px-5 py-4">
                            <div>
                                <h2 className="text-lg font-bold text-[#39251d]">
                                    Payment Details
                                </h2>

                                {selectedPayment && (
                                    <p className="mt-1 text-xs text-[#82736b]">
                                        {selectedPayment.booking_number}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={() => setSelectedPayment(null)}
                                className="rounded-full p-2 hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {detailsLoading ? (
                            <div className="flex min-h-64 items-center justify-center">
                                <Loader2
                                    className="animate-spin text-[#d6531d]"
                                    size={30}
                                />
                            </div>
                        ) : selectedPayment && (
                            <div className="space-y-5 p-5">

                                {/* Payment Overview */}
                                <div className="rounded-2xl bg-[#fff8ec] p-5">
                                    <p className="text-sm text-[#82736b]">
                                        Booking Amount
                                    </p>

                                    <h3 className="mt-2 text-3xl font-bold text-[#39251d]">
                                        {formatAmount(selectedPayment.amount)}
                                    </h3>

                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                        <PaymentStatusBadge
                                            status={selectedPayment.payment_status}
                                        />

                                        <span className="text-xs text-[#82736b]">
                                            Booking #{selectedPayment.booking_id}
                                        </span>
                                    </div>
                                </div>

                                {/* Booking Information */}
                                <section>
                                    <h3 className="mb-3 font-bold text-[#39251d]">
                                        Booking Information
                                    </h3>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <InfoItem
                                            icon={ClipboardList}
                                            label="Booking Number"
                                            value={selectedPayment.booking_number}
                                        />

                                        <InfoItem
                                            icon={CreditCard}
                                            label="Booking Type"
                                            value={selectedPayment.booking_type}
                                        />

                                        <InfoItem
                                            icon={CalendarDays}
                                            label="Booking Date"
                                            value={formatDate(selectedPayment.booking_date)}
                                        />

                                        <InfoItem
                                            icon={Clock3}
                                            label="Booking Time"
                                            value={formatTime(selectedPayment.booking_time)}
                                        />

                                        <InfoItem
                                            icon={Receipt}
                                            label="Puja / Service"
                                            value={
                                                selectedPayment.booking_type === "puja"
                                                    ? selectedPayment.puja_name || `Puja #${selectedPayment.puja_id || "—"}`
                                                    : selectedPayment.service_name || `Service #${selectedPayment.service_id || "—"}`
                                            }
                                        />

                                        <InfoItem
                                            icon={ClipboardList}
                                            label="Booking Status"
                                            value={selectedPayment.booking_status}
                                        />
                                    </div>
                                </section>

                                {/* Devotee Information */}
                                <section>
                                    <h3 className="mb-3 font-bold text-[#39251d]">
                                        Devotee Information
                                    </h3>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <InfoItem
                                            icon={UserRound}
                                            label="Name"
                                            value={
                                                selectedPayment.devotee_name ||
                                                selectedPayment.registered_devotee_name
                                            }
                                        />

                                        <InfoItem
                                            icon={Phone}
                                            label="Mobile"
                                            value={selectedPayment.devotee_mobile}
                                        />

                                        <InfoItem
                                            icon={Mail}
                                            label="Email"
                                            value={selectedPayment.devotee_email}
                                        />

                                        <InfoItem
                                            icon={MapPin}
                                            label="City"
                                            value={selectedPayment.city}
                                        />
                                    </div>
                                </section>

                                {/* Pandit Information */}
                                <section>
                                    <h3 className="mb-3 font-bold text-[#39251d]">
                                        Pandit Information
                                    </h3>

                                    <InfoItem
                                        icon={UserRound}
                                        label="Pandit Name"
                                        value={selectedPayment.pandit_name}
                                    />
                                </section>

                                {/* Payment Information */}
                                <section>
                                    <h3 className="mb-3 font-bold text-[#39251d]">
                                        Payment Information
                                    </h3>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <InfoItem
                                            icon={IndianRupee}
                                            label="Amount"
                                            value={formatAmount(selectedPayment.amount)}
                                        />

                                        <InfoItem
                                            icon={CreditCard}
                                            label="Payment Status"
                                            value={selectedPayment.payment_status}
                                        />

                                        <InfoItem
                                            icon={CalendarDays}
                                            label="Record Created"
                                            value={formatDate(selectedPayment.created_at)}
                                        />
                                    </div>

                                    <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
                                        Transaction ID and payment method are not
                                        available in the current booking payment data.
                                    </p>
                                </section>

                                {/* Address */}
                                <section>
                                    <h3 className="mb-2 font-bold text-[#39251d]">
                                        Address
                                    </h3>

                                    <p className="rounded-xl bg-[#fffaf4] p-4 text-sm text-[#514139]">
                                        {selectedPayment.address || "No address provided"}
                                    </p>
                                </section>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
