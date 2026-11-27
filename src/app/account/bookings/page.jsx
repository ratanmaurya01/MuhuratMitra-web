"use client";


import {
  CalendarDays,
  Clock3,
  Flower2,
  IndianRupee,
} from "lucide-react";

const BOOKINGS = [
  {
    id: 1,
    name: "Naamkaran Sanskar",
    pandit: "Vidwan Subramanian Iyer",
    date: "18 Nov 2026",
    time: "09:00 AM",
    price: "₹3,400",
    status: "Completed",
  },
  {
    id: 2,
    name: "Ganesh Lakshmi Puja",
    pandit: "Pt. Harshvardhan Trivedi",
    date: "09 Nov 2026",
    time: "04:00 PM",
    price: "₹2,200",
    status: "Cancelled",
  },
  {
    id: 3,
    name: "Maha Rudrabhishek Puja",
    pandit: "Acharya Raghavendra Sharma",
    date: "02 Nov 2026",
    time: "06:30 AM",
    price: "₹2,500",
    status: "Completed",
  },
];

export default function BookingsPage() {
  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-medium text-[#bd6439]">
          MY ACCOUNT / BOOKINGS
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-[#39251d]">
          My Bookings
        </h1>
        <p className="mt-2 text-sm text-[#89786d]">
          Manage and track all your puja bookings.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Total Bookings", "12"],
          ["Completed", "8"],
          ["Upcoming", "2"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-[#e8ddce] bg-white p-5"
          >
            <p className="text-sm text-[#8d7b70]">{label}</p>
            <p className="mt-2 font-display text-3xl font-semibold text-[#713c32]">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e8ddce] bg-white">
        <div className="border-b border-[#eee8dc] px-5 py-4">
          <h2 className="font-semibold text-[#39251d]">
            Booking History
          </h2>
        </div>

        {BOOKINGS.map((booking) => {
          const cancelled = booking.status === "Cancelled";

          return (
            <div
              key={booking.id}
              className="flex flex-col gap-4 border-b border-[#eee8dc] p-5 last:border-0 sm:flex-row sm:items-center"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#fbe9df] text-[#bd6439]">
                <Flower2 size={23} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-[#39251d]">
                  {booking.name}
                </h3>
                <p className="mt-1 text-sm text-[#89786d]">
                  {booking.pandit}
                </p>

                <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#89786d]">
                  <span className="flex items-center gap-1">
                    <CalendarDays size={14} />
                    {booking.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock3 size={14} />
                    {booking.time}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    cancelled
                      ? "bg-red-50 text-red-600"
                      : "bg-green-50 text-green-700"
                  }`}
                >
                  {booking.status}
                </span>

                <span className="font-semibold text-[#713c32]">
                  {booking.price}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
