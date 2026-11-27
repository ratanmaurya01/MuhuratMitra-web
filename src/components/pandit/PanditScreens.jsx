
"use client";


import { useCallback, useEffect, useState } from "react";


import {
    getPanditProfile,
    savePanditProfile,
} from "@/services/panditService";

import {
    getPanditBookings,
    updatePanditBookingStatus,
} from "@/services/bookingService";



import Link from "next/link";

import {
    UserRound,
    CalendarDays,
    Wallet,
    Star,
    Clock3,
    CheckCircle2,
    ArrowRight,
    Plus,
    Trash2,
    Edit3,
    Camera,
    Save,
    MapPin,
    Phone,
    Mail,
    Flower2,
    IndianRupee,
    TrendingUp,
    X,
    RefreshCw,
} from "lucide-react";



const SAMPLE_SERVICES = [
    {
        id: 1,
        name: "Ganesh Puja",
        category: "Griha Puja",
        price: 2100,
        duration: "2 Hours",
        mode: "Offline",
        status: "Active",
    },
    {
        id: 2,
        name: "Satyanarayan Katha",
        category: "Katha",
        price: 3100,
        duration: "3 Hours",
        mode: "Both",
        status: "Active",
    },
    {
        id: 3,
        name: "Griha Pravesh Puja",
        category: "Griha Puja",
        price: 5100,
        duration: "3 Hours",
        mode: "Offline",
        status: "Active",
    },
];

const SAMPLE_BOOKINGS = [
    {
        id: "MM-1001",
        customer: "Amit Sharma",
        puja: "Ganesh Puja",
        date: "28 Nov 2026",
        time: "10:00 AM",
        amount: 2100,
        status: "Pending",
    },
    {
        id: "MM-1002",
        customer: "Neha Gupta",
        puja: "Satyanarayan Katha",
        date: "29 Nov 2026",
        time: "11:30 AM",
        amount: 3100,
        status: "Confirmed",
    },
    {
        id: "MM-1003",
        customer: "Rahul Verma",
        puja: "Griha Pravesh Puja",
        date: "01 Dec 2026",
        time: "08:00 AM",
        amount: 5100,
        status: "Completed",
    },
];

const money = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

function PageHeading({ eyebrow, title, description, action }) {
    return (
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
                <p className="text-xs font-bold tracking-wider text-[#a66a48]">
                    {eyebrow}
                </p>
                <h1 className="mt-2 text-2xl font-bold text-[#573323] sm:text-3xl">
                    {title}
                </h1>
                <p className="mt-2 text-sm text-[#9a8172]">
                    {description}
                </p>
            </div>
            {action}
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color = "orange", caption }) {
    const colors = {
        orange: "bg-orange-50 text-orange-600",
        green: "bg-green-50 text-green-600",
        blue: "bg-blue-50 text-blue-600",
        purple: "bg-purple-50 text-purple-600",
    };

    return (
        <div className="rounded-2xl border border-[#e8ddce] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{title}</p>
                <div className={`rounded-xl p-2 ${colors[color]}`}>
                    <Icon size={20} />
                </div>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-[#573323]">
                {value}
            </h2>
            {caption && (
                <p className="mt-1 text-xs text-gray-400">{caption}</p>
            )}
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        Pending: "bg-orange-50 text-orange-700",
        Confirmed: "bg-blue-50 text-blue-700",
        Completed: "bg-green-50 text-green-700",
        Cancelled: "bg-red-50 text-red-700",
        Active: "bg-green-50 text-green-700",
        Rejected: "bg-red-50 text-red-700",
    };

    return (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-600"}`}>
            {status}
        </span>
    );
}

// --------------------------------------------------
// DASHBOARD
// --------------------------------------------------

export function PanditDashboardScreen() {
    return (
        <div className="space-y-6">
            <PageHeading
                eyebrow="PANDIT / OVERVIEW"
                title="Welcome to your Dashboard"
                description="Manage your profile, puja services and customer bookings."
                action={
                    <Link
                        href="/pandit/complete-profile"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8b472e] px-4 py-3 text-sm font-semibold text-white hover:bg-[#713923]"
                    >
                        Complete Profile <ArrowRight size={17} />
                    </Link>
                }
            />

            <div className="rounded-2xl border border-[#ead8c7] bg-gradient-to-r from-[#fff4e8] to-[#fffdf7] p-5 sm:p-7">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-medium text-[#9b6243]">
                            Your professional journey starts here
                        </p>
                        <h2 className="mt-2 text-xl font-bold text-[#573323] sm:text-2xl">
                            Build your Pandit profile
                        </h2>
                        <p className="mt-2 max-w-xl text-sm text-[#8e7565]">
                            Add your experience, expertise and puja services
                            to help devotees discover and book you.
                        </p>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#8b472e] shadow-sm">
                        <Flower2 size={34} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                <StatCard title="Total Bookings" value="12" icon={CalendarDays} color="blue" />
                <StatCard title="Pending Requests" value="3" icon={Clock3} color="orange" />
                <StatCard title="Completed Pujas" value="8" icon={CheckCircle2} color="green" />
                <StatCard title="Total Earnings" value="₹24,500" icon={Wallet} color="purple" />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <section className="rounded-2xl border border-[#e8ddce] bg-white p-5">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-[#573323]">
                            Recent Bookings
                        </h2>
                        <Link href="/pandit/bookings" className="text-sm font-semibold text-[#8b472e]">
                            View All
                        </Link>
                    </div>

                    <div className="mt-4 space-y-4">
                        {SAMPLE_BOOKINGS.slice(0, 2).map((booking) => (
                            <div key={booking.id} className="flex items-center justify-between gap-3 border-b border-[#f1e9e1] pb-4 last:border-0">
                                <div>
                                    <p className="font-semibold text-[#573323]">
                                        {booking.puja}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {booking.customer} · {booking.date}
                                    </p>
                                </div>
                                <StatusBadge status={booking.status} />
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-2xl border border-[#e8ddce] bg-white p-5">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-[#573323]">
                            Quick Actions
                        </h2>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        {[
                            { label: "My Profile", href: "/pandit/profile", icon: UserRound },
                            { label: "Add Services", href: "/pandit/services", icon: Flower2 },
                            { label: "Bookings", href: "/pandit/bookings", icon: CalendarDays },
                            { label: "Earnings", href: "/pandit/earnings", icon: Wallet },
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="rounded-xl border border-[#eee4da] p-4 transition hover:border-[#c89b7d] hover:bg-[#fffaf5]"
                                >
                                    <Icon className="text-[#8b472e]" size={22} />
                                    <p className="mt-3 text-sm font-semibold text-[#573323]">
                                        {item.label}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
}

// --------------------------------------------------
// COMPLETE PROFILE
// --------------------------------------------------

export function CompleteProfileScreen() {


    const [form, setForm] = useState({
        fullName: "",
        dob: "",
        gender: "",
        mobile: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        gotra: "",
        sampradaya: "",
        languages: "",
        experience: "",
        qualification: "",
        specialization: "",
        about: "",
    });

    const [photoName, setPhotoName] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getPanditProfile();
                if (response?.success && response?.data) {
                    const data = response.data;

                    setForm({
                        fullName: data.fullName || "",
                        dob: data.dob ? String(data.dob).slice(0, 10) : "",
                        gender: data.gender || "",
                        mobile: data.mobile || "",
                        address: data.address || "",
                        city: data.city || "",
                        state: data.state || "",
                        pincode: data.pincode || "",
                        gotra: data.gotra || "",
                        sampradaya: data.sampradaya || "",
                        languages: Array.isArray(data.languages)
                            ? data.languages.join(", ")
                            : data.languages || "",
                        experience: data.experience ?? "",
                        qualification: data.qualification || "",
                        specialization: data.specialization || "",
                        about: data.about || "",
                    });
                }
            } catch (error) {
                console.error("Fetch Pandit Profile:", error);
            }
        };

        fetchProfile();
    }, []);

    const update = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            const response = await savePanditProfile({
                ...form,
                languages: form.languages
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
            });
            if (response?.success) {
                alert("Profile saved successfully!");
            } else {
                alert(response?.message || "Unable to save profile.");
            }
        } catch (error) {
            console.error("Save Pandit Profile:", error);
            alert("Something went wrong while saving profile.");
        } finally {
            setSaving(false);
        }
    };

    const inputClass = "mt-2 w-full rounded-xl border border-[#e8ddce] bg-white px-4 py-3 text-sm outline-none focus:border-[#a66a48]";
    const labelClass = "text-sm font-semibold text-[#705647]";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PageHeading
                eyebrow="PANDIT / MY ACCOUNT"
                title="Complete Your Profile"
                description="Share your professional details so devotees can know more about you."
            />

            <div className="rounded-2xl border border-[#ead8c7] bg-[#fff8f0] p-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-[#705647]">
                        Profile completion
                    </span>
                    <span className="font-bold text-[#8b472e]">0%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eadfd4]">
                    <div className="h-full w-0 rounded-full bg-[#8b472e]" />
                </div>
                <p className="mt-2 text-xs text-[#9a8172]">
                    Fill in the details below to build your professional profile.
                </p>
            </div>

            {/* Personal */}
            <section className="rounded-2xl border border-[#e8ddce] bg-white p-5 sm:p-6">
                <h2 className="text-lg font-bold text-[#573323]">
                    01. Personal Information
                </h2>

                <div className="mt-5 flex flex-wrap items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f5e9df] text-[#8b472e]">
                        <Camera size={28} />
                    </div>
                    <div>
                        <label className="cursor-pointer rounded-xl border border-[#e8ddce] px-4 py-2 text-sm font-semibold text-[#8b472e]">
                            Upload Photo
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => setPhotoName(e.target.files?.[0]?.name || "")}
                            />
                        </label>
                        <p className="mt-2 text-xs text-gray-400">
                            {photoName || "JPG or PNG image"}
                        </p>
                    </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className={labelClass}>
                        Full Name *
                        <input required name="fullName" value={form.fullName} onChange={update} className={inputClass} placeholder="Enter your full name" />
                    </label>

                    <label className={labelClass}>
                        Date of Birth
                        <input type="date" name="dob" value={form.dob} onChange={update} className={inputClass} />
                    </label>

                    <label className={labelClass}>
                        Gender
                        <select name="gender" value={form.gender} onChange={update} className={inputClass}>
                            <option value="">Select gender</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    </label>

                    <label className={labelClass}>
                        Mobile Number *
                        <input required name="mobile" value={form.mobile} onChange={update} className={inputClass} placeholder="Mobile number" />
                    </label>


                    <label className={labelClass}>
                        PIN Code
                        <input name="pincode" value={form.pincode} onChange={update} className={inputClass} placeholder="PIN code" />
                    </label>

                    <label className={`${labelClass} sm:col-span-2`}>
                        Full Address
                        <textarea name="address" value={form.address} onChange={update} rows={2} className={inputClass} placeholder="House number, street, area..." />
                    </label>

                    <label className={labelClass}>
                        City
                        <input name="city" value={form.city} onChange={update} className={inputClass} placeholder="City" />
                    </label>

                    <label className={labelClass}>
                        State
                        <input name="state" value={form.state} onChange={update} className={inputClass} placeholder="State" />
                    </label>
                </div>
            </section>

            {/* Religious */}
            <section className="rounded-2xl border border-[#e8ddce] bg-white p-5 sm:p-6">
                <h2 className="text-lg font-bold text-[#573323]">
                    02. Religious Information
                </h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className={labelClass}>
                        Gotra
                        <input name="gotra" value={form.gotra} onChange={update} className={inputClass} placeholder="Enter your Gotra" />
                    </label>

                    <label className={labelClass}>
                        Sampradaya
                        <input name="sampradaya" value={form.sampradaya} onChange={update} className={inputClass} placeholder="Enter Sampradaya" />
                    </label>

                    <label className={`${labelClass} sm:col-span-2`}>
                        Languages Known
                        <input name="languages" value={form.languages} onChange={update} className={inputClass} placeholder="Hindi, Sanskrit, English..." />
                    </label>
                </div>
            </section>

            {/* Professional */}
            <section className="rounded-2xl border border-[#e8ddce] bg-white p-5 sm:p-6">
                <h2 className="text-lg font-bold text-[#573323]">
                    03. Professional Information
                </h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className={labelClass}>
                        Experience (Years)
                        <input type="number" min="0" name="experience" value={form.experience} onChange={update} className={inputClass} placeholder="e.g. 5" />
                    </label>

                    <label className={labelClass}>
                        Qualification
                        <input name="qualification" value={form.qualification} onChange={update} className={inputClass} placeholder="Religious education / degree" />
                    </label>

                    <label className={`${labelClass} sm:col-span-2`}>
                        Specialization
                        <input name="specialization" value={form.specialization} onChange={update} className={inputClass} placeholder="Vedic rituals, astrology, weddings..." />
                    </label>

                    <label className={`${labelClass} sm:col-span-2`}>
                        About Yourself
                        <textarea name="about" value={form.about} onChange={update} rows={4} className={inputClass} placeholder="Introduce yourself and describe your experience..." />
                    </label>
                </div>
            </section>

            <div className="flex flex-col justify-end gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={() => setForm({
                        fullName: "",
                        dob: "",
                        gender: "",
                        mobile: "",
                        address: "",
                        city: "",
                        state: "",
                        pincode: "",
                        gotra: "",
                        sampradaya: "",
                        languages: "",
                        experience: "",
                        qualification: "",
                        specialization: "",
                        about: "",
                    })}
                    className="rounded-xl border border-[#e8ddce] bg-white px-5 py-3 text-sm font-semibold text-[#705647]"
                >
                    Reset
                </button>

                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8b472e] px-6 py-3 text-sm font-semibold text-white hover:bg-[#713923] disabled:opacity-60"
                >
                    <Save size={17} />
                    {saving ? "Saving..." : "Save Profile"}
                </button>
            </div>
        </form>
    );
}


// --------------------------------------------------
// SERVICES
// --------------------------------------------------

export function PanditServicesScreen() {
    const [services, setServices] = useState(SAMPLE_SERVICES);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        name: "",
        category: "",
        price: "",
        duration: "",
        mode: "Offline",
    });

    const update = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const resetForm = () => {
        setForm({
            name: "",
            category: "",
            price: "",
            duration: "",
            mode: "Offline",
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId) {
            setServices((prev) =>
                prev.map((service) =>
                    service.id === editingId
                        ? { ...service, ...form, price: Number(form.price) }
                        : service
                )
            );
        } else {
            setServices((prev) => [
                ...prev,
                {
                    ...form,
                    id: Date.now(),
                    price: Number(form.price),
                    status: "Active",
                },
            ]);
        }

        resetForm();
    };

    const handleEdit = (service) => {
        setEditingId(service.id);
        setForm({
            name: service.name,
            category: service.category,
            price: String(service.price),
            duration: service.duration,
            mode: service.mode,
        });
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this service?")) {
            setServices((prev) => prev.filter((item) => item.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <PageHeading
                eyebrow="PANDIT / BUSINESS"
                title="My Puja Services"
                description="Add your puja services and set your own pricing."
                action={
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#8b472e] px-4 py-3 text-sm font-semibold text-white"
                    >
                        <Plus size={17} /> Add Service
                    </button>
                }
            />

            {showForm && (
                <form onSubmit={handleSubmit} className="rounded-2xl border border-[#e8ddce] bg-white p-5">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-[#573323]">
                            {editingId ? "Edit Service" : "Add New Service"}
                        </h2>
                        <button type="button" onClick={resetForm}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <label className="text-sm font-semibold text-[#705647]">
                            Puja Name *
                            <input required name="name" value={form.name} onChange={update} className="mt-2 w-full rounded-xl border border-[#e8ddce] px-4 py-3 text-sm font-normal" placeholder="e.g. Ganesh Puja" />
                        </label>

                        <label className="text-sm font-semibold text-[#705647]">
                            Category *
                            <select required name="category" value={form.category} onChange={update} className="mt-2 w-full rounded-xl border border-[#e8ddce] bg-white px-4 py-3 text-sm font-normal">
                                <option value="">Select category</option>
                                <option>Griha Puja</option>
                                <option>Wedding Rituals</option>
                                <option>Katha</option>
                                <option>Havan</option>
                                <option>Sanskar</option>
                                <option>Other</option>
                            </select>
                        </label>

                        <label className="text-sm font-semibold text-[#705647]">
                            Price (₹) *
                            <input required type="number" min="1" name="price" value={form.price} onChange={update} className="mt-2 w-full rounded-xl border border-[#e8ddce] px-4 py-3 text-sm font-normal" placeholder="Enter price" />
                        </label>

                        <label className="text-sm font-semibold text-[#705647]">
                            Duration
                            <input name="duration" value={form.duration} onChange={update} className="mt-2 w-full rounded-xl border border-[#e8ddce] px-4 py-3 text-sm font-normal" placeholder="e.g. 2 Hours" />
                        </label>

                        <label className="text-sm font-semibold text-[#705647] sm:col-span-2">
                            Service Mode
                            <select name="mode" value={form.mode} onChange={update} className="mt-2 w-full rounded-xl border border-[#e8ddce] bg-white px-4 py-3 text-sm font-normal">
                                <option>Offline</option>
                                <option>Online</option>
                                <option>Both</option>
                            </select>
                        </label>
                    </div>

                    <div className="mt-5 flex justify-end gap-3">
                        <button type="button" onClick={resetForm} className="rounded-xl border border-[#e8ddce] px-5 py-3 text-sm font-semibold text-[#705647]">
                            Cancel
                        </button>
                        <button type="submit" className="rounded-xl bg-[#8b472e] px-5 py-3 text-sm font-semibold text-white">
                            {editingId ? "Update Service" : "Save Service"}
                        </button>
                    </div>
                </form>
            )}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {services.map((service) => (
                    <div key={service.id} className="rounded-2xl border border-[#e8ddce] bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="rounded-xl bg-[#fff3e7] p-3 text-[#8b472e]">
                                <Flower2 size={23} />
                            </div>
                            <StatusBadge status={service.status} />
                        </div>

                        <h3 className="mt-4 font-bold text-[#573323]">
                            {service.name}
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                            {service.category}
                        </p>

                        <div className="mt-4 flex items-center justify-between border-t border-[#f1e9e1] pt-4">
                            <div>
                                <p className="text-xs text-gray-400">Your Price</p>
                                <p className="mt-1 text-xl font-bold text-[#8b472e]">
                                    {money(service.price)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400">Duration</p>
                                <p className="mt-1 text-sm font-semibold text-[#573323]">
                                    {service.duration}
                                </p>
                            </div>
                        </div>

                        <p className="mt-3 text-xs text-gray-500">
                            Mode: {service.mode}
                        </p>

                        <div className="mt-4 flex gap-2">
                            <button onClick={() => handleEdit(service)} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#e8ddce] py-2 text-xs font-semibold text-[#705647]">
                                <Edit3 size={14} /> Edit
                            </button>
                            <button onClick={() => handleDelete(service.id)} className="flex items-center justify-center rounded-lg bg-red-50 px-3 py-2 text-red-600">
                                <Trash2 size={15} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {services.length === 0 && (
                <div className="rounded-2xl border border-dashed border-[#d9c7b7] bg-white py-14 text-center">
                    <Flower2 className="mx-auto text-[#b69a84]" size={38} />
                    <p className="mt-3 font-semibold text-[#573323]">No services added yet</p>
                    <p className="mt-1 text-sm text-gray-500">Add your first puja service.</p>
                </div>
            )}
        </div>
    );
}


// --------------------------------------------------
// BOOKINGS
// --------------------------------------------------

const FILTERS = [
    "All",
    "Pending",
    "Confirmed",
    "Completed",
    "Rejected",
];


const getDisplayStatus = (status) => {
    const normalized = String(status || "").toLowerCase();
    const statusMap = {
        pending: "Pending",
        accepted: "Confirmed",
        rejected: "Rejected",
        completed: "Completed",
        cancelled: "Cancelled",
    };

    return statusMap[normalized] || normalized;
};

const formatDate = (value) => {
    if (!value) return "-";

    const [year, month, day] = String(value).slice(0, 10).split("-");

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
    if (!value) return "-";

    const [hours, minutes] = String(value).split(":");
    const date = new Date();

    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};


export function PanditBookingsScreen() {
    const [bookings, setBookings] = useState([]);
    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getPanditBookings();

            const list = Array.isArray(response?.data)
                ? response.data
                : [];

            setBookings(list);
        } catch (err) {
            console.error("Fetch pandit bookings error:", err);
            setError(
                err?.message || "Unable to load bookings."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const updateStatus = async (id, status) => {
        try {
            setUpdatingId(id);
            setError("");

            await updatePanditBookingStatus(id, status);

            // Refresh from database after successful update
            await fetchBookings();
        } catch (err) {
            console.error("Update booking status error:", err);
            setError(
                err?.message || "Unable to update booking status."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const filtered = bookings.filter((booking) => {
        if (filter === "All") return true;

        return getDisplayStatus(booking.status) === filter;
    });

    const pendingCount = bookings.filter(
        (booking) => booking.status === "pending"
    ).length;

    const confirmedCount = bookings.filter(
        (booking) => booking.status === "accepted"
    ).length;

    const completedCount = bookings.filter(
        (booking) => booking.status === "completed"
    ).length;

    return (
        <div className="space-y-6">

            <PageHeading
                eyebrow="PANDIT / BUSINESS"
                title="My Bookings"
                description="View booking requests and manage your puja appointments."
            />

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                <StatCard
                    title="Total"
                    value={bookings.length}
                    icon={CalendarDays}
                    color="blue"
                />

                <StatCard
                    title="Pending"
                    value={pendingCount}
                    icon={Clock3}
                    color="orange"
                />

                <StatCard
                    title="Confirmed"
                    value={confirmedCount}
                    icon={CheckCircle2}
                    color="green"
                />

                <StatCard
                    title="Completed"
                    value={completedCount}
                    icon={Star}
                    color="purple"
                />
            </div>

            {/* Filters and Refresh */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                    {FILTERS.map((status) => (
                        <button
                            key={status}
                            type="button"
                            onClick={() => setFilter(status)}
                            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                                filter === status
                                    ? "border-[#8b472e] bg-[#8b472e] text-white"
                                    : "border-[#e8ddce] bg-white text-[#705647] hover:bg-[#fff8f2]"
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={fetchBookings}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#e8ddce] bg-white px-4 py-2 text-sm font-semibold text-[#705647] disabled:opacity-50"
                >
                    <RefreshCw
                        size={15}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Booking Requests */}
            <div className="overflow-hidden rounded-2xl border border-[#e8ddce] bg-white">
                <div className="border-b border-[#eee4da] px-5 py-4">
                    <h2 className="font-bold text-[#573323]">
                        Booking Requests
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                        Manage bookings received from devotees.
                    </p>
                </div>

                {/* Loading */}
                {loading ? (
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
                ) : filtered.length === 0 ? (
                    <div className="px-5 py-14 text-center">
                        <CalendarDays
                            size={36}
                            className="mx-auto text-[#bd947d]"
                        />

                        <h3 className="mt-3 font-semibold text-[#573323]">
                            No Bookings Found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            {filter === "All"
                                ? "New devotee bookings will appear here."
                                : `No ${filter.toLowerCase()} bookings found.`}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-[#f1e9e1]">
                        {filtered.map((booking) => {
                            const status = getDisplayStatus(
                                booking.status
                            );

                            const isUpdating =
                                updatingId === booking.id;

                            return (
                                <div
                                    key={booking.id}
                                    className="flex flex-col justify-between gap-5 p-5 lg:flex-row lg:items-center"
                                >
                                    {/* Booking Information */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-medium text-[#a66a48]">
                                                {booking.booking_number}
                                            </span>

                                            <StatusBadge status={status} />
                                        </div>

                                        <h3 className="mt-2 text-base font-bold text-[#573323]">
                                            {booking.service_name || "Puja Service"}
                                        </h3>

                                        <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                                            <UserRound size={15} />
                                            {booking.devotee_name || "Devotee"}
                                        </p>

                                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
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

                                        {booking.devotee_mobile && (
                                            <p className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                                                <Phone size={14} />
                                                {booking.devotee_mobile}
                                            </p>
                                        )}

                                        {booking.address && (
                                            <p className="mt-1 text-xs text-gray-500">
                                                Address: {booking.address}
                                            </p>
                                        )}

                                        {booking.special_instructions && (
                                            <p className="mt-2 text-xs text-gray-500">
                                                Instructions: {booking.special_instructions}
                                            </p>
                                        )}

                                        <p className="mt-2 text-xs text-gray-500">
                                            Payment:{" "}
                                            <span className="font-medium capitalize">
                                                {booking.payment_status || "pending"}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Price and Actions */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 lg:justify-end">
                                        <p className="font-bold text-[#573323]">
                                            {money(booking.service_price)}
                                        </p>

                                        {status === "Pending" && (
                                            <>
                                                <button
                                                    type="button"
                                                    disabled={isUpdating}
                                                    onClick={() =>
                                                        updateStatus(
                                                            booking.id,
                                                            "accepted"
                                                        )
                                                    }
                                                    className="rounded-lg bg-green-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                                                >
                                                    {isUpdating
                                                        ? "Updating..."
                                                        : "Accept"}
                                                </button>

                                                <button
                                                    type="button"
                                                    disabled={isUpdating}
                                                    onClick={() =>
                                                        updateStatus(
                                                            booking.id,
                                                            "rejected"
                                                        )
                                                    }
                                                    className="rounded-lg bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                                                >
                                                    Decline
                                                </button>
                                            </>
                                        )}

                                        {status === "Confirmed" && (
                                            <button
                                                type="button"
                                                disabled={isUpdating}
                                                onClick={() =>
                                                    updateStatus(
                                                        booking.id,
                                                        "completed"
                                                    )
                                                }
                                                className="rounded-lg bg-[#8b472e] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#713c32] disabled:opacity-50"
                                            >
                                                {isUpdating
                                                    ? "Updating..."
                                                    : "Mark Completed"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}



// --------------------------------------------------
// EARNINGS
// --------------------------------------------------

export function PanditEarningsScreen() {
    const [period, setPeriod] = useState("This Month");

    const transactions = [
        {
            id: "TXN-1001",
            puja: "Ganesh Puja",
            customer: "Amit Sharma",
            date: "25 Nov 2026",
            amount: 2100,
            status: "Completed",
        },
        {
            id: "TXN-1002",
            puja: "Satyanarayan Katha",
            customer: "Neha Gupta",
            date: "24 Nov 2026",
            amount: 3100,
            status: "Completed",
        },
        {
            id: "TXN-1003",
            puja: "Griha Pravesh Puja",
            customer: "Rahul Verma",
            date: "22 Nov 2026",
            amount: 5100,
            status: "Completed",
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeading
                eyebrow="PANDIT / BUSINESS"
                title="Earnings & Payments"
                description="Track your puja income and payment history."
                action={
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="rounded-xl border border-[#e8ddce] bg-white px-4 py-3 text-sm font-semibold text-[#705647] outline-none"
                    >
                        <option>This Month</option>
                        <option>Last Month</option>
                        <option>This Year</option>
                    </select>
                }
            />

            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
                <StatCard title="Total Earnings" value="₹24,500" icon={Wallet} color="green" caption={period} />
                <StatCard title="Pending Payout" value="₹3,500" icon={Clock3} color="orange" />
                <StatCard title="Completed Payments" value="₹21,000" icon={TrendingUp} color="blue" />
            </div>

            <section className="rounded-2xl border border-[#e8ddce] bg-white p-5">
                <h2 className="font-bold text-[#573323]">Earnings Overview</h2>

                <div className="mt-6 flex h-44 items-end justify-between gap-3 border-b border-l border-[#eee4da] px-3 pb-2">
                    {[35, 55, 42, 75, 60, 90, 70].map((height, index) => (
                        <div key={index} className="flex h-full flex-1 flex-col justify-end">
                            <div
                                className="w-full rounded-t-lg bg-[#c98d69]"
                                style={{ height: `${height}%` }}
                            />
                            <span className="mt-2 text-center text-[10px] text-gray-400">
                                {["M", "T", "W", "T", "F", "S", "S"][index]}
                            </span>
                        </div>
                    ))}
                </div>

                <p className="mt-3 text-xs text-gray-400">
                    Illustrative earnings chart. Connect real payment data for actual figures.
                </p>
            </section>

            <section className="overflow-hidden rounded-2xl border border-[#e8ddce] bg-white">
                <div className="border-b border-[#eee4da] px-5 py-4">
                    <h2 className="font-bold text-[#573323]">Recent Transactions</h2>
                </div>

                <div className="divide-y divide-[#f1e9e1]">
                    {transactions.map((item) => (
                        <div key={item.id} className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center">
                            <div>
                                <p className="text-xs text-gray-400">{item.id} · {item.date}</p>
                                <h3 className="mt-1 font-semibold text-[#573323]">{item.puja}</h3>
                                <p className="mt-1 text-xs text-gray-500">{item.customer}</p>
                            </div>
                            <div className="flex items-center justify-between gap-4 sm:justify-end">
                                <StatusBadge status={item.status} />
                                <p className="font-bold text-green-700">+{money(item.amount)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
