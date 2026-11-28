
"use client";

import { useCallback, useEffect, useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Loader2,
    Search,
    Clock3,
    IndianRupee,
    MapPin,
    RefreshCw,
    Power,
    BriefcaseBusiness,
} from "lucide-react";
import { addPanditService, getPanditServices, updatePanditService, updatePanditServiceStatus } from "@/services/panditService";


const INITIAL_FORM = {
    service_name: "",
    category: "",
    description: "",
    price: "",
    duration_minutes: "",
    service_type: "at_home",
    location: "",
};

const INPUT_CLASS = "mt-2 w-full rounded-xl border border-[#e8ddce] bg-white px-4 py-3 text-sm text-[#573323] outline-none transition focus:border-[#a66a48] focus:ring-2 focus:ring-[#a66a48]/10";

const LABEL_CLASS = "text-sm font-semibold text-[#705647]";

function formatPrice(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
}


export default function PanditServicesScreen() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [statusId, setStatusId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(INITIAL_FORM);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [error, setError] = useState("");

    
    const fetchServices = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getPanditServices();

            if (response?.success) {
                setServices(Array.isArray(response.data) ? response.data : []);
            } else {
                setError(response?.message || "Unable to load services.");
            }
        } catch (err) {
            console.error("Fetch services:", err);
            setError(
                err?.message || "Something went wrong while loading services."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const openAddForm = () => {
        setEditingId(null);
        setForm(INITIAL_FORM);
        setError("");
        setShowForm(true);
    };

    const openEditForm = (service) => {
        setEditingId(service.id);

        setForm({
            service_name: service.service_name || "",
            category: service.category || "",
            description: service.description || "",
            price: service.price ?? "",
            duration_minutes: service.duration_minutes ?? "",
            service_type: service.service_type || "at_home",
            location: service.location || "",
        });

        setError("");
        setShowForm(true);
    };

    const closeForm = () => {
        if (saving) return;

        setShowForm(false);
        setEditingId(null);
        setForm(INITIAL_FORM);
        setError("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.service_name.trim() || !form.category.trim()) {
            setError("Service name and category are required.");
            return;
        }

        if (
            form.price === "" ||
            !Number.isFinite(Number(form.price)) ||
            Number(form.price) < 0
        ) {
            setError("Please enter a valid price.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const payload = {
                ...form,
                service_name: form.service_name.trim(),
                category: form.category.trim(),
                price: Number(form.price),
                duration_minutes: form.duration_minutes
                    ? Number(form.duration_minutes)
                    : null,
            };

            const response = editingId
                ? await updatePanditService(editingId, payload)
                : await addPanditService(payload);

            if (!response?.success) {
                setError(response?.message || "Unable to save service.");
                return;
            }

            alert(
                editingId
                    ? "Service updated successfully!"
                    : "Service added successfully!"
            );

            setShowForm(false);
            setEditingId(null);
            setForm(INITIAL_FORM);

            await fetchServices();
        } catch (err) {
            console.error("Save service:", err);
            setError(err?.message || "Unable to save service.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (service) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${service.service_name}"?`
        );

        if (!confirmed) return;

        try {
            setDeletingId(service.id);

            const response = await deletePanditService(service.id);

            if (!response?.success) {
                alert(response?.message || "Unable to delete service.");
                return;
            }

            setServices((previous) =>
                previous.filter((item) => item.id !== service.id)
            );
        } catch (err) {
            console.error("Delete service:", err);
            alert(err?.message || "Unable to delete service.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleStatus = async (service) => {
        const nextStatus =
            service.status === "active" ? "inactive" : "active";

        try {
            setStatusId(service.id);

            const response = await updatePanditServiceStatus(
                service.id,
                nextStatus
            );

            if (!response?.success) {
                alert(response?.message || "Unable to update status.");
                return;
            }

            setServices((previous) =>
                previous.map((item) =>
                    item.id === service.id
                        ? { ...item, status: nextStatus }
                        : item
                )
            );
        } catch (err) {
            console.error("Update service status:", err);
            alert(err?.message || "Unable to update status.");
        } finally {
            setStatusId(null);
        }
    };

    const filteredServices = services.filter((service) => {
        const matchesSearch =
            service.service_name
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
            service.category?.toLowerCase().includes(search.toLowerCase());

        const matchesFilter =
            filter === "all" || service.status === filter;

        return matchesSearch && matchesFilter;
    });

    const activeCount = services.filter(
        (item) => item.status === "active"
    ).length;

    const inactiveCount = services.length - activeCount;

    const serviceTypeLabel = (type) => {
        const labels = {
            at_home: "At Home",
            online: "Online",
            both: "At Home & Online",
        };

        return labels[type] || type;
    };

    return (
        <div className="space-y-6">
            {/* Heading */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a66a48]">
                        PANDIT / MANAGEMENT
                    </p>

                    <h1 className="mt-2 text-2xl font-bold text-[#573323] sm:text-3xl">
                        My Services
                    </h1>

                    <p className="mt-1 text-sm text-[#947969]">
                        Manage your pujas and religious services.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openAddForm}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8b472e] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#713923]"
                >
                    <Plus size={18} />
                    Add New Service
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#eadfd4] bg-white p-5">
                    <p className="text-sm text-[#947969]">Total Services</p>
                    <p className="mt-2 text-3xl font-bold text-[#573323]">
                        {services.length}
                    </p>
                </div>

                <div className="rounded-2xl border border-[#eadfd4] bg-white p-5">
                    <p className="text-sm text-[#947969]">Active Services</p>
                    <p className="mt-2 text-3xl font-bold text-green-700">
                        {activeCount}
                    </p>
                </div>

                <div className="rounded-2xl border border-[#eadfd4] bg-white p-5">
                    <p className="text-sm text-[#947969]">Inactive Services</p>
                    <p className="mt-2 text-3xl font-bold text-gray-500">
                        {inactiveCount}
                    </p>
                </div>
            </div>

            {/* Search and filter */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a58b7b]"
                    />

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search services..."
                        className="w-full rounded-xl border border-[#e8ddce] bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#a66a48]"
                    />
                </div>

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="rounded-xl border border-[#e8ddce] bg-white px-4 py-3 text-sm text-[#705647] outline-none focus:border-[#a66a48]"
                >
                    <option value="all">All Services</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>

                <button
                    type="button"
                    onClick={fetchServices}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e8ddce] bg-white px-4 py-3 text-sm font-semibold text-[#705647] hover:bg-[#fff8f0]"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* Error */}
            {error && !showForm && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                    <button
                        onClick={fetchServices}
                        className="ml-2 font-bold underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="flex min-h-48 items-center justify-center rounded-2xl border border-[#eadfd4] bg-white">
                    <Loader2 className="animate-spin text-[#8b472e]" size={28} />
                    <span className="ml-3 text-sm text-[#947969]">
                        Loading services...
                    </span>
                </div>
            ) : filteredServices.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#ddcabb] bg-white px-5 py-14 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff2e8] text-[#8b472e]">
                        <BriefcaseBusiness size={26} />
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-[#573323]">
                        {services.length === 0
                            ? "No services added yet"
                            : "No matching services found"}
                    </h3>

                    <p className="mt-2 text-sm text-[#947969]">
                        {services.length === 0
                            ? "Add your first puja or religious service."
                            : "Try changing your search or filter."}
                    </p>

                    {services.length === 0 && (
                        <button
                            onClick={openAddForm}
                            className="mt-5 rounded-xl bg-[#8b472e] px-5 py-3 text-sm font-semibold text-white hover:bg-[#713923]"
                        >
                            Add Your First Service
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {filteredServices.map((service) => (
                        <div
                            key={service.id}
                            className="rounded-2xl border border-[#eadfd4] bg-white p-5 shadow-[0_3px_14px_rgba(76,48,30,0.04)]"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <span className="inline-flex rounded-full bg-[#fff2e8] px-3 py-1 text-xs font-semibold text-[#8b472e]">
                                        {service.category}
                                    </span>

                                    <h3 className="mt-3 text-lg font-bold text-[#573323]">
                                        {service.service_name}
                                    </h3>
                                </div>

                                <span
                                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${service.status === "active"
                                            ? "bg-green-50 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {service.status}
                                </span>
                            </div>

                            <p className="mt-3 line-clamp-2 min-h-10 text-sm text-[#947969]">
                                {service.description || "No description added."}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-[#705647]">
                                <span className="inline-flex items-center gap-1">
                                    <IndianRupee size={15} />
                                    <strong>{formatPrice(service.price)}</strong>
                                </span>

                                {service.duration_minutes && (
                                    <span className="inline-flex items-center gap-1">
                                        <Clock3 size={15} />
                                        {service.duration_minutes} min
                                    </span>
                                )}

                                <span>{serviceTypeLabel(service.service_type)}</span>

                                {service.location && (
                                    <span className="inline-flex items-center gap-1">
                                        <MapPin size={15} />
                                        {service.location}
                                    </span>
                                )}
                            </div>

                            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#f0e7df] pt-4">
                                <button
                                    type="button"
                                    onClick={() => handleStatus(service)}
                                    disabled={statusId === service.id}
                                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#705647] hover:text-[#8b472e] disabled:opacity-50"
                                >
                                    {statusId === service.id ? (
                                        <Loader2 size={15} className="animate-spin" />
                                    ) : (
                                        <Power size={15} />
                                    )}
                                    {service.status === "active"
                                        ? "Deactivate"
                                        : "Activate"}
                                </button>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => openEditForm(service)}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#e8ddce] px-3 py-2 text-xs font-semibold text-[#705647] hover:bg-[#fff8f0]"
                                    >
                                        <Pencil size={14} />
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(service)}
                                        disabled={deletingId === service.id}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                                    >
                                        {deletingId === service.id ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={14} />
                                        )}
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5">
                    <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-[#fffdfb] shadow-2xl">
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eadfd4] bg-[#fffdfb] px-5 py-4 sm:px-6">
                            <div>
                                <h2 className="text-xl font-bold text-[#573323]">
                                    {editingId ? "Update Service" : "Add New Service"}
                                </h2>
                                <p className="mt-1 text-xs text-[#947969]">
                                    Enter your service details below.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeForm}
                                disabled={saving}
                                className="rounded-full p-2 text-[#705647] hover:bg-[#f5e9df]"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
                            {error && (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className={LABEL_CLASS}>
                                    Service Name *
                                    <input
                                        required
                                        name="service_name"
                                        value={form.service_name}
                                        onChange={handleChange}
                                        className={INPUT_CLASS}
                                        placeholder="e.g. Satyanarayan Katha"
                                    />
                                </label>

                                <label className={LABEL_CLASS}>
                                    Category *
                                    <select
                                        required
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        className={INPUT_CLASS}
                                    >
                                        <option value="">Select category</option>
                                        <option value="Puja">Puja</option>
                                        <option value="Havan">Havan</option>
                                        <option value="Katha">Katha</option>
                                        <option value="Wedding">Wedding</option>
                                        <option value="Griha Pravesh">Griha Pravesh</option>
                                        <option value="Astrology">Astrology</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </label>

                                <label className={LABEL_CLASS}>
                                    Price (₹) *
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        name="price"
                                        value={form.price}
                                        onChange={handleChange}
                                        className={INPUT_CLASS}
                                        placeholder="e.g. 2100"
                                    />
                                </label>

                                <label className={LABEL_CLASS}>
                                    Duration (Minutes)
                                    <input
                                        type="number"
                                        min="1"
                                        name="duration_minutes"
                                        value={form.duration_minutes}
                                        onChange={handleChange}
                                        className={INPUT_CLASS}
                                        placeholder="e.g. 120"
                                    />
                                </label>

                                <label className={LABEL_CLASS}>
                                    Service Type *
                                    <select
                                        name="service_type"
                                        value={form.service_type}
                                        onChange={handleChange}
                                        className={INPUT_CLASS}
                                    >
                                        <option value="at_home">At Home</option>
                                        <option value="online">Online</option>
                                        <option value="both">Both</option>
                                    </select>
                                </label>

                                <label className={LABEL_CLASS}>
                                    City / Location
                                    <input
                                        name="location"
                                        value={form.location}
                                        onChange={handleChange}
                                        className={INPUT_CLASS}
                                        placeholder="e.g. Jaipur"
                                    />
                                </label>

                                <label className={`${LABEL_CLASS} sm:col-span-2`}>
                                    Description
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className={INPUT_CLASS}
                                        placeholder="Describe your puja or service..."
                                    />
                                </label>
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-[#eadfd4] pt-5 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    disabled={saving}
                                    className="rounded-xl border border-[#e8ddce] bg-white px-5 py-3 text-sm font-semibold text-[#705647] hover:bg-[#fff8f0]"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8b472e] px-6 py-3 text-sm font-semibold text-white hover:bg-[#713923] disabled:opacity-60"
                                >
                                    {saving && (
                                        <Loader2 size={17} className="animate-spin" />
                                    )}
                                    {saving
                                        ? "Saving..."
                                        : editingId
                                            ? "Update Service"
                                            : "Save Service"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
