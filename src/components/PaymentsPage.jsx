
"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/api";

export function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiCall({
          endpoint: "/bookings/my-payments",
          method: "GET",
        });

        const result = response?.data || {};

        if (!active) return;

        setPayments(
          Array.isArray(result.payments) ? result.payments : []
        );
        setTotalPaid(Number(result.total_paid || 0));
        setTotalTransactions(
          Number(result.total_transactions || 0)
        );
      } catch (err) {
        console.error("Payment History Error:", err);

        if (active) {
          setError("Unable to load payment history.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchPayments();

    return () => {
      active = false;
    };
  }, []);

  const formatAmount = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const statusStyles = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    failed: "bg-red-100 text-red-700",
    refunded: "bg-blue-100 text-blue-700",
  };

  const formatStatus = (status) => {
    const labels = {
      paid: "Paid",
      pending: "Pending",
      failed: "Failed",
      refunded: "Refunded",
    };

    return labels[String(status || "").toLowerCase()] || status || "Unknown";
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsed = new Date(
      String(date).replace(" ", "T")
    );

    if (Number.isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-semibold text-[#38251f]">
            Payment History
          </h1>
          <p className="mt-1 text-sm text-[#82736b]">
            Track all your puja payments and refunds.
          </p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#eee4d9] bg-white p-4">
            <p className="text-sm text-[#82736b]">Total Paid</p>
            <h2 className="mt-2 font-display text-2xl text-[#39754d]">
              {formatAmount(totalPaid)}
            </h2>
          </div>

          <div className="rounded-2xl border border-[#eee4d9] bg-white p-4">
            <p className="text-sm text-[#82736b]">Transactions</p>
            <h2 className="mt-2 font-display text-2xl text-[#713c32]">
              {totalTransactions}
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-sm text-[#82736b]">
            Loading payment history...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-white p-8 text-center text-sm text-red-600">
            {error}
          </div>
        ) : payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment) => {
              const status = String(
                payment.payment_status || ""
              ).toLowerCase();

              return (
                <div
                  key={payment.booking_id}
                  className="rounded-2xl border border-[#eee4d9] bg-white p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium leading-6 text-[#39251d]">
                        {payment.service_name || "Puja Booking"}
                      </h3>

                      <p className="mt-1 text-sm text-[#82736b]">
                        {payment.pandit_name || "Pandit"} ·{" "}
                        {formatDate(payment.booking_date)}
                      </p>

                      <p className="mt-1 text-xs text-[#82736b]">
                        Booking: {payment.booking_number || payment.booking_id}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className="font-display text-xl text-[#39251d]">
                        {formatAmount(payment.amount)}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyles[status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {formatStatus(status)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#e6ddca] bg-white px-5 py-12 text-center">
            <h3 className="font-semibold text-[#38251f]">
              No Payment History
            </h3>
            <p className="mt-2 text-sm text-[#82736b]">
              Your payment records will appear here.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
