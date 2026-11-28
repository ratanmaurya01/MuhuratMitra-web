
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    MapPin,
    Languages,
    Star,
    CalendarDays,
    Clock3,
    IndianRupee,
    X,
    Loader2,
    ArrowRight,
    UserRound,
    BriefcaseBusiness,
} from "lucide-react";

import { getPandits } from "@/lib/api";
import { CITIES } from "@/constants/cities";
import { useAuth } from "@/hooks/useAuth";
import {
    getPublicPanditServices,
    submitBooking,
} from "@/services/bookingService";

const TODAY = new Date().toISOString().split("T")[0];

const INITIAL_BOOKING = {
    service_id: "",
    booking_date: "",
    booking_time: "",
    devotee_name: "",
    devotee_mobile: "",
    address: "",
    city: "",
    special_instructions: "",
};

const inputClass =
    "mt-2 w-full rounded-xl border border-[#e8ddce] bg-white px-4 py-3 text-sm text-[#573323] outline-none focus:border-[#a66a48] focus:ring-2 focus:ring-[#a66a48]/10";

function formatPrice(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
}

export default function PanditsPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const [pandits, setPandits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [city, setCity] = useState("all");
    const [search, setSearch] = useState("");
    const [language, setLanguage] = useState("");

    const [selectedPandit, setSelectedPandit] = useState(null);
    const [services, setServices] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(false);

    const [selectedService, setSelectedService] = useState(null);
    const [bookingForm, setBookingForm] = useState(INITIAL_BOOKING);

    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState("");
    const [bookingSuccess, setBookingSuccess] = useState(null);


    const [pujaId, setPujaId] = useState("");
    const [queryReady, setQueryReady] = useState(false);
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("puja") || params.get("puja_id") || "";
        setPujaId(id);
        setQueryReady(true);
    }, []);



    // const fetchPandits = useCallback(async () => {
    //     try {
    //         setLoading(true);
    //         setLoadError("");

    //         const filters = {
    //             ...(city !== "all" ? { city } : {}),
    //             ...(language ? { language } : {}),
    //         };

    //         const response = await getPandits(filters);

    //         // Supports both array response and { data: [] } response
    //         const list = Array.isArray(response)
    //             ? response
    //             : Array.isArray(response?.data)
    //                 ? response.data
    //                 : [];

    //         setPandits(list);
    //     } catch (error) {
    //         console.error("Fetch Pandits Error:", error);
    //         setLoadError(
    //             error?.message || "Unable to load pandits. Please try again."
    //         );
    //         setPandits([]);
    //     } finally {
    //         setLoading(false);
    //     }
    // }, [city, language]);

    const fetchPandits = useCallback(async () => {
        if (!queryReady) return;

        try {
            setLoading(true);
            setLoadError("");

            const filters = {
                ...(city !== "all" ? { city } : {}),
                ...(language ? { language } : {}),
                ...(pujaId ? { puja: pujaId } : {}),
            };

            const response = await getPandits(filters);

            const list = Array.isArray(response)
                ? response
                : Array.isArray(response?.data)
                    ? response.data
                    : [];

            setPandits(list);
        } catch (error) {
            console.error("Fetch Pandits Error:", error);
            setLoadError(
                error?.message || "Unable to load pandits. Please try again."
            );
            setPandits([]);
        } finally {
            setLoading(false);
        }
    }, [city, language, pujaId, queryReady]);


    useEffect(() => {
        fetchPandits();
    }, [fetchPandits]);


    const openPanditServices = async (pandit) => {
        if (authLoading) return;

        if (!user) {
            const redirectUrl = pujaId
                ? `/pandits?puja=${encodeURIComponent(pujaId)}`
                : "/pandits";

            router.push(
                `/login?redirect=${encodeURIComponent(redirectUrl)}`
            );
            return;
        }

        if (user.role?.toUpperCase() !== "DEVOTEE") {
            alert("Please login with a Devotee account to book.");
            return;
        }

        setSelectedPandit(pandit);
        setSelectedService(null);
        setServices([]);
        setBookingError("");
        setBookingSuccess(null);

        setBookingForm({
            ...INITIAL_BOOKING,
            devotee_name: user.name || "",
            devotee_mobile: user.mobile || user.phone || "",
            city: pandit.city || "",
        });

        // PUJA FLOW: No service fetching or selection
        if (pujaId) {
            return;
        }

        // DIRECT BOOKING FLOW: Fetch services
        try {
            setServicesLoading(true);

            const response = await getPublicPanditServices(pandit.id);

            const list = Array.isArray(response?.data)
                ? response.data
                : [];

            setServices(list);
        } catch (error) {
            console.error("Fetch Pandit Services Error:", error);
            setBookingError(
                error?.message || "Unable to load this pandit's services."
            );
        } finally {
            setServicesLoading(false);
        }
    };



    // const openPanditServices = async (pandit) => {
    //     if (authLoading) return;

    //     if (!user) {
    //         router.push(
    //             `/login?redirect=${encodeURIComponent("/pandits")}`
    //         );
    //         return;
    //     }

    //     if (user.role?.toUpperCase() !== "DEVOTEE") {
    //         alert("Please login with a Devotee account to book a service.");
    //         return;
    //     }

    //     setSelectedPandit(pandit);
    //     setSelectedService(null);
    //     setServices([]);
    //     setBookingError("");
    //     setBookingSuccess(null);
    //     setBookingForm({
    //         ...INITIAL_BOOKING,
    //         devotee_name: user.name || "",
    //         devotee_mobile: user.mobile || user.phone || "",
    //         city: pandit.city || "",
    //     });

    //     try {
    //         setServicesLoading(true);

    //         const response = await getPublicPanditServices(pandit.id);

    //         const list = Array.isArray(response?.data)
    //             ? response.data
    //             : [];

    //         setServices(list);
    //     } catch (error) {
    //         console.error("Fetch Pandit Services Error:", error);
    //         setBookingError(
    //             error?.message || "Unable to load this pandit's services."
    //         );
    //     } finally {
    //         setServicesLoading(false);
    //     }
    // };

    const closeBooking = () => {
        if (bookingLoading) return;

        setSelectedPandit(null);
        setSelectedService(null);
        setServices([]);
        setBookingForm(INITIAL_BOOKING);
        setBookingError("");
        setBookingSuccess(null);
    };

    const updateBookingForm = (event) => {
        const { name, value } = event.target;

        setBookingForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    const handleBookingSubmit = async (event) => {
        event.preventDefault();

        if (!user || user.role?.toUpperCase() !== "DEVOTEE") {
            const redirectUrl = pujaId
                ? `/pandits?puja=${encodeURIComponent(pujaId)}`
                : "/pandits";

            router.push(
                `/login?redirect=${encodeURIComponent(redirectUrl)}`
            );
            return;
        }

        if (!selectedPandit) {
            setBookingError("Please select a Pandit.");
            return;
        }

        // Direct booking requires a service.
        // Puja booking does not.
        if (!pujaId && !selectedService) {
            setBookingError("Please select a service first.");
            return;
        }

        if (
            !bookingForm.booking_date ||
            !bookingForm.booking_time ||
            !bookingForm.devotee_name.trim() ||
            !bookingForm.devotee_mobile.trim() ||
            !bookingForm.address.trim() ||
            !bookingForm.city.trim()
        ) {
            setBookingError("Please fill all required booking details.");
            return;
        }

        try {
            setBookingLoading(true);
            setBookingError("");

            const commonPayload = {
                booking_date: bookingForm.booking_date,
                booking_time: bookingForm.booking_time,
                devotee_name: bookingForm.devotee_name.trim(),
                devotee_mobile: bookingForm.devotee_mobile.trim(),
                address: bookingForm.address.trim(),
                city: bookingForm.city.trim(),
                special_instructions:
                    bookingForm.special_instructions.trim(),
            };

            const payload = pujaId
                ? {
                    ...commonPayload,
                    booking_type: "puja",
                    pandit_id: selectedPandit.id,
                    puja_id: Number(pujaId),
                }
                : {
                    ...commonPayload,
                    booking_type: "service",
                    service_id: selectedService.id,
                };

            const response = await submitBooking(payload);

            if (!response?.success) {
                setBookingError(
                    response?.message || "Unable to create booking."
                );
                return;
            }

            setBookingSuccess(response.data);
        } catch (error) {
            console.error("Create Booking Error:", error);
            setBookingError(
                error?.message || "Booking failed. Please try again."
            );
        } finally {
            setBookingLoading(false);
        }
    };


    // const handleBookingSubmit = async (event) => {
    //     event.preventDefault();

    //     if (!user || user.role?.toUpperCase() !== "DEVOTEE") {
    //         router.push(
    //             `/login?redirect=${encodeURIComponent("/pandits")}`
    //         );
    //         return;
    //     }

    //     if (!selectedPandit || !selectedService) {
    //         setBookingError("Please select a service first.");
    //         return;
    //     }

    //     if (
    //         !bookingForm.booking_date ||
    //         !bookingForm.booking_time ||
    //         !bookingForm.devotee_name.trim() ||
    //         !bookingForm.devotee_mobile.trim() ||
    //         !bookingForm.address.trim() ||
    //         !bookingForm.city.trim()
    //     ) {
    //         setBookingError("Please fill all required booking details.");
    //         return;
    //     }

    //     try {
    //         setBookingLoading(true);
    //         setBookingError("");

    //         const payload = {
    //             service_id: selectedService.id,
    //             booking_date: bookingForm.booking_date,
    //             booking_time: bookingForm.booking_time,
    //             devotee_name: bookingForm.devotee_name.trim(),
    //             devotee_mobile: bookingForm.devotee_mobile.trim(),
    //             address: bookingForm.address.trim(),
    //             city: bookingForm.city.trim(),
    //             special_instructions:
    //                 bookingForm.special_instructions.trim(),
    //         };

    //         const response = await submitBooking(payload);

    //         if (!response?.success) {
    //             setBookingError(
    //                 response?.message || "Unable to create booking."
    //             );
    //             return;
    //         }

    //         setBookingSuccess(response.data);
    //     } catch (error) {
    //         console.error("Create Booking Error:", error);
    //         setBookingError(
    //             error?.message || "Booking failed. Please try again."
    //         );
    //     } finally {
    //         setBookingLoading(false);
    //     }
    // };

    const filteredPandits = pandits.filter((pandit) => {
        const name = (pandit.name || pandit.fullName || "").toLowerCase();
        const specialization = (pandit.specialization || "").toLowerCase();
        const query = search.toLowerCase();

        return (
            name.includes(query) ||
            specialization.includes(query)
        );
    });

    return (
        <main className="min-h-screen bg-[#fffaf5]">
            {/* Page heading */}
            <section className="border-b border-[#eadfd4] bg-white">
                <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a66a48]">
                        MUHURATMITRA / FIND A PANDIT
                    </p>

                    <h1 className="mt-3 text-3xl font-bold text-[#573323] sm:text-4xl">
                        Find the Right Pandit
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#947969]">
                        Explore verified Vedic Pandits, view their services
                        and book your puja online.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
                {/* Filters */}
                <div className="grid gap-4 rounded-2xl border border-[#eadfd4] bg-white p-5 md:grid-cols-3">
                    <div>
                        <label className="text-sm font-semibold text-[#705647]">
                            <MapPin size={15} className="mr-1 inline" />
                            Select City
                        </label>

                        <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className={inputClass}
                        >
                            {CITIES.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-[#705647]">
                            <Languages size={15} className="mr-1 inline" />
                            Language
                        </label>

                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className={inputClass}
                        >
                            <option value="">All Languages</option>
                            <option value="Hindi">Hindi</option>
                            <option value="English">English</option>
                            <option value="Sanskrit">Sanskrit</option>
                            <option value="Marwari">Marwari</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-[#705647]">
                            <Search size={15} className="mr-1 inline" />
                            Search Pandit
                        </label>

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Name or specialization..."
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Listing heading */}
                <div className="mb-5 mt-9 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-[#573323]">
                            {pujaId ? "Pandits for Your Selected Puja" : "Available Pandits"}
                        </h2>
                        <p className="mt-1 text-sm text-[#947969]">
                            {loading
                                ? "Finding pandits..."
                                : `${filteredPandits.length} pandits found`}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={fetchPandits}
                        disabled={loading}
                        className="rounded-xl border border-[#e8ddce] bg-white px-4 py-2 text-sm font-semibold text-[#705647] hover:bg-[#fff2e8] disabled:opacity-50"
                    >
                        Refresh
                    </button>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-72 animate-pulse rounded-2xl border border-[#eadfd4] bg-white"
                            />
                        ))}
                    </div>
                ) : loadError ? (
                    <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
                        <p className="text-sm text-red-600">{loadError}</p>
                        <button
                            onClick={fetchPandits}
                            className="mt-4 rounded-xl bg-[#8b472e] px-5 py-2.5 text-sm font-semibold text-white"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredPandits.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#ddcabb] bg-white px-5 py-16 text-center">
                        <UserRound
                            size={38}
                            className="mx-auto text-[#b89b88]"
                        />
                        <h3 className="mt-4 text-lg font-bold text-[#573323]">
                            No Pandits Found
                        </h3>
                        <p className="mt-2 text-sm text-[#947969]">
                            Try another city or search term.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredPandits.map((pandit) => {
                            const name =
                                pandit.name || pandit.fullName || "Pandit";

                            return (
                                <article
                                    key={pandit.id}
                                    className="overflow-hidden rounded-2xl border border-[#eadfd4] bg-white shadow-[0_3px_14px_rgba(76,48,30,0.04)] transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="flex items-center gap-4 p-5">
                                        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#fff0e4]">
                                            {pandit.profile_image ? (
                                                <img
                                                    src={pandit.profile_image}
                                                    alt={name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <UserRound
                                                    size={34}
                                                    className="text-[#a66a48]"
                                                />
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="truncate text-lg font-bold text-[#573323]">
                                                {name}
                                            </h3>

                                            <p className="mt-1 text-sm text-[#947969]">
                                                {pandit.specialization ||
                                                    "Vedic Pandit"}
                                            </p>

                                            {pandit.verification_status ===
                                                "approved" && (
                                                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-green-700">
                                                        <Star size={13} />
                                                        Verified Pandit
                                                    </span>
                                                )}
                                        </div>
                                    </div>

                                    <div className="space-y-3 px-5 pb-5">
                                        <div className="flex flex-wrap gap-3 text-sm text-[#80695a]">
                                            {pandit.city && (
                                                <span className="inline-flex items-center gap-1">
                                                    <MapPin size={14} />
                                                    {pandit.city}
                                                </span>
                                            )}

                                            {pandit.experience !== undefined &&
                                                pandit.experience !== null && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <BriefcaseBusiness size={14} />
                                                        {pandit.experience} years
                                                    </span>
                                                )}
                                        </div>

                                        {pandit.languages && (
                                            <p className="text-xs text-[#947969]">
                                                Languages:{" "}
                                                {Array.isArray(pandit.languages)
                                                    ? pandit.languages.join(", ")
                                                    : pandit.languages}
                                            </p>
                                        )}

                                        {pandit.about && (
                                            <p className="line-clamp-2 text-sm leading-6 text-[#80695a]">
                                                {pandit.about}
                                            </p>
                                        )}




                                        <div className="grid grid-cols-2 gap-3">
                                            {/* View Profile */}
                                            <button
                                                type="button"
                                                onClick={() => router.push(`/pandits/${pandit.id}`)}
                                                className="flex items-center justify-center gap-2 rounded-xl border border-[#8b472e] bg-white px-3 py-3 text-sm font-semibold text-[#8b472e] transition hover:bg-[#fff2e8]"
                                            >
                                                <UserRound size={16} />
                                                View Profile
                                            </button>

                                            {/* View Services & Book */}
                                            <button
                                                type="button"
                                                onClick={() => openPanditServices(pandit)}
                                                disabled={authLoading}
                                                className="flex items-center justify-center gap-2 rounded-xl bg-[#8b472e] px-3 py-3 text-sm font-semibold text-white transition hover:bg-[#713923] disabled:opacity-50"
                                            >
                                                {pujaId ? "Book This Pandit" : "View Services"}
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>





                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Booking modal */}
            {selectedPandit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5">
                    <div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-[#fffdfb] shadow-2xl">
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eadfd4] bg-[#fffdfb] p-5">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-[#a66a48]">
                                    {pujaId ? "BOOK A PUJA" : "BOOK A SERVICE"}
                                </p>
                                <h2 className="mt-1 text-xl font-bold text-[#573323]">
                                    {selectedPandit.name ||
                                        selectedPandit.fullName}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeBooking}
                                disabled={bookingLoading}
                                className="rounded-full p-2 text-[#705647] hover:bg-[#f5e9df]"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-5 p-5 sm:p-6">
                            {bookingSuccess ? (
                                <div className="py-8 text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-700">
                                        <Star size={30} />
                                    </div>

                                    <h3 className="mt-4 text-2xl font-bold text-[#573323]">
                                        Booking Submitted!
                                    </h3>

                                    <p className="mt-2 text-sm text-[#947969]">
                                        Your booking request has been sent to
                                        the Pandit.
                                    </p>

                                    <div className="mx-auto mt-5 max-w-sm rounded-xl bg-[#fff2e8] p-4 text-left">
                                        <p className="text-xs text-[#947969]">
                                            Booking Number
                                        </p>
                                        <p className="mt-1 font-bold text-[#573323]">
                                            {bookingSuccess.booking_number}
                                        </p>
                                        <p className="mt-3 text-xs text-[#947969]">
                                            Status
                                        </p>
                                        <p className="mt-1 font-bold uppercase text-amber-700">
                                            {bookingSuccess.status}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            closeBooking();
                                            router.push("/devotee/bookings");
                                        }}
                                        className="mt-6 rounded-xl bg-[#8b472e] px-6 py-3 text-sm font-semibold text-white"
                                    >
                                        View My Bookings
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Services */}
                                    {!pujaId && (
                                        <section>
                                            <h3 className="font-bold text-[#573323]">
                                                1. Select a Service
                                            </h3>

                                            {servicesLoading ? (
                                                <div className="flex items-center justify-center py-10 text-sm text-[#947969]">
                                                    <Loader2
                                                        className="mr-2 animate-spin"
                                                        size={20}
                                                    />
                                                    Loading services...
                                                </div>
                                            ) : services.length === 0 ? (
                                                <p className="mt-3 rounded-xl bg-[#fff2e8] p-4 text-sm text-[#8b472e]">
                                                    This Pandit has no active
                                                    services available for booking.
                                                </p>
                                            ) : (
                                                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                                    {services.map((service) => (
                                                        <button
                                                            type="button"
                                                            key={service.id}
                                                            onClick={() =>
                                                                setSelectedService(
                                                                    service
                                                                )
                                                            }
                                                            className={`rounded-xl border p-4 text-left transition ${selectedService?.id ===
                                                                service.id
                                                                ? "border-[#8b472e] bg-[#fff2e8] ring-2 ring-[#8b472e]/10"
                                                                : "border-[#eadfd4] bg-white hover:border-[#c69a7e]"
                                                                }`}
                                                        >
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div>
                                                                    <p className="font-bold text-[#573323]">
                                                                        {service.service_name}
                                                                    </p>
                                                                    <p className="mt-1 text-xs text-[#947969]">
                                                                        {service.category}
                                                                    </p>
                                                                </div>

                                                                {selectedService?.id ===
                                                                    service.id && (
                                                                        <span className="text-xs font-bold text-[#8b472e]">
                                                                            Selected
                                                                        </span>
                                                                    )}
                                                            </div>

                                                            <p className="mt-3 flex items-center font-bold text-[#8b472e]">
                                                                <IndianRupee size={15} />
                                                                {formatPrice(
                                                                    service.price
                                                                )}
                                                            </p>

                                                            {service.duration_minutes && (
                                                                <p className="mt-1 flex items-center gap-1 text-xs text-[#947969]">
                                                                    <Clock3 size={13} />
                                                                    {service.duration_minutes} minutes
                                                                </p>
                                                            )}

                                                            {service.description && (
                                                                <p className="mt-2 line-clamp-2 text-xs text-[#947969]">
                                                                    {service.description}
                                                                </p>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </section>

                                    )}

                                    {/* Booking form */}
                                    {(pujaId || selectedService) && (
                                        <form
                                            onSubmit={handleBookingSubmit}
                                            className="space-y-4 border-t border-[#eadfd4] pt-5"
                                        >

                                            <h3 className="font-bold text-[#573323]">
                                                {pujaId ? "1. Puja Booking Details" : "2. Booking Details"}
                                            </h3>

                                            {bookingError && (
                                                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                                    {bookingError}
                                                </div>
                                            )}

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <label className="text-sm font-semibold text-[#705647]">
                                                    Puja Date *
                                                    <input
                                                        required
                                                        type="date"
                                                        min={TODAY}
                                                        name="booking_date"
                                                        value={bookingForm.booking_date}
                                                        onChange={updateBookingForm}
                                                        className={inputClass}
                                                    />
                                                </label>

                                                <label className="text-sm font-semibold text-[#705647]">
                                                    Preferred Time *
                                                    <input
                                                        required
                                                        type="time"
                                                        name="booking_time"
                                                        value={bookingForm.booking_time}
                                                        onChange={updateBookingForm}
                                                        className={inputClass}
                                                    />
                                                </label>

                                                <label className="text-sm font-semibold text-[#705647]">
                                                    Your Name *
                                                    <input
                                                        required
                                                        name="devotee_name"
                                                        value={bookingForm.devotee_name}
                                                        onChange={updateBookingForm}
                                                        className={inputClass}
                                                        placeholder="Full name"
                                                    />
                                                </label>

                                                <label className="text-sm font-semibold text-[#705647]">
                                                    Mobile Number *
                                                    <input
                                                        required
                                                        type="tel"
                                                        name="devotee_mobile"
                                                        value={bookingForm.devotee_mobile}
                                                        onChange={updateBookingForm}
                                                        className={inputClass}
                                                        placeholder="Mobile number"
                                                    />
                                                </label>

                                                <label className="text-sm font-semibold text-[#705647] sm:col-span-2">
                                                    Full Address *
                                                    <textarea
                                                        required
                                                        rows={2}
                                                        name="address"
                                                        value={bookingForm.address}
                                                        onChange={updateBookingForm}
                                                        className={inputClass}
                                                        placeholder="House number, street, area..."
                                                    />
                                                </label>

                                                <label className="text-sm font-semibold text-[#705647]">
                                                    City *
                                                    <input
                                                        required
                                                        name="city"
                                                        value={bookingForm.city}
                                                        onChange={updateBookingForm}
                                                        className={inputClass}
                                                        placeholder="Your city"
                                                    />
                                                </label>

                                                <label className="text-sm font-semibold text-[#705647] sm:col-span-2">
                                                    Special Instructions
                                                    <textarea
                                                        rows={3}
                                                        name="special_instructions"
                                                        value={bookingForm.special_instructions}
                                                        onChange={updateBookingForm}
                                                        className={inputClass}
                                                        placeholder="Any additional requirements..."
                                                    />
                                                </label>
                                            </div>


                                            {!pujaId && selectedService && (
                                                <div className="flex items-center justify-between rounded-xl bg-[#fff2e8] p-4">
                                                    <span className="text-sm font-semibold text-[#705647]">
                                                        Service Amount
                                                    </span>

                                                    <span className="text-lg font-bold text-[#8b472e]">
                                                        {formatPrice(selectedService.price)}
                                                    </span>
                                                </div>
                                            )}


                                            <p className="text-xs leading-5 text-[#947969]">
                                                This request will be sent to
                                                the Pandit for confirmation.
                                                Payment is not collected here.
                                            </p>

                                            <button
                                                type="submit"
                                                disabled={bookingLoading}
                                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8b472e] px-5 py-3.5 text-sm font-bold text-white hover:bg-[#713923] disabled:opacity-60"
                                            >
                                                {bookingLoading ? (
                                                    <>
                                                        <Loader2
                                                            size={18}
                                                            className="animate-spin"
                                                        />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        Confirm Booking Request
                                                        <ArrowRight size={17} />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
