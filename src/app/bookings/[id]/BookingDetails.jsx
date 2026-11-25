


"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    CalendarDays,
    Clock3,
    MapPin,
    Phone,
    MessageCircle,
    UserRound,
    CheckCircle2,
    Circle,
    ClipboardCheck,
    CreditCard,
    XCircle,
    CalendarClock,
    LoaderCircle,
    Check,
} from "lucide-react";

import {
    getBooking,
    cancelBooking,
    rescheduleBooking,
} from "@/lib/api";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const STATUS_CONFIG = {
    HELD: {
        label: "Held",
        className: "border-amber-200 bg-amber-50 text-amber-700",
    },
    CONFIRMED: {
        label: "Confirmed",
        className: "border-green-200 bg-green-50 text-green-700",
    },
    COMPLETED: {
        label: "Completed",
        className: "border-border bg-muted text-muted-foreground",
    },
    CANCELLED: {
        label: "Cancelled",
        className: "border-red-200 bg-red-50 text-red-700",
    },
};

const STATUS_LABELS = {
    HELD: "Booking placed",
    CONFIRMED: "Booking confirmed",
    COMPLETED: "Puja completed",
    CANCELLED: "Booking cancelled",
};

const CANCELLATION_REASONS = [
    "Change of plans",
    "Date or time not suitable",
    "Booked by mistake",
    "Personal reasons",
    "Other",
];

const TIME_SLOTS = [
    "06:00 AM - 08:00 AM",
    "08:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 02:00 PM",
    "04:00 PM - 06:00 PM",
    "06:00 PM - 08:00 PM",
];

const formatDate = (date) => {
    if (!date) return "—";

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
};

const formatDateTime = (timestamp) => {
    if (!timestamp) return "";

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(timestamp));
};

const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);

const getInitials = (name = "") =>
    name
        .trim()
        .split(/\s+/)
        .slice(-2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase();

function DetailSkeleton() {
    return (
        <div className="mx-auto max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
            <div className="h-5 w-32 rounded bg-muted" />
            <div className="mt-6 h-10 w-72 rounded bg-muted" />

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <div className="space-y-5 lg:col-span-2">
                    <div className="h-48 rounded-2xl bg-muted" />
                    <div className="h-64 rounded-2xl bg-muted" />
                </div>
                <div className="h-72 rounded-2xl bg-muted" />
            </div>
        </div>
    );
}

function SectionCard({ title, icon: Icon, children, action }) {
    return (
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon size={19} />
                    </div>

                    <h2 className="font-bold text-foreground">{title}</h2>
                </div>

                {action}
            </div>

            {children}
        </section>
    );
}

export default function BookingDetailsPage({ id }) {

    const [booking, setBooking] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [pageError, setPageError] = useState("");

    const [checkedItems, setCheckedItems] = useState([]);

    const [cancelOpen, setCancelOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [isCancelling, setIsCancelling] = useState(false);

    const [rescheduleOpen, setRescheduleOpen] = useState(false);
    const [rescheduleDate, setRescheduleDate] = useState("");
    const [rescheduleSlot, setRescheduleSlot] = useState("");
    const [isRescheduling, setIsRescheduling] = useState(false);

    const [todayKey, setTodayKey] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [actionError, setActionError] = useState("");

    useEffect(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        setTodayKey(`${year}-${month}-${day}`);
    }, []);

    useEffect(() => {
        let active = true;

        const loadBooking = async () => {
            setIsLoading(true);
            setPageError("");

            try {
                const data = await getBooking(id);

                if (!active) return;

                if (!data) {
                    setPageError("Booking not found.");
                    return;
                }

                setBooking(data);
                setRescheduleDate(data.date);
                setRescheduleSlot(data.time);
            } catch (error) {
                if (active) {
                    setPageError("Unable to load booking details.");
                }
            } finally {
                if (active) setIsLoading(false);
            }
        };

        loadBooking();

        return () => {
            active = false;
        };
    }, [id]);

    const statusConfig = booking
        ? STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.HELD
        : STATUS_CONFIG.HELD;

    const canModifyBooking =
        booking && ["HELD", "CONFIRMED"].includes(booking.status);

    const completedItems = checkedItems.length;
    const totalItems = booking?.samagri?.length ?? 0;

    const progress = useMemo(
        () =>
            totalItems > 0
                ? Math.round((completedItems / totalItems) * 100)
                : 0,
        [completedItems, totalItems]
    );

    const toggleSamagri = (item) => {
        setCheckedItems((previous) =>
            previous.includes(item)
                ? previous.filter((value) => value !== item)
                : [...previous, item]
        );
    };

    const handleCancel = async () => {
        if (!cancelReason || isCancelling) return;

        setIsCancelling(true);
        setActionError("");
        setSuccessMessage("");

        try {
            const updatedBooking = await cancelBooking(id, cancelReason);

            setBooking(updatedBooking);
            setCancelOpen(false);
            setCancelReason("");
            setSuccessMessage("Your booking has been cancelled successfully.");
        } catch (error) {
            setActionError(error.message || "Unable to cancel booking.");
        } finally {
            setIsCancelling(false);
        }
    };

    const handleReschedule = async () => {
        if (!rescheduleDate || !rescheduleSlot || isRescheduling) return;

        setIsRescheduling(true);
        setActionError("");
        setSuccessMessage("");

        try {
            const updatedBooking = await rescheduleBooking(
                id,
                rescheduleDate,
                rescheduleSlot
            );

            setBooking(updatedBooking);
            setRescheduleOpen(false);
            setSuccessMessage("Your booking has been rescheduled successfully.");
        } catch (error) {
            setActionError(error.message || "Unable to reschedule booking.");
        } finally {
            setIsRescheduling(false);
        }
    };

    if (isLoading) return <DetailSkeleton />;

    if (pageError || !booking) {
        return (
            <div className="min-h-[60vh] bg-background px-4 py-20 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <XCircle size={26} />
                </div>

                <h2 className="mt-4 text-xl font-bold text-foreground">
                    Booking not found
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    {pageError || "This booking may no longer be available."}
                </p>

                <Link
                    href="/bookings"
                    className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
                >
                    <ArrowLeft size={16} />
                    Back to Bookings
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Back */}
                <Link
                    href="/bookings"
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
                >
                    <ArrowLeft size={17} />
                    Back to My Bookings
                </Link>

                {/* Header */}
                <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Booking ID: {booking.id}
                        </p>

                        <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
                            {booking.pujaName}
                        </h1>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Booked on {formatDateTime(booking.createdAt)}
                        </p>
                    </div>

                    <Badge
                        variant="outline"
                        className={`w-fit px-3 py-1.5 text-sm ${statusConfig.className}`}
                    >
                        {statusConfig.label}
                    </Badge>
                </div>

                {/* Feedback */}
                {successMessage && (
                    <div
                        role="status"
                        className="mt-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
                    >
                        <CheckCircle2 size={19} className="shrink-0" />
                        {successMessage}
                    </div>
                )}

                {actionError && (
                    <div
                        role="alert"
                        className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        {actionError}
                    </div>
                )}

                <div className="mt-8 grid items-start gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Pandit */}
                        <SectionCard title="Your Pandit" icon={UserRound}>
                            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                                        {getInitials(booking.panditName)}
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-foreground">
                                            {booking.panditName}
                                        </h3>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Verified Pandit
                                        </p>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {booking.panditPhone}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <a
                                        href={`tel:${booking.panditPhone}`}
                                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold text-foreground transition hover:bg-muted"
                                    >
                                        <Phone size={16} />
                                        Call
                                    </a>

                                    <a
                                        href={`https://wa.me/91${booking.panditPhone.replace(/\D/g, "").slice(-10)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-semibold text-white transition hover:bg-green-700"
                                    >
                                        <MessageCircle size={16} />
                                        WhatsApp
                                    </a>
                                </div>
                            </div>
                        </SectionCard>

                        {/* Schedule */}
                        <SectionCard
                            title="Puja Schedule"
                            icon={CalendarDays}
                            action={
                                canModifyBooking ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setRescheduleDate(booking.date);
                                            setRescheduleSlot(booking.time);
                                            setRescheduleOpen(true);
                                            setActionError("");
                                        }}
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                                    >
                                        <CalendarClock size={16} />
                                        Reschedule
                                    </button>
                                ) : null
                            }
                        >
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="flex gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <CalendarDays size={19} />
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Puja Date
                                        </p>
                                        <p className="mt-1 font-semibold text-foreground">
                                            {formatDate(booking.date)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Clock3 size={19} />
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Puja Time
                                        </p>
                                        <p className="mt-1 font-semibold text-foreground">
                                            {booking.time}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 sm:col-span-2">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <MapPin size={19} />
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Puja Address
                                        </p>
                                        <p className="mt-1 font-semibold text-foreground">
                                            {booking.address}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </SectionCard>

                        {/* Samagri */}
                        <SectionCard
                            title="Puja Samagri Checklist"
                            icon={ClipboardCheck}
                        >
                            <div className="mb-5">
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Items prepared
                                    </span>
                                    <span className="font-semibold text-foreground">
                                        {completedItems}/{totalItems}
                                    </span>
                                </div>

                                <div className="h-2 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>

                            {booking.samagri?.length > 0 ? (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {booking.samagri.map((item, index) => (
                                        <label
                                            key={`${item}-${index}`}
                                            className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition hover:bg-muted/50"
                                        >
                                            <Checkbox
                                                checked={checkedItems.includes(item)}
                                                onCheckedChange={() => toggleSamagri(item)}
                                            />

                                            <span
                                                className={`text-sm ${checkedItems.includes(item)
                                                        ? "text-muted-foreground line-through"
                                                        : "text-foreground"
                                                    }`}
                                            >
                                                {item}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No samagri checklist available.
                                </p>
                            )}
                        </SectionCard>

                        {/* Timeline */}
                        <SectionCard title="Booking Timeline" icon={Clock3}>
                            <div className="space-y-0">
                                {booking.statusTimeline.map((item, index) => {
                                    const isLast =
                                        index === booking.statusTimeline.length - 1;

                                    const isCancelled = item.status === "CANCELLED";

                                    return (
                                        <div key={`${item.status}-${index}`} className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div
                                                    className={`flex size-8 shrink-0 items-center justify-center rounded-full ${isCancelled
                                                            ? "bg-red-100 text-red-600"
                                                            : "bg-green-100 text-green-700"
                                                        }`}
                                                >
                                                    {isCancelled ? (
                                                        <XCircle size={17} />
                                                    ) : (
                                                        <Check size={17} />
                                                    )}
                                                </div>

                                                {!isLast && (
                                                    <div className="my-1 min-h-8 w-px flex-1 bg-border" />
                                                )}
                                            </div>

                                            <div className="pb-6">
                                                <p className="font-semibold text-foreground">
                                                    {STATUS_LABELS[item.status] ?? item.status}
                                                </p>

                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {formatDateTime(item.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </SectionCard>
                    </div>

                    {/* Payment Summary */}
                    <aside className="space-y-6 lg:sticky lg:top-24">
                        <SectionCard title="Payment Summary" icon={CreditCard}>
                            <div className="space-y-4">
                                <div className="flex justify-between gap-3 text-sm">
                                    <span className="text-muted-foreground">
                                        Puja Charges
                                    </span>
                                    <span className="font-medium text-foreground">
                                        {formatAmount(booking.amount)}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3 text-sm">
                                    <span className="text-muted-foreground">
                                        Additional Charges
                                    </span>
                                    <span className="font-medium text-foreground">
                                        {formatAmount(0)}
                                    </span>
                                </div>

                                <div className="border-t border-border pt-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="font-semibold text-foreground">
                                            Total Amount
                                        </span>

                                        <span className="text-xl font-bold text-primary">
                                            {formatAmount(booking.amount)}
                                        </span>
                                    </div>
                                </div>

                                <div className="rounded-lg bg-muted p-3">
                                    <p className="text-xs text-muted-foreground">
                                        Payment Status
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-foreground">
                                        Demo payment · Not processed
                                    </p>
                                </div>
                            </div>
                        </SectionCard>

                        {canModifyBooking && (
                            <div className="rounded-2xl border border-border bg-card p-5">
                                <h3 className="font-bold text-foreground">
                                    Need to change plans?
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    You can reschedule or cancel this booking.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setCancelOpen(true);
                                        setActionError("");
                                    }}
                                    className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-red-200 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                >
                                    <XCircle size={17} />
                                    Cancel Booking
                                </button>
                            </div>
                        )}
                    </aside>
                </div>
            </div>

            {/* Cancellation Dialog */}
            <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Cancel Booking?</DialogTitle>

                        <DialogDescription>
                            Are you sure you want to cancel your {booking.pujaName} booking?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-3">
                        <label
                            htmlFor="cancel-reason"
                            className="mb-2 block text-sm font-medium text-foreground"
                        >
                            Reason for cancellation
                        </label>

                        <select
                            id="cancel-reason"
                            value={cancelReason}
                            onChange={(event) => setCancelReason(event.target.value)}
                            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                        >
                            <option value="">Select a reason</option>

                            {CANCELLATION_REASONS.map((reason) => (
                                <option key={reason} value={reason}>
                                    {reason}
                                </option>
                            ))}
                        </select>
                    </div>

                    <DialogFooter>
                        <button
                            type="button"
                            onClick={() => setCancelOpen(false)}
                            disabled={isCancelling}
                            className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-foreground"
                        >
                            Keep Booking
                        </button>

                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={!cancelReason || isCancelling}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-destructive px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isCancelling && (
                                <LoaderCircle size={16} className="animate-spin" />
                            )}
                            Confirm Cancellation
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reschedule Dialog */}
            <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Reschedule Your Puja</DialogTitle>

                        <DialogDescription>
                            Select a new date and preferred time slot.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 py-3">
                        <div>
                            <label
                                htmlFor="reschedule-date"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                New Date
                            </label>

                            <input
                                id="reschedule-date"
                                type="date"
                                min={todayKey || undefined}
                                value={rescheduleDate}
                                onChange={(event) =>
                                    setRescheduleDate(event.target.value)
                                }
                                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                            />
                        </div>

                        <div>
                            <p className="mb-3 text-sm font-medium text-foreground">
                                Available Time Slots
                            </p>

                            <div className="grid grid-cols-2 gap-2">
                                {TIME_SLOTS.map((slot) => (
                                    <button
                                        key={slot}
                                        type="button"
                                        onClick={() => setRescheduleSlot(slot)}
                                        className={`min-h-11 rounded-lg border px-2 py-2 text-xs font-medium transition sm:text-sm ${rescheduleSlot === slot
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border text-foreground hover:border-primary"
                                            }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Demo slots only. Actual availability will require a live
                            booking system.
                        </p>
                    </div>

                    <DialogFooter>
                        <button
                            type="button"
                            onClick={() => setRescheduleOpen(false)}
                            disabled={isRescheduling}
                            className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-foreground"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleReschedule}
                            disabled={
                                !rescheduleDate ||
                                !rescheduleSlot ||
                                !todayKey ||
                                rescheduleDate < todayKey ||
                                isRescheduling
                            }
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isRescheduling && (
                                <LoaderCircle size={16} className="animate-spin" />
                            )}
                            Save Changes
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

