
"use client";

import { useEffect, useMemo, useState } from "react";
import {
    useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
    BadgeCheck,
    CalendarDays,
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    IndianRupee,
    MapPin,
    Star,
    UserRound,
    Users,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    createBooking,
    getPandits,
    getPujas,
} from "@/lib/api";
import { CITIES } from "@/lib/constants/cities";

// -------------------- Constants --------------------

const LANGUAGES = ["Hindi", "English", "Sanskrit", "Marwari"];

const BOOKING_SLOTS = [
    "07:00 AM – 09:00 AM",
    "09:00 AM – 11:00 AM",
    "11:00 AM – 01:00 PM",
    "02:00 PM – 04:00 PM",
    "04:00 PM – 06:00 PM",
    "06:00 PM – 08:00 PM",
];

const BOOKING_STEPS = [
    "पूजा चुनें",
    "तारीख और समय",
    "पता",
    "Summary",
];

const addressSchema = z.object({
    addressLine: z
        .string()
        .trim()
        .min(10, "कम से कम 10 characters का पूरा पता लिखें।")
        .max(200, "पता 200 characters से कम होना चाहिए।"),
    city: z
        .string()
        .trim()
        .min(2, "शहर का नाम लिखें।")
        .max(60, "शहर का नाम बहुत लंबा है।"),
    state: z
        .string()
        .trim()
        .min(2, "राज्य का नाम लिखें।")
        .max(60, "राज्य का नाम बहुत लंबा है।"),
    pincode: z
        .string()
        .regex(/^[1-9][0-9]{5}$/, "सही 6 digit PIN code लिखें।"),
    landmark: z
        .string()
        .max(100, "Landmark 100 characters से कम होना चाहिए।")
        .optional(),
});

const DEFAULT_ADDRESS = {
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
};

function getInitials(name = "") {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("");
}



function getLocalDateString() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}





function formatDate(dateString) {
    if (!dateString) return "";

    const [year, month, day] = dateString.split("-").map(Number);

    return new Intl.DateTimeFormat("hi-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(year, month - 1, day));
}

// -------------------- Small Components --------------------

function PanditAvatar({ name }) {
    return (
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-saffron-light text-lg font-bold text-primary">
            {getInitials(name) || <UserRound size={24} />}
        </div>
    );
}

function PanditCard({ pandit, onBook }) {
    return (
        <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg sm:p-6">
            <div className="flex items-start gap-4">
                <PanditAvatar name={pandit.name} />

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-foreground">
                            {pandit.name}
                        </h2>

                        {pandit.verified && (
                            <span
                                className="inline-flex items-center gap-1 rounded-full bg-saffron-light px-2 py-1 text-xs font-medium text-primary"
                                title="Verified pandit"
                            >
                                <BadgeCheck size={14} />
                                Verified
                            </span>
                        )}
                    </div>

                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin size={14} />
                        {pandit.city}
                    </p>

                    <div className="mt-2 flex items-center gap-1 text-sm">
                        <Star
                            size={15}
                            className="fill-gold text-gold"
                            aria-hidden="true"
                        />
                        <span className="font-semibold text-foreground">
                            {Number(pandit.rating).toFixed(1)}
                        </span>
                        <span className="text-muted-foreground">Rating</span>
                    </div>
                </div>
            </div>

            <div className="mt-5 space-y-3 border-t border-border pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users size={16} />
                    {pandit.experienceYears} years experience
                </div>

                <div className="flex flex-wrap gap-2">
                    {pandit.languages?.map((language) => (
                        <span
                            key={language}
                            className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                        >
                            {language}
                        </span>
                    ))}
                </div>
            </div>

            <button
                type="button"
                onClick={() => onBook(pandit)}
                className="mt-6 w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-saffron-dark"
            >
                Book Pandit
            </button>
        </article>
    );
}

function StepProgress({ step }) {
    return (
        <div className="mb-7">
            <div className="mb-3 flex items-center justify-between gap-2">
                {BOOKING_STEPS.map((label, index) => {
                    const stepNumber = index + 1;
                    const isComplete = stepNumber < step;
                    const isActive = stepNumber === step;

                    return (
                        <div
                            key={label}
                            className="flex min-w-0 flex-1 flex-col items-center gap-2"
                        >
                            <div
                                className={`flex size-8 items-center justify-center rounded-full text-xs font-semibold ${isComplete
                                    ? "bg-primary text-primary-foreground"
                                    : isActive
                                        ? "border-2 border-primary bg-saffron-light text-primary"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                            >
                                {isComplete ? <Check size={15} /> : stepNumber}
                            </div>

                            <span
                                className={`truncate text-center text-[10px] font-medium sm:text-xs ${isActive ? "text-primary" : "text-muted-foreground"
                                    }`}
                            >
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${(step / 4) * 100}%` }}
                />
            </div>
        </div>
    );
}

function FieldError({ children }) {
    if (!children) return null;

    return <p className="mt-1.5 text-xs text-destructive">{children}</p>;
}

// -------------------- Main Page --------------------

export default function PanditsPage() {
    // Listing filters and data
    const [pandits, setPandits] = useState([]);
    const [pujas, setPujas] = useState([]);
    const [city, setCity] = useState("all");
    const [language, setLanguage] = useState("");
    const [availableDate, setAvailableDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    // Booking flow state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPandit, setSelectedPandit] = useState(null);
    const [selectedPujaId, setSelectedPujaId] = useState("");
    const [bookingDate, setBookingDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [step, setStep] = useState(1);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState("");
    const [bookingResult, setBookingResult] = useState(null);

    const form = useForm({
        resolver: zodResolver(addressSchema),
        defaultValues: DEFAULT_ADDRESS,
        mode: "onTouched",
    });

    const {
        register,
        handleSubmit,
        trigger,
        getValues,
        reset,
        formState: { errors },
    } = form;

    const selectedPuja = useMemo(
        () => pujas.find((puja) => puja.id === selectedPujaId) || null,
        [pujas, selectedPujaId]
    );

    const [todayKey, setTodayKey] = useState("");
    const [panditRetryCount, setPanditRetryCount] = useState(0);

    // Load pujas and read optional puja query parameter.
    useEffect(() => {
        let isActive = true;
        async function loadPujas() {
            try {
                const result = await getPujas();

                if (!isActive) return;

                setPujas(result);

                // Read query parameter without useSearchParams().
                const params = new URLSearchParams(window.location.search);
                const pujaId = params.get("puja");

                if (pujaId && result.some((puja) => puja.id === pujaId)) {
                    setSelectedPujaId(pujaId);
                }
            } catch (error) {
                console.error("Unable to load pujas:", error);
            }
        }

        loadPujas();

        return () => {
            isActive = false;
        };
    }, []);

    // Load pandits whenever listing filters change.
    useEffect(() => {
        let isActive = true;

        async function loadPandits() {
            setLoading(true);
            setLoadError("");

            try {
                const filters = {
                    ...(city !== "all" && { city }),
                    ...(language && { language }),
                    ...(availableDate && { availableDate }),
                };

                const result = await getPandits(filters);

                if (isActive) {
                    setPandits(result);
                }
            } catch (error) {
                console.error("Unable to load pandits:", error);

                if (isActive) {
                    setLoadError("Pandits load नहीं हो पाए। कृपया दोबारा कोशिश करें।");
                    setPandits([]);
                }
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        }

        loadPandits();

        return () => {
            isActive = false;
        };
    }, [city, language, availableDate]);

    // Start a new booking.
    function openBooking(pandit) {
        setSelectedPandit(pandit);
        setStep(1);
        setSelectedSlot("");
        setBookingError("");
        setBookingResult(null);
        setBookingDate(availableDate || getLocalDateString());

        reset(DEFAULT_ADDRESS);
        setDialogOpen(true);
    }

    function closeBooking(open) {
        setDialogOpen(open);

        if (!open && !bookingLoading) {
            setSelectedPandit(null);
            setBookingError("");
        }
    }

    // Validate each step before proceeding.
    async function handleNext() {
        setBookingError("");

        if (step === 1) {
            if (!selectedPujaId) {
                setBookingError("कृपया एक पूजा चुनें।");
                return;
            }
        }

        if (step === 2) {
            if (!bookingDate) {
                setBookingError("कृपया पूजा की तारीख चुनें।");
                return;
            }

            if (bookingDate < getLocalDateString()) {
                setBookingError("पुरानी तारीख नहीं चुन सकते।");
                return;
            }

            if (!selectedSlot) {
                setBookingError("कृपया उपलब्ध समय चुनें।");
                return;
            }
        }

        if (step === 3) {
            const isValid = await trigger([
                "addressLine",
                "city",
                "state",
                "pincode",
                "landmark",
            ]);

            if (!isValid) return;
        }

        setStep((current) => Math.min(current + 1, 4));
    }

    function handleBack() {
        setBookingError("");
        setStep((current) => Math.max(current - 1, 1));
    }

    // Mock payment and booking creation.
    async function handlePayment() {
        if (!selectedPandit || !selectedPuja) return;

        setBookingLoading(true);
        setBookingError("");

        try {
            const booking = await createBooking({
                panditId: selectedPandit.id,
                panditName: selectedPandit.name,
                pujaId: selectedPuja.id,
                pujaName: selectedPuja.name,
                date: bookingDate,
                slot: selectedSlot,
                address: getValues(),
                amount: selectedPuja.price,
                paymentMode: "MOCK",
            });

            setBookingResult(booking);
        } catch (error) {
            console.error("Booking failed:", error);
            setBookingError("Booking नहीं हो पाई। कृपया दोबारा कोशिश करें।");
        } finally {
            setBookingLoading(false);
        }
    }

    function resetBooking() {
        setDialogOpen(false);
        setSelectedPandit(null);
        setSelectedPujaId("");
        setSelectedSlot("");
        setStep(1);
        setBookingResult(null);
        setBookingError("");
        reset(DEFAULT_ADDRESS);
    }

    return (
        <main className="min-h-screen bg-background">
            {/* Page heading */}
            <section className="border-b border-border bg-card">
                <div className="mx-auto max-w-7xl px-5 py-10 sm:py-14 lg:px-8">
                    <p className="mb-3 text-sm font-semibold tracking-wide text-primary">
                        TRUSTED PUROHITS
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        अनुभवी पंडित खोजें
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                        अपनी पूजा के लिए अनुभवी और verified पंडित चुनें।
                        तारीख और समय के अनुसार उपलब्धता देखें।
                    </p>
                </div>
            </section>

            {/* Filters and listing */}
            <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
                <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* City filter */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-foreground">
                                <MapPin className="mr-1 inline size-4 text-primary" />
                                शहर चुनें
                            </label>
                            
                            <Select value={city} onValueChange={setCity}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="सभी शहर" />
                                </SelectTrigger>

                                <SelectContent>
                                    {CITIES.map((city) => (
                                        <SelectItem key={city.value} value={city.value}>
                                            {city.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date filter */}
                        <div>
                            <label
                                htmlFor="availability-date"
                                className="mb-2 block text-sm font-semibold text-foreground"
                            >
                                <CalendarDays className="mr-1 inline size-4 text-primary" />
                                उपलब्ध तारीख
                            </label>

                            <input
                                id="availability-date"
                                type="date"
                                min={getLocalDateString()}
                                value={availableDate}
                                onChange={(event) => setAvailableDate(event.target.value)}
                                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        {/* Language chips */}
                        <div>
                            <p className="mb-2 text-sm font-semibold text-foreground">
                                भाषा चुनें
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {LANGUAGES.map((item) => {
                                    const active = language === item;

                                    return (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() =>
                                                setLanguage((previous) =>
                                                    previous === item ? "" : item
                                                )
                                            }
                                            aria-pressed={active}
                                            className={`rounded-full border px-3 py-2 text-xs font-medium transition-colors ${active
                                                ? "border-primary bg-saffron-light text-primary"
                                                : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary"
                                                }`}
                                        >
                                            {item}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {(city !== "all" || language || availableDate) && (
                        <button
                            type="button"
                            onClick={() => {
                                setCity("all");
                                setLanguage("");
                                setAvailableDate("");
                            }}
                            className="mt-5 text-sm font-semibold text-primary hover:underline"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>

                <div className="mb-6 mt-9 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-xl font-bold text-foreground">
                        उपलब्ध पंडित
                    </h2>

                    {!loading && (
                        <span className="text-sm text-muted-foreground">
                            {pandits.length} pandits found
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-64 animate-pulse rounded-2xl border border-border bg-card"
                            />
                        ))}
                    </div>
                ) : loadError ? (
                    <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center">
                        <p className="text-sm text-muted-foreground">{loadError}</p>

                        <button
                            type="button"
                            onClick={() => {
                                setCity((current) => current);
                                setAvailableDate((current) => current);
                            }}
                            className="mt-4 text-sm font-semibold text-primary hover:underline"
                        >
                            Please try again
                        </button>
                    </div>
                ) : pandits.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                        <Users className="mx-auto mb-4 size-10 text-muted-foreground" />

                        <h3 className="text-lg font-semibold text-foreground">
                            कोई पंडित नहीं मिला
                        </h3>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Filters बदलकर दोबारा कोशिश करें।
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {pandits.map((pandit) => (
                            <PanditCard
                                key={pandit.id}
                                pandit={pandit}
                                onBook={openBooking}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Four-step booking dialog */}
            <Dialog open={dialogOpen} onOpenChange={closeBooking}>
                <DialogContent className="max-h-[90vh] w-[calc(100%-1.5rem)] max-w-xl overflow-y-auto rounded-2xl p-5 sm:p-7">
                    {bookingResult ? (
                        <div className="py-7 text-center">
                            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-saffron-light text-primary">
                                <CheckCircle2 size={34} />
                            </div>

                            <h2 className="mt-5 text-2xl font-bold text-foreground">
                                Booking Successful!
                            </h2>

                            <p className="mt-2 text-sm text-muted-foreground">
                                आपकी mock booking successfully create हो गई है।
                            </p>

                            <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4 text-left">
                                <p className="text-xs text-muted-foreground">
                                    Booking ID
                                </p>

                                <p className="mt-1 font-bold text-primary">
                                    {bookingResult.bookingId}
                                </p>

                                <div className="mt-4 space-y-2 text-sm">
                                    <p className="text-foreground">
                                        <span className="text-muted-foreground">Pandit: </span>
                                        {selectedPandit?.name}
                                    </p>

                                    <p className="text-foreground">
                                        <span className="text-muted-foreground">Puja: </span>
                                        {selectedPuja?.nameHindi || selectedPuja?.name}
                                    </p>

                                    <p className="text-foreground">
                                        <span className="text-muted-foreground">Date: </span>
                                        {formatDate(bookingDate)}
                                    </p>

                                    <p className="text-foreground">
                                        <span className="text-muted-foreground">Slot: </span>
                                        {selectedSlot}
                                    </p>
                                </div>
                            </div>

                            <p className="mt-4 text-xs text-muted-foreground">
                                यह demo booking है। कोई वास्तविक payment नहीं हुई है।
                            </p>

                            <button
                                type="button"
                                onClick={resetBooking}
                                className="mt-6 w-full rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-saffron-dark"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <>
                            <DialogHeader className="mb-5 text-left">
                                <DialogTitle className="text-xl font-bold text-foreground">
                                    Book Your Pandit
                                </DialogTitle>

                                <DialogDescription>
                                    {selectedPandit?.name} के साथ अपनी पूजा बुक करें।
                                </DialogDescription>
                            </DialogHeader>

                            <StepProgress step={step} />

                            {/* Step 1: Select puja */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-foreground">
                                            कौन-सी पूजा करवानी है?
                                        </h3>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            अपनी पसंद की पूजा चुनें।
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        {pujas.map((puja) => {
                                            const active = selectedPujaId === puja.id;

                                            return (
                                                <button
                                                    key={puja.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedPujaId(puja.id);
                                                        setBookingError("");
                                                    }}
                                                    aria-pressed={active}
                                                    className={`flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors ${active
                                                        ? "border-primary bg-saffron-light"
                                                        : "border-border hover:border-primary/50"
                                                        }`}
                                                >
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-foreground">
                                                            {puja.nameHindi || puja.name}
                                                        </p>

                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {puja.durationMin} minutes
                                                        </p>
                                                    </div>

                                                    <span className="shrink-0 text-sm font-bold text-primary">
                                                        ₹{Number(puja.price).toLocaleString("en-IN")}
                                                    </span>
                                                </button>
                                            );
                                        })}

                                        {pujas.length === 0 && (
                                            <p className="py-6 text-center text-sm text-muted-foreground">
                                                पूजा की जानकारी लोड हो रही है या उपलब्ध नहीं है।
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Date and slot */}
                            {step === 2 && (
                                <div className="space-y-5">
                                    <div>
                                        <h3 className="font-semibold text-foreground">
                                            तारीख और समय चुनें
                                        </h3>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            अपनी सुविधा के अनुसार booking slot चुनें।
                                        </p>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="booking-date"
                                            className="mb-2 block text-sm font-medium text-foreground"
                                        >
                                            पूजा की तारीख
                                        </label>

                                        <input
                                            id="booking-date"
                                            type="date"
                                            min={getLocalDateString()}
                                            value={bookingDate}
                                            onChange={(event) => {
                                                setBookingDate(event.target.value);
                                                setSelectedSlot("");
                                                setBookingError("");
                                            }}
                                            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    <div>
                                        <p className="mb-3 text-sm font-medium text-foreground">
                                            Available time slots
                                        </p>

                                        <div className="grid grid-cols-2 gap-2">
                                            {BOOKING_SLOTS.map((slot) => {
                                                const active = selectedSlot === slot;

                                                return (
                                                    <button
                                                        key={slot}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedSlot(slot);
                                                            setBookingError("");
                                                        }}
                                                        aria-pressed={active}
                                                        className={`rounded-lg border px-3 py-3 text-xs font-medium transition-colors sm:text-sm ${active
                                                            ? "border-primary bg-saffron-light text-primary"
                                                            : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                                                            }`}
                                                    >
                                                        {slot}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Address */}
                            {step === 3 && (
                                <form
                                    id="booking-address-form"
                                    onSubmit={handleSubmit(handleNext)}
                                    className="space-y-4"
                                    noValidate
                                >
                                    <div>
                                        <h3 className="font-semibold text-foreground">
                                            पूजा का पता
                                        </h3>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            जहाँ पूजा करवानी है, वह address भरें।
                                        </p>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="addressLine"
                                            className="mb-1.5 block text-sm font-medium text-foreground"
                                        >
                                            पूरा पता *
                                        </label>

                                        <textarea
                                            id="addressLine"
                                            rows={3}
                                            placeholder="House no., street, area..."
                                            {...register("addressLine")}
                                            className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        />

                                        <FieldError>{errors.addressLine?.message}</FieldError>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="addressCity"
                                                className="mb-1.5 block text-sm font-medium text-foreground"
                                            >
                                                City *
                                            </label>

                                            <input
                                                id="addressCity"
                                                {...register("city")}
                                                placeholder="Jaipur"
                                                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            />

                                            <FieldError>{errors.city?.message}</FieldError>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="addressState"
                                                className="mb-1.5 block text-sm font-medium text-foreground"
                                            >
                                                State *
                                            </label>

                                            <input
                                                id="addressState"
                                                {...register("state")}
                                                placeholder="Rajasthan"
                                                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            />

                                            <FieldError>{errors.state?.message}</FieldError>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="addressPincode"
                                                className="mb-1.5 block text-sm font-medium text-foreground"
                                            >
                                                PIN Code *
                                            </label>

                                            <input
                                                id="addressPincode"
                                                inputMode="numeric"
                                                maxLength={6}
                                                {...register("pincode")}
                                                placeholder="302001"
                                                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            />

                                            <FieldError>{errors.pincode?.message}</FieldError>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="addressLandmark"
                                                className="mb-1.5 block text-sm font-medium text-foreground"
                                            >
                                                Landmark
                                            </label>

                                            <input
                                                id="addressLandmark"
                                                {...register("landmark")}
                                                placeholder="Near temple..."
                                                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            />

                                            <FieldError>{errors.landmark?.message}</FieldError>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {/* Step 4: Summary */}
                            {step === 4 && (
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-foreground">
                                            Booking Summary
                                        </h3>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Payment से पहले अपनी booking details जाँचें।
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-border bg-card p-4">
                                        <div className="flex items-center gap-3">
                                            <PanditAvatar name={selectedPandit?.name} />

                                            <div>
                                                <p className="font-semibold text-foreground">
                                                    {selectedPandit?.name}
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    {selectedPandit?.city}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="my-4 border-t border-border" />

                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between gap-3">
                                                <span className="text-muted-foreground">Puja</span>
                                                <span className="text-right font-medium text-foreground">
                                                    {selectedPuja?.nameHindi || selectedPuja?.name}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-3">
                                                <span className="text-muted-foreground">Date</span>
                                                <span className="font-medium text-foreground">
                                                    {formatDate(bookingDate)}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-3">
                                                <span className="text-muted-foreground">Time</span>
                                                <span className="text-right font-medium text-foreground">
                                                    {selectedSlot}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-3">
                                                <span className="text-muted-foreground">Address</span>
                                                <span className="max-w-[65%] text-right font-medium text-foreground">
                                                    {getValues("addressLine")},{" "}
                                                    {getValues("city")}, {getValues("state")} -{" "}
                                                    {getValues("pincode")}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="my-4 border-t border-border" />

                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-foreground">
                                                Total Amount
                                            </span>

                                            <span className="flex items-center gap-1 text-xl font-bold text-primary">
                                                <IndianRupee size={19} />
                                                {Number(selectedPuja?.price || 0).toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-xs leading-5 text-muted-foreground">
                                        यह केवल mock payment है। कोई वास्तविक पैसा charge नहीं होगा।
                                    </p>
                                </div>
                            )}

                            {bookingError && (
                                <p
                                    role="alert"
                                    className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
                                >
                                    {bookingError}
                                </p>
                            )}

                            {/* Back and Next / Pay controls */}
                            <div className="mt-7 flex items-center justify-between gap-3 border-t border-border pt-5">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    disabled={step === 1 || bookingLoading}
                                    className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronLeft size={17} />
                                    Back
                                </button>

                                {step < 3 ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-saffron-dark"
                                    >
                                        Next
                                        <ChevronRight size={17} />
                                    </button>
                                ) : step === 3 ? (
                                    <button
                                        type="submit"
                                        form="booking-address-form"
                                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-saffron-dark"
                                    >
                                        Review Booking
                                        <ChevronRight size={17} />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handlePayment}
                                        disabled={bookingLoading}
                                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-saffron-dark disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {bookingLoading ? (
                                            "Processing..."
                                        ) : (
                                            <>
                                                <IndianRupee size={17} />
                                                Pay (Demo)
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </main>
    );
}
