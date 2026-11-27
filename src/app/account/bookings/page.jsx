
"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Flower2,
  IndianRupee,
  MapPin,
  RefreshCw,
  ReceiptText,
} from "lucide-react";

import { getMyBookings } from "@/services/bookingService";
import ReviewDialog from "@/components/reviews/ReviewDialog";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-blue-50 text-blue-700 border-blue-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200",
};

const formatDate = (value) => {
  if (!value) return "Date not available";

  // MySQL DATE: YYYY-MM-DD
  const [year, month, day] = String(value).slice(0, 10).split("-");

  if (!year || !month || !day) return value;

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "Time not available";

  const [hours, minutes] = String(value).split(":");

  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);


  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyBookings();

      const list = Array.isArray(response?.data)
        ? response.data
        : [];

      setBookings(list);
    } catch (err) {
      console.error("Fetch bookings error:", err);

      setError(
        err?.message || "Unable to load your bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const totalBookings = bookings.length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const upcomingBookings = bookings.filter((booking) =>
    ["pending", "accepted"].includes(booking.status)
  ).length;

  return (
    <>
      <div className="space-y-7">

        {/* Header */}
        <div>
          <p className="text-sm font-medium text-[#bd6439]">
            MY ACCOUNT / BOOKINGS
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-semibold text-[#39251d]">
                My Bookings
              </h1>

              <p className="mt-2 text-sm text-[#89786d]">
                Manage and track all your puja bookings.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchBookings}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-[#e8ddce] bg-white px-4 py-2.5 text-sm font-medium text-[#713c32] transition hover:bg-[#fff8f2] disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total Bookings",
              value: totalBookings,
            },
            {
              label: "Completed",
              value: completedBookings,
            },
            {
              label: "Upcoming",
              value: upcomingBookings,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#e8ddce] bg-white p-5"
            >
              <p className="text-sm text-[#8d7b70]">
                {item.label}
              </p>

              <p className="mt-2 font-display text-3xl font-semibold text-[#713c32]">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Booking History */}
        <div className="overflow-hidden rounded-2xl border border-[#e8ddce] bg-white">

          <div className="flex items-center justify-between border-b border-[#eee8dc] px-5 py-4">
            <div>
              <h2 className="font-semibold text-[#39251d]">
                Booking History
              </h2>

              <p className="mt-1 text-xs text-[#89786d]">
                Your recent puja bookings
              </p>
            </div>

            <ReceiptText
              size={21}
              className="text-[#bd6439]"
            />
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-4 p-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex animate-pulse gap-4"
                >
                  <div className="size-12 rounded-xl bg-gray-100" />

                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 rounded bg-gray-100" />
                    <div className="h-3 w-1/2 rounded bg-gray-100" />
                    <div className="h-3 w-1/4 rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="p-8 text-center">
              <p className="text-sm text-red-600">
                {error}
              </p>

              <button
                onClick={fetchBookings}
                className="mt-4 rounded-xl bg-[#713c32] px-5 py-2 text-sm font-medium text-white"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && bookings.length === 0 && (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#fbe9df] text-[#bd6439]">
                <Flower2 size={30} />
              </div>

              <h3 className="mt-4 font-semibold text-[#39251d]">
                No Bookings Yet
              </h3>

              <p className="mt-2 text-sm text-[#89786d]">
                Your puja bookings will appear here.
              </p>
            </div>
          )}

          {/* Booking List */}
          {!loading && !error && bookings.map((booking) => {
            const status = String(
              booking.status || "pending"
            ).toLowerCase();

            const statusStyle =
              STATUS_STYLES[status] ||
              "bg-gray-100 text-gray-600 border-gray-200";

            return (
              <div
                key={booking.id}
                className="flex flex-col gap-4 border-b border-[#eee8dc] p-5 last:border-0 sm:flex-row sm:items-center"
              >
                {/* Icon */}
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#fbe9df] text-[#bd6439]">
                  <Flower2 size={23} />
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-[#39251d]">
                      {booking.service_name || "Puja Service"}
                    </h3>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusStyle}`}
                    >
                      {formatStatus(status)}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-[#89786d]">
                    Pandit: {booking.pandit_name || "Pandit"}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#89786d]">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={14} />
                      {formatDate(booking.booking_date)}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock3 size={14} />
                      {formatTime(booking.booking_time)}
                    </span>

                    {booking.city && (
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {booking.city}
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-[#a18f83]">
                    Booking ID: {booking.booking_number}
                  </p>
                </div>

                {/* Price and Payment */}


                {/* Price, Payment and Review */}
                <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-col sm:items-end">
                  <div className="text-right">
                    <p className="flex items-center justify-end gap-1 font-semibold text-[#713c32]">
                      <IndianRupee size={15} />
                      {Number(
                        booking.service_price || 0
                      ).toLocaleString("en-IN")}
                    </p>

                    <p className="mt-1 text-xs text-[#89786d]">
                      Payment:{" "}
                      <span className="capitalize">
                        {booking.payment_status || "pending"}
                      </span>
                    </p>
                  </div>

                  {status === "completed" && !Boolean(booking.has_review) && (
                    <button
                      type="button"
                      onClick={() => setSelectedBooking(booking)}
                      className="rounded-xl bg-[#713c32] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#593027]"
                    >
                      Write a Review
                    </button>
                  )}

                  {status === "completed" && Boolean(booking.has_review) && (
                    <span className="rounded-xl bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700">
                      <span className="inline-flex items-center gap-1">
                        <icon name="check-circle" size="xs" />
                        Reviewed
                      </span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedBooking && (
        <ReviewDialog
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onSuccess={() => {
            setSelectedBooking(null);
            fetchBookings();
          }}
        />
      )}



    </>
  );
}
