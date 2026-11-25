

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock3,
  MapPin,
  ArrowRight,
  CalendarCheck,
  ClipboardList,
} from "lucide-react";
import { getBookings } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function BookingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-border bg-card p-5"
        >
          <div className="flex justify-between gap-4">
            <div className="space-y-3">
              <div className="h-5 w-40 rounded bg-muted" />
              <div className="h-4 w-32 rounded bg-muted" />
            </div>
            <div className="h-6 w-20 rounded-full bg-muted" />
          </div>

          <div className="mt-6 h-4 w-48 rounded bg-muted" />
          <div className="mt-3 h-4 w-full rounded bg-muted" />

          <div className="mt-6 flex justify-between">
            <div className="h-5 w-20 rounded bg-muted" />
            <div className="h-8 w-24 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-14 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <ClipboardList size={25} />
      </div>

      <h3 className="mt-4 font-semibold text-foreground">{title}</h3>

      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function BookingCard({ booking, onClick }) {
  const status = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.HELD;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border border-border bg-card p-5 text-left transition hover:border-primary/50 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-bold text-foreground">
            {booking.pujaName}
          </h3>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {booking.panditName
                .split(" ")
                .slice(-2)
                .map((part) => part.charAt(0))
                .join("")
                .toUpperCase()}
            </div>

            <span className="truncate text-sm text-muted-foreground">
              {booking.panditName}
            </span>
          </div>
        </div>

        <Badge
          variant="outline"
          className={`shrink-0 ${status.className}`}
        >
          {status.label}
        </Badge>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays size={16} className="shrink-0 text-primary" />
          {formatDate(booking.date)}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock3 size={16} className="shrink-0 text-primary" />
          {booking.time}
        </div>
      </div>

      <div className="mt-3 flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
        <MapPin size={16} className="shrink-0 text-primary" />
        <span className="truncate">{booking.address}</span>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <div>
          <p className="text-xs text-muted-foreground">Total Amount</p>
          <p className="mt-1 font-bold text-foreground">
            {formatAmount(booking.amount)}
          </p>
        </div>

        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          View Details
          <ArrowRight
            size={17}
            className="transition-transform group-hover:translate-x-1"
          />
        </span>
      </div>
    </button>
  );
}

export default function BookingsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadBookings = async () => {
      try {
        const data = await getBookings();

        if (active) {
          setBookings(data);
          setError("");
        }
      } catch (error) {
        if (active) {
          setError("Unable to load bookings. Please try again.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadBookings();

    return () => {
      active = false;
    };
  }, []);

  const upcomingBookings = useMemo(
    () =>
      bookings.filter((booking) =>
        ["HELD", "CONFIRMED"].includes(booking.status)
      ),
    [bookings]
  );

  const completedBookings = useMemo(
    () => bookings.filter((booking) => booking.status === "COMPLETED"),
    [bookings]
  );

  const cancelledBookings = useMemo(
    () => bookings.filter((booking) => booking.status === "CANCELLED"),
    [bookings]
  );

  const renderBookingList = (items, emptyTitle, emptyDescription) => {
    if (isLoading) return <BookingSkeleton />;

    if (error) {
      return (
        <div className="rounded-xl border border-border p-6 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-3 text-sm font-semibold text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
        />
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onClick={() => router.push(`/bookings/${booking.id}`)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
              <CalendarCheck size={17} />
              Booking Management
            </div>

            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              My Bookings
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Manage your puja bookings and stay updated.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card px-4 py-3">
            <p className="text-xs text-muted-foreground">Total Bookings</p>
            <p className="text-2xl font-bold text-foreground">
              {isLoading ? "—" : bookings.length}
            </p>
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="mt-8">
          <TabsList className="mb-6 grid h-auto w-full max-w-lg grid-cols-3">
            <TabsTrigger value="upcoming" className="py-2.5">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>

            <TabsTrigger value="completed" className="py-2.5">
              Completed ({completedBookings.length})
            </TabsTrigger>

            <TabsTrigger value="cancelled" className="py-2.5">
              Cancelled ({cancelledBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {renderBookingList(
              upcomingBookings,
              "No upcoming bookings",
              "Your upcoming puja bookings will appear here."
            )}
          </TabsContent>

          <TabsContent value="completed">
            {renderBookingList(
              completedBookings,
              "No completed bookings",
              "Your completed puja bookings will appear here."
            )}
          </TabsContent>

          <TabsContent value="cancelled">
            {renderBookingList(
              cancelledBookings,
              "No cancelled bookings",
              "Bookings that you cancel will appear here."
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

