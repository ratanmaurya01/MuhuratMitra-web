
"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";


import {
    BadgeCheck,
    CalendarDays,
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    IndianRupee,
    LanguagesIcon,
    MapPin,
    Printer,
    Printer3DIcon,
    Share2,
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
import PanditCard from "@/components/pandit/PanditCard";
import PanditBookingDialog from "@/components/pandit/PanditBookingDialog";
import { getLocalDateString } from "@/utils/dateUtils";

// -------------------- Constants --------------------

const LANGUAGES = ["Hindi", "English", "Sanskrit", "Marwari"];


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

export default function PanditsPage() {
    // Listing filters and data
    const [pandits, setPandits] = useState([]);
    const [pujas, setPujas] = useState([]);
    const [city, setCity] = useState("all");
    const [language, setLanguage] = useState("");
    const [availableDate, setAvailableDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [selectedPujaId, setSelectedPujaId] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPandit, setSelectedPandit] = useState(null);

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

    useEffect(() => {
        let isActive = true;
        async function loadPujas() {
            try {
                const result = await getPujas();
                if (!isActive) return;
                setPujas(result);
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
        setDialogOpen(true);
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
            setBookingError("Booking is not work please try again");
        } finally {
            setBookingLoading(false);
        }
    }
    
    return (
        <main className="min-h-screen bg-background">

            <h1 className="px-12 ">Verified Vedic Pandits</h1>
            {/* Filters and listing */}
            <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
                <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* City filter */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-foreground">
                                <MapPin className="mr-1 inline size-4 text-primary" />
                                Select City
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
                                Available Date
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

                            <p className="mb-2 flex items-center justify-center gap-2 text-sm font-semibold text-foreground">
                                <LanguagesIcon size={18} />
                                <span>Select Language</span>
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
                        Available Pandits
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
                            Pandit not found
                        </h3>

                        <p className="mt-2 text-sm text-muted-foreground">
                          Sorry!. Try again
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
            <PanditBookingDialog
                open={dialogOpen}
                onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) {
                        setSelectedPandit(null);
                    }
                }}
                pandit={selectedPandit}
                availableDate={availableDate}
            />

        </main>
    );
}
