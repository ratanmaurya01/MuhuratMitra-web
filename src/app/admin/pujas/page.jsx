
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Flower2,
  Clock3,
  IndianRupee,
  Eye,
  X,
  Loader2,
  Layers,
  Sparkles,
  Plus,
} from "lucide-react";

import { getAllPujas } from "@/services/adminService";

function getPujaArray(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data?.pujas)) return response.data.pujas;
  if (Array.isArray(response?.pujas)) return response.pujas;

  return [];
}

function formatPrice(price) {
  if (price === null || price === undefined || price === "") {
    return "Price not available";
  }

  return `₹${Number(price).toLocaleString("en-IN")}`;
}

function formatDuration(duration) {
  if (!duration) return "—";
  return `${duration} min`;
}

function getCategories(pujas) {
  return [
    "All",
    ...new Set(
      pujas
        .map((puja) => puja.category)
        .filter(Boolean)
    ),
  ];
}

export default function AdminPujasPage() {
  const [pujas, setPujas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPuja, setSelectedPuja] = useState(null);
  const [error, setError] = useState("");


  const initialForm = {
    name: "",
    nameHindi: "",
    slug: "",
    description: "",
    durationMin: "",
    price: "",
    category: "",
    deity: "",
    image: "",
    samagri: "",
    vidhi: "",
  };

  const [form, setForm] = useState(initialForm);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPuja, setEditingPuja] = useState(null);
  const [saving, setSaving] = useState(false);


  const fetchPujas = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllPujas();
      setPujas(getPujaArray(response));
    } catch (err) {
      console.error("Fetch Pujas Error:", err);
      setError(err?.message || "Unable to load pujas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPujas();
  }, [fetchPujas]);

  const categories = useMemo(
    () => getCategories(pujas),
    [pujas]
  );

  const filteredPujas = useMemo(() => {
    const query = search.trim().toLowerCase();

    return pujas.filter((puja) => {
      const matchesCategory =
        activeCategory === "All" ||
        puja.category === activeCategory;

      const matchesSearch =
        !query ||
        String(puja.name || "").toLowerCase().includes(query) ||
        String(puja.nameHindi || "").toLowerCase().includes(query) ||
        String(puja.category || "").toLowerCase().includes(query) ||
        String(puja.deity || "").toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [pujas, search, activeCategory]);

  const totalCategories = categories.length - 1;




  const handleAddPuja = () => {
    setEditingPuja(null);
    setForm(initialForm);
    setFormOpen(true);
  };

  const handleEditPuja = (puja) => {
    setEditingPuja(puja);

    setForm({
      name: puja.name || "",
      nameHindi: puja.nameHindi || "",
      slug: puja.slug || "",
      description: puja.description || "",
      durationMin: puja.durationMin ?? "",
      price: puja.price ?? "",
      category: puja.category || "",
      deity: puja.deity || "",
      image: puja.image || "",
      samagri: Array.isArray(puja.samagri)
        ? puja.samagri.join(", ")
        : puja.samagri || "",
      vidhi: puja.vidhi || "",
    });

    setFormOpen(true);
  };



  const handleSavePuja = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Puja name is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        durationMin: form.durationMin
          ? Number(form.durationMin)
          : null,
        price: Number(form.price) || 0,
      };

      if (editingPuja) {
        await updatePuja(editingPuja.id, payload);
      } else {
        await createPuja(payload);
      }

      setFormOpen(false);
      setEditingPuja(null);
      setForm(initialForm);

      await fetchPujas();

      alert(
        editingPuja
          ? "Puja updated successfully."
          : "Puja created successfully."
      );
    } catch (error) {
      console.error("Save Puja Error:", error);
      alert(error?.message || "Unable to save puja.");
    } finally {
      setSaving(false);
    }
  };


  const handleDeletePuja = async (puja) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${puja.name}"?`
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      await deletePuja(puja.id);

      setSelectedPuja(null);
      await fetchPujas();

      alert("Puja deleted successfully.");
    } catch (error) {
      console.error("Delete Puja Error:", error);
      alert(error?.message || "Unable to delete puja.");
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="min-w-0 space-y-6 pb-8">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-[#a66a48]">
            ADMINISTRATION / MANAGEMENT
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#573323] sm:text-3xl">
            Puja Management
          </h1>

          <p className="mt-2 text-sm text-[#9a8172]">
            Manage all pujas and their information.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={fetchPujas}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e8ddce] bg-white px-4 py-3 text-sm font-semibold text-[#705647] transition hover:bg-[#fffaf3] disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={handleAddPuja}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8b472e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#713923]"
          >
            <Plus size={17} />
            Add Puja
          </button>

        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Pujas",
            value: pujas.length,
            icon: Flower2,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
          {
            label: "Categories",
            value: totalCategories,
            icon: Layers,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            label: "Filtered Pujas",
            value: filteredPujas.length,
            icon: Sparkles,
            color: "text-green-600",
            bg: "bg-green-50",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-[#e8ddce] bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {item.label}
                </p>

                <div className={`rounded-xl p-2 ${item.bg}`}>
                  <Icon size={21} className={item.color} />
                </div>
              </div>

              <h2 className="mt-4 text-3xl font-bold text-[#573323]">
                {loading ? "—" : item.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 rounded-xl border border-[#e8ddce] bg-white px-4 py-3">
        <Search size={19} className="shrink-0 text-gray-400" />

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search puja by name, category or deity..."
          className="w-full bg-transparent text-sm text-gray-700 outline-none"
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="text-gray-400 hover:text-gray-700"
          >
            <X size={17} />
          </button>
        )}
      </div>

      {/* Category Filters */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-xl border px-4 py-2.5 text-sm font-semibold capitalize transition ${activeCategory === category
                ? "border-[#8b472e] bg-[#8b472e] text-white"
                : "border-[#e8ddce] bg-white text-[#705647] hover:bg-[#fffaf3]"
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button
            type="button"
            onClick={fetchPujas}
            className="ml-2 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Puja Listing */}
      <section>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#573323]">
              All Pujas
            </h2>
            <p className="mt-1 text-sm text-[#9a8172]">
              {filteredPujas.length} pujas available
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center rounded-2xl border border-[#e8ddce] bg-white py-20">
            <Loader2
              size={32}
              className="animate-spin text-[#8b472e]"
            />
          </div>
        ) : filteredPujas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#e8ddce] bg-white px-5 py-16 text-center">
            <Flower2
              size={42}
              className="mx-auto text-[#c7aa95]"
            />

            <h3 className="mt-4 font-semibold text-[#573323]">
              No Pujas Found
            </h3>

            <p className="mt-1 text-sm text-[#9a8172]">
              Try changing your search or category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredPujas.map((puja, index) => (
              <div
                key={puja.id || index}
                className="group overflow-hidden rounded-2xl border border-[#e8ddce] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-[#f5e9df]">
                  {puja.image ? (
                    <img
                      src={puja.image}
                      alt={puja.name || "Puja"}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Flower2
                        size={55}
                        className="text-[#c49a7d]"
                      />
                    </div>
                  )}

                  {puja.category && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold capitalize text-[#8b472e] shadow-sm">
                      {puja.category}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-[#573323]">
                        {puja.name || "Unnamed Puja"}
                      </h3>

                      {puja.nameHindi && (
                        <p className="mt-1 text-sm text-[#9a8172]">
                          {puja.nameHindi}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 rounded-xl bg-[#fff4e8] px-3 py-2 text-sm font-bold text-[#8b472e]">
                      {formatPrice(puja.price)}
                    </div>
                  </div>

                  <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-relaxed text-[#82736b]">
                    {puja.description || "No description available."}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-[#f0e8df] pt-4 text-xs text-[#95847a]">
                    <span className="flex items-center gap-1.5">
                      <Clock3 size={15} />
                      {formatDuration(puja.durationMin)}
                    </span>

                    {puja.deity && (
                      <span className="flex items-center gap-1.5">
                        <Sparkles size={15} />
                        {puja.deity}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPuja(puja)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#e8ddce] bg-[#fffaf4] px-4 py-3 text-sm font-semibold text-[#8b472e] transition hover:bg-[#8b472e] hover:text-white"
                  >
                    <Eye size={17} />
                    View Details
                  </button>


                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditPuja(puja)}
                      className="rounded-xl border border-[#e8ddce] px-3 py-2.5 text-sm font-semibold text-[#705647] hover:bg-[#fffaf3]"
                    >
                      Edit Puja
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeletePuja(puja)}
                      disabled={saving}
                      className="rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>

                </div>



              </div>
            ))}
          </div>
        )}
      </section>

      {/* Puja Details Modal */}
      {selectedPuja && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedPuja(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eee4da] bg-white px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#a66a48]">
                  Puja Information
                </p>
                <h2 className="mt-1 text-lg font-bold text-[#573323]">
                  Puja Details
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPuja(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5">
              {selectedPuja.image && (
                <img
                  src={selectedPuja.image}
                  alt={selectedPuja.name || "Puja"}
                  className="h-52 w-full rounded-xl object-cover"
                />
              )}

              <div className="mt-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-[#573323]">
                      {selectedPuja.name}
                    </h3>

                    {selectedPuja.nameHindi && (
                      <p className="mt-1 text-sm text-[#9a8172]">
                        {selectedPuja.nameHindi}
                      </p>
                    )}
                  </div>

                  <span className="rounded-xl bg-[#fff1e5] px-4 py-2 font-bold text-[#8b472e]">
                    {formatPrice(selectedPuja.price)}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-7 text-[#705f54]">
                  {selectedPuja.description || "No description available."}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Category",
                    value: selectedPuja.category || "—",
                    icon: Flower2,
                  },
                  {
                    label: "Deity",
                    value: selectedPuja.deity || "—",
                    icon: Sparkles,
                  },
                  {
                    label: "Duration",
                    value: formatDuration(selectedPuja.durationMin),
                    icon: Clock3,
                  },
                  {
                    label: "Price",
                    value: formatPrice(selectedPuja.price),
                    icon: IndianRupee,
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-xl border border-[#eee4da] bg-[#fffaf5] p-3"
                    >
                      <div className="flex items-center gap-2 text-xs text-[#9a8172]">
                        <Icon size={15} />
                        {item.label}
                      </div>

                      <p className="mt-2 break-words text-sm font-semibold capitalize text-[#573323]">
                        {item.value}
                      </p>
                    </div>
                  );
                })}
              </div>

              {selectedPuja.samagri && (
                <div className="mt-5">
                  <h4 className="font-bold text-[#573323]">
                    Samagri
                  </h4>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#705f54]">
                    {Array.isArray(selectedPuja.samagri)
                      ? selectedPuja.samagri.join(", ")
                      : selectedPuja.samagri}
                  </p>
                </div>
              )}

              {selectedPuja.vidhi && (
                <div className="mt-5">
                  <h4 className="font-bold text-[#573323]">
                    Puja Vidhi
                  </h4>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#705f54]">
                    {selectedPuja.vidhi}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {formOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          onClick={() => !saving && setFormOpen(false)}
        >
          <form
            onSubmit={handleSavePuja}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eee4da] bg-white px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#a66a48]">
                  Puja Management
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#573323]">
                  {editingPuja ? "Edit Puja" : "Add New Puja"}
                </h2>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={() => setFormOpen(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">

              {[
                { name: "name", label: "Puja Name", required: true },
                { name: "nameHindi", label: "Puja Name (Hindi)" },
                { name: "slug", label: "Slug" },
                { name: "category", label: "Category" },
                { name: "deity", label: "Deity" },
                { name: "image", label: "Image URL" },
                { name: "durationMin", label: "Duration (Minutes)", type: "number" },
                { name: "price", label: "Price (₹)", type: "number" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="mb-2 block text-sm font-semibold text-[#705647]">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500"> *</span>
                    )}
                  </label>

                  <input
                    type={field.type || "text"}
                    required={field.required}
                    min={field.type === "number" ? "0" : undefined}
                    value={form[field.name]}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        [field.name]: event.target.value,
                      }))
                    }
                    placeholder={`Enter ${field.label}`}
                    className="w-full rounded-xl border border-[#e8ddce] bg-white px-4 py-3 text-sm text-[#39251d] outline-none transition focus:border-[#8b472e] focus:ring-2 focus:ring-[#8b472e]/10"
                  />
                </div>
              ))}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#705647]">
                  Description
                </label>

                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Enter puja description"
                  className="w-full rounded-xl border border-[#e8ddce] px-4 py-3 text-sm outline-none focus:border-[#8b472e]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#705647]">
                  Samagri
                </label>

                <textarea
                  rows={3}
                  value={form.samagri}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      samagri: event.target.value,
                    }))
                  }
                  placeholder="Enter required puja samagri"
                  className="w-full rounded-xl border border-[#e8ddce] px-4 py-3 text-sm outline-none focus:border-[#8b472e]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#705647]">
                  Puja Vidhi
                </label>

                <textarea
                  rows={4}
                  value={form.vidhi}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      vidhi: event.target.value,
                    }))
                  }
                  placeholder="Enter puja procedure"
                  className="w-full rounded-xl border border-[#e8ddce] px-4 py-3 text-sm outline-none focus:border-[#8b472e]"
                />
              </div>
            </div>

            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-[#eee4da] bg-white p-5">
              <button
                type="button"
                disabled={saving}
                onClick={() => setFormOpen(false)}
                className="rounded-xl border border-[#e8ddce] px-5 py-3 text-sm font-semibold text-[#705647]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-[#8b472e] px-5 py-3 text-sm font-semibold text-white hover:bg-[#713923] disabled:opacity-50"
              >
                {saving && (
                  <Loader2 size={16} className="animate-spin" />
                )}

                {editingPuja ? "Update Puja" : "Create Puja"}
              </button>
            </div>
          </form>
        </div>
      )}





    </div>
  );
}
