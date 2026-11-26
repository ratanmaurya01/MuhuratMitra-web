
"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    IndianRupee,
    UserRound,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { createBooking, getPujas } from "@/lib/api";
import { formatDate, getLocalDateString } from "@/utils/dateUtils";

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
    addressLine: z.string().trim()
        .min(10, "कम से कम 10 characters का पूरा पता लिखें।")
        .max(200, "पता 200 characters से कम होना चाहिए।"),
    city: z.string().trim()
        .min(2, "शहर का नाम लिखें।")
        .max(60, "शहर का नाम बहुत लंबा है।"),
    state: z.string().trim()
        .min(2, "राज्य का नाम लिखें।")
        .max(60, "राज्य का नाम बहुत लंबा है।"),
    pincode: z.string()
        .regex(/^[1-9][0-9]{5}$/, "सही 6 digit PIN code लिखें।"),
    landmark: z.string()
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


function PanditAvatar({ name = "" }) {
    const initials = name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("");

    return (
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#f8ead9] font-bold text-[#9b4c2c]">
            {initials || <UserRound size={22} />}
        </div>
    );
}

function StepProgress({ step }) {
    return (
        <div className="mb-6">
            <div className="mb-3 flex items-start justify-between gap-1">
                {BOOKING_STEPS.map((label, index) => {
                    const number = index + 1;
                    const complete = number < step;
                    const active = number === step;

                    return (
                        <div
                            key={label}
                            className="flex min-w-0 flex-1 flex-col items-center gap-2"
                        >
                            <div
                                className={`flex size-8 items-center justify-center rounded-full text-xs font-semibold ${complete || active
                                        ? "bg-[#d95718] text-white"
                                        : "bg-[#f1e5d9] text-[#8b776b]"
                                    }`}
                            >
                                {complete ? <Check size={15} /> : number}
                            </div>

                            <span
                                className={`text-center text-[10px] sm:text-xs ${active ? "font-semibold text-[#d95718]" : "text-[#8b776b]"
                                    }`}
                            >
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-[#f1e5d9]">
                <div
                    className="h-full rounded-full bg-[#d95718] transition-all duration-300"
                    style={{ width: `${(step / 4) * 100}%` }}
                />
            </div>
        </div>
    );
}

function FieldError({ children }) {
    if (!children) return null;

    return (
        <p className="mt-1.5 text-xs text-red-600">
            {children}
        </p>
    );
}

export default function PanditBookingDialog({
    open,
    onOpenChange,
    pandit,
    availableDate = "",
}) {
    const [pujas, setPujas] = useState([]);
    const [pujasLoading, setPujasLoading] = useState(false);
    const [selectedPujaId, setSelectedPujaId] = useState("");
    const [bookingDate, setBookingDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [step, setStep] = useState(1);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState("");
    const [bookingResult, setBookingResult] = useState(null);

    const {
        register,
        handleSubmit,
        trigger,
        getValues,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(addressSchema),
        defaultValues: DEFAULT_ADDRESS,
        mode: "onTouched",
    });

    const selectedPuja = useMemo(
        () => pujas.find((puja) => String(puja.id) === String(selectedPujaId)) || null,
        [pujas, selectedPujaId]
    );

    useEffect(() => {
        if (!open) return;

        let active = true;

        async function loadPujas() {
            setPujasLoading(true);

            try {
                const result = await getPujas();

                if (active) {
                    setPujas(Array.isArray(result) ? result : []);
                }
            } catch (error) {
                console.error("Unable to load pujas:", error);
                if (active) setBookingError("पूजा की जानकारी लोड नहीं हो पाई।");
            } finally {
                if (active) setPujasLoading(false);
            }
        }

        loadPujas();

        return () => {
            active = false;
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;

        setStep(1);
        setSelectedPujaId("");
        setBookingDate(availableDate || getLocalDateString());
        setSelectedSlot("");
        setBookingError("");
        setBookingResult(null);
        reset(DEFAULT_ADDRESS);
    }, [open, pandit?.id, availableDate, reset]);

    function handleClose(value) {
        if (bookingLoading) return;

        onOpenChange(value);

        if (!value) {
            setBookingError("");
        }
    }

    async function handleNext() {
        setBookingError("");

        if (step === 1 && !selectedPujaId) {
            setBookingError("कृपया एक पूजा चुनें।");
            return;
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
            const valid = await trigger([
                "addressLine",
                "city",
                "state",
                "pincode",
                "landmark",
            ]);

            if (!valid) return;
        }

        setStep((current) => Math.min(current + 1, 4));
    }

    function handleBack() {
        setBookingError("");
        setStep((current) => Math.max(current - 1, 1));
    }

    async function handlePayment() {
        if (!pandit || !selectedPuja) return;

        setBookingLoading(true);
        setBookingError("");

        try {
            const booking = await createBooking({
                panditId: pandit.id,
                panditName: pandit.name,
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
        setBookingResult(null);
        setSelectedPujaId("");
        setSelectedSlot("");
        setStep(1);
        setBookingError("");
        reset(DEFAULT_ADDRESS);
        onOpenChange(false);
    }

    if (!pandit) return null;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-h-[90dvh] w-[calc(100%-1rem)] max-w-lg overflow-y-auto rounded-2xl border border-[#ead8c5] bg-[#fffaf5] p-5 text-[#4b2419] shadow-2xl sm:p-6">
                {bookingResult ? (
                    <div className="py-6 text-center">
                        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#f9e8df] text-[#d95718]">
                            <CheckCircle2 size={34} />
                        </div>

                        <h2 className="mt-5 text-2xl font-bold text-[#38251f]">
                            Booking Successful!
                        </h2>

                        <p className="mt-2 text-sm text-[#857469]">
                            आपकी booking successfully create हो गई है।
                        </p>

                        <div className="mt-6 rounded-xl border border-[#ead8c5] bg-white p-4 text-left">
                            <p className="text-xs text-[#857469]">Booking ID</p>
                            <p className="mt-1 font-bold text-[#d95718]">
                                {bookingResult.bookingId || "Created"}
                            </p>

                            <div className="mt-4 space-y-2 text-sm">
                                <p><span className="text-[#857469]">Pandit: </span>{pandit.name}</p>
                                <p><span className="text-[#857469]">Puja: </span>{selectedPuja?.nameHindi || selectedPuja?.name}</p>
                                <p><span className="text-[#857469]">Date: </span>{formatDate(bookingDate)}</p>
                                <p><span className="text-[#857469]">Slot: </span>{selectedSlot}</p>
                            </div>
                        </div>

                        <p className="mt-4 text-xs text-[#857469]">
                            यह demo payment है। कोई वास्तविक पैसा charge नहीं हुआ है।
                        </p>

                        <button
                            type="button"
                            onClick={resetBooking}
                            className="mt-6 w-full rounded-xl bg-[#d95718] px-5 py-3 font-semibold text-white hover:bg-[#b94715]"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <DialogHeader className="mb-5 text-left">
                            <DialogTitle className="text-xl font-bold text-[#38251f]">
                                Book Your Pandit
                            </DialogTitle>

                            <DialogDescription className="text-[#857469]">
                                {pandit.name} के साथ अपनी पूजा बुक करें।
                            </DialogDescription>
                        </DialogHeader>

                        <StepProgress step={step} />

                        {step === 1 && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-[#38251f]">
                                        कौन-सी पूजा करवानी है?
                                    </h3>
                                    <p className="mt-1 text-sm text-[#857469]">
                                        अपनी पसंद की पूजा चुनें।
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    {pujasLoading ? (
                                        <p className="py-6 text-center text-sm text-[#857469]">
                                            पूजा की जानकारी लोड हो रही है...
                                        </p>
                                    ) : pujas.length > 0 ? (
                                        pujas.map((puja) => {
                                            const active = String(selectedPujaId) === String(puja.id);

                                            return (
                                                <button
                                                    key={puja.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedPujaId(puja.id);
                                                        setBookingError("");
                                                    }}
                                                    aria-pressed={active}
                                                    className={`flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition ${active
                                                            ? "border-[#d95718] bg-[#f9e8df]"
                                                            : "border-[#ead8c5] bg-white hover:border-[#d95718]"
                                                        }`}
                                                >
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-[#38251f]">
                                                            {puja.nameHindi || puja.name}
                                                        </p>
                                                        <p className="mt-1 text-xs text-[#857469]">
                                                            {puja.durationMin || 0} minutes
                                                        </p>
                                                    </div>

                                                    <span className="shrink-0 text-sm font-bold text-[#d95718]">
                                                        ₹{Number(puja.price || 0).toLocaleString("en-IN")}
                                                    </span>
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <p className="py-6 text-center text-sm text-[#857469]">
                                            पूजा की जानकारी उपलब्ध नहीं है।
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-5">
                                <div>
                                    <h3 className="font-semibold text-[#38251f]">
                                        तारीख और समय चुनें
                                    </h3>
                                    <p className="mt-1 text-sm text-[#857469]">
                                        अपनी सुविधा के अनुसार booking slot चुनें।
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="booking-date" className="mb-2 block text-sm font-medium">
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
                                        className="h-11 w-full rounded-lg border border-[#ead8c5] bg-white px-3 text-sm outline-none focus:border-[#d95718]"
                                    />
                                </div>

                                <div>
                                    <p className="mb-3 text-sm font-medium">Available time slots</p>
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
                                                    className={`rounded-lg border px-3 py-3 text-xs font-medium transition sm:text-sm ${active
                                                            ? "border-[#d95718] bg-[#f9e8df] text-[#d95718]"
                                                            : "border-[#ead8c5] bg-white text-[#857469] hover:border-[#d95718]"
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

                        {step === 3 && (
                            <form
                                id="booking-address-form"
                                onSubmit={handleSubmit(handleNext)}
                                className="space-y-4"
                                noValidate
                            >
                                <div>
                                    <h3 className="font-semibold text-[#38251f]">पूजा का पता</h3>
                                    <p className="mt-1 text-sm text-[#857469]">
                                        जहाँ पूजा करवानी है, वह address भरें।
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="addressLine" className="mb-1.5 block text-sm font-medium">
                                        पूरा पता *
                                    </label>
                                    <textarea
                                        id="addressLine"
                                        rows={3}
                                        placeholder="House no., street, area..."
                                        {...register("addressLine")}
                                        className="w-full resize-none rounded-lg border border-[#ead8c5] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#d95718]"
                                    />
                                    <FieldError>{errors.addressLine?.message}</FieldError>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="addressCity" className="mb-1.5 block text-sm font-medium">
                                            City *
                                        </label>
                                        <input
                                            id="addressCity"
                                            {...register("city")}
                                            placeholder="Jaipur"
                                            className="h-11 w-full rounded-lg border border-[#ead8c5] bg-white px-3 text-sm outline-none focus:border-[#d95718]"
                                        />
                                        <FieldError>{errors.city?.message}</FieldError>
                                    </div>

                                    <div>
                                        <label htmlFor="addressState" className="mb-1.5 block text-sm font-medium">
                                            State *
                                        </label>
                                        <input
                                            id="addressState"
                                            {...register("state")}
                                            placeholder="Rajasthan"
                                            className="h-11 w-full rounded-lg border border-[#ead8c5] bg-white px-3 text-sm outline-none focus:border-[#d95718]"
                                        />
                                        <FieldError>{errors.state?.message}</FieldError>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="addressPincode" className="mb-1.5 block text-sm font-medium">
                                            PIN Code *
                                        </label>
                                        <input
                                            id="addressPincode"
                                            inputMode="numeric"
                                            maxLength={6}
                                            {...register("pincode")}
                                            placeholder="302001"
                                            className="h-11 w-full rounded-lg border border-[#ead8c5] bg-white px-3 text-sm outline-none focus:border-[#d95718]"
                                        />
                                        <FieldError>{errors.pincode?.message}</FieldError>
                                    </div>

                                    <div>
                                        <label htmlFor="addressLandmark" className="mb-1.5 block text-sm font-medium">
                                            Landmark
                                        </label>
                                        <input
                                            id="addressLandmark"
                                            {...register("landmark")}
                                            placeholder="Near temple..."
                                            className="h-11 w-full rounded-lg border border-[#ead8c5] bg-white px-3 text-sm outline-none focus:border-[#d95718]"
                                        />
                                        <FieldError>{errors.landmark?.message}</FieldError>
                                    </div>
                                </div>
                            </form>
                        )}

                        {step === 4 && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-[#38251f]">Booking Summary</h3>
                                    <p className="mt-1 text-sm text-[#857469]">
                                        Payment से पहले अपनी booking details जाँचें।
                                    </p>
                                </div>

                                <div className="rounded-xl border border-[#ead8c5] bg-white p-4">
                                    <div className="flex items-center gap-3">
                                        <PanditAvatar name={pandit.name} />
                                        <div>
                                            <p className="font-semibold text-[#38251f]">{pandit.name}</p>
                                            <p className="text-xs text-[#857469]">{pandit.city}</p>
                                        </div>
                                    </div>

                                    <div className="my-4 border-t border-[#eee5d9]" />

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between gap-3">
                                            <span className="text-[#857469]">Puja</span>
                                            <span className="text-right font-medium">
                                                {selectedPuja?.nameHindi || selectedPuja?.name}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-3">
                                            <span className="text-[#857469]">Date</span>
                                            <span className="font-medium">{formatDate(bookingDate)}</span>
                                        </div>

                                        <div className="flex justify-between gap-3">
                                            <span className="text-[#857469]">Time</span>
                                            <span className="text-right font-medium">{selectedSlot}</span>
                                        </div>

                                        <div className="flex justify-between gap-3">
                                            <span className="text-[#857469]">Address</span>
                                            <span className="max-w-[65%] text-right font-medium">
                                                {getValues("addressLine")}, {getValues("city")},{" "}
                                                {getValues("state")} - {getValues("pincode")}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="my-4 border-t border-[#eee5d9]" />

                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold">Total Amount</span>
                                        <span className="flex items-center gap-1 text-xl font-bold text-[#d95718]">
                                            <IndianRupee size={19} />
                                            {Number(selectedPuja?.price || 0).toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-xs leading-5 text-[#857469]">
                                    यह केवल mock payment है। कोई वास्तविक पैसा charge नहीं होगा।
                                </p>
                            </div>
                        )}

                        {bookingError && (
                            <p
                                role="alert"
                                className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
                            >
                                {bookingError}
                            </p>
                        )}

                        <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#ead8c5] pt-5">
                            <button
                                type="button"
                                onClick={handleBack}
                                disabled={step === 1 || bookingLoading}
                                className="inline-flex items-center gap-2 rounded-lg border border-[#ead8c5] px-4 py-3 text-sm font-semibold text-[#4b2419] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft size={17} />
                                Back
                            </button>

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={pujasLoading}
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#d95718] px-5 py-3 text-sm font-semibold text-white hover:bg-[#b94715] disabled:opacity-50"
                                >
                                    Next
                                    <ChevronRight size={17} />
                                </button>
                            ) : step === 3 ? (
                                <button
                                    type="submit"
                                    form="booking-address-form"
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#d95718] px-5 py-3 text-sm font-semibold text-white hover:bg-[#b94715]"
                                >
                                    Review Booking
                                    <ChevronRight size={17} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handlePayment}
                                    disabled={bookingLoading}
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#d95718] px-5 py-3 text-sm font-semibold text-white hover:bg-[#b94715] disabled:opacity-60"
                                >
                                    <IndianRupee size={17} />
                                    {bookingLoading ? "Processing..." : "Pay (Demo)"}
                                </button>
                            )}
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
