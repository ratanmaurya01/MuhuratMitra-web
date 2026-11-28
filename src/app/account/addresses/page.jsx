
"use client";

import { useEffect, useState } from "react";

import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress as updateDefaultAddress,
} from "@/services/addressService";

import ConfirmModal from "@/components/common/ConfirmModal";
import AlertModal from "@/components/common/AlertModal";

import {
  Trash2,
  Pencil,
  Home,
  Briefcase,
  Plus,
  MapPin,
  X,
  Loader2,
  Star,
} from "lucide-react";

const INITIAL_FORM = {
  label: "",
  type: "home",
  address: "",
};

export default function Page() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);

  const [confirm, setConfirm] = useState({
    open: false,
    action: "",
    address: null,
  });

  const [alert, setAlert] = useState({
    open: false,
    title: "",
    message: "",
    type: "success",
  });

  const showAlert = (title, message, type = "success") => {
    setAlert({
      open: true,
      title,
      message,
      type,
    });
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);

      const response = await getAddresses();

      console.log("resoe", response);

      setAddresses(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Fetch addresses error:", err);
      showAlert(
        "Unable to Load",
        "Unable to load saved addresses. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Add Modal
  const openAddModal = () => {
    setEditingAddress(null);
    setForm(INITIAL_FORM);
    setModalOpen(true);
  };

  // Edit Modal
  const openEditModal = (address) => {
    setEditingAddress(address);

    setForm({
      label: address.label || "",
      type: address.type || "home",
      address: address.address || "",
    });

    setModalOpen(true);
  };

  // Save Address
  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.label.trim() || !form.address.trim()) {
      showAlert(
        "Missing Information",
        "Please enter address label and complete address.",
        "error"
      );
      return;
    }

    try {
      setSaving(true);

      if (editingAddress) {
        await updateAddress(editingAddress.id, form);

        setModalOpen(false);

        await fetchAddresses();

        showAlert(
          "Address Updated",
          "Your saved address has been updated successfully."
        );
      } else {
        await addAddress(form);

        setModalOpen(false);

        await fetchAddresses();

        showAlert(
          "Address Added",
          "Your new address has been saved successfully."
        );
      }
    } catch (err) {
      console.error("Save address error:", err);

      showAlert(
        "Something Went Wrong",
        "Unable to save address. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // Open Confirmation
  const openConfirmation = (action, address) => {
    setConfirm({
      open: true,
      action,
      address,
    });
  };

  // Confirm Action
  const handleConfirmAction = async () => {
    const { action, address } = confirm;

    if (!address) return;

    try {
      setSaving(true);

      if (action === "delete") {
        await deleteAddress(address.id);

        setAddresses((old) =>
          old.filter((item) => item.id !== address.id)
        );

        setConfirm({
          open: false,
          action: "",
          address: null,
        });

        showAlert(
          "Address Deleted",
          "The saved address has been deleted successfully."
        );
      }

      if (action === "default") {
        await updateDefaultAddress(address.id);

        setConfirm({
          open: false,
          action: "",
          address: null,
        });

        await fetchAddresses();

        showAlert(
          "Default Address Updated",
          "Your default booking address has been updated."
        );
      }
    } catch (err) {
      console.error("Address action error:", err);

      setConfirm({
        open: false,
        action: "",
        address: null,
      });

      showAlert(
        "Action Failed",
        "Unable to complete this action. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-7">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#39251d] sm:text-3xl">
            Saved Addresses
          </h1>

          <p className="mt-2 text-sm text-[#82736b]">
            Manage your puja and booking addresses.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="hidden items-center justify-center gap-2 rounded-full bg-[#d6531d] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#bd4818] sm:flex"
        >
          <Plus size={18} />
          Add Address
        </button>
      </div>

      {/* Address List */}
      <div className="space-y-5">

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-[#bd6439]" size={27} />
          </div>
        )}

        {!loading && addresses.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#e6ddce] bg-white p-10 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#fff0e5] text-[#bd6439]">
              <MapPin size={30} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-[#39251d]">
              No Saved Addresses
            </h3>

            <p className="mt-2 text-sm text-[#82736b]">
              Add an address for your future bookings.
            </p>

            <button
              onClick={openAddModal}
              className="mt-5 rounded-full bg-[#d6531d] px-5 py-3 text-sm font-semibold text-white"
            >
              Add Your First Address
            </button>
          </div>
        )}

        {!loading && addresses.map((address) => (
          <div
            key={address.id}
            className={`rounded-[24px] border bg-white p-5 shadow-[0_3px_12px_rgba(70,45,25,0.04)] sm:p-6 ${Boolean(address.is_default)
                ? "border-[#bd6439]"
                : "border-[#e6ddce]"
              }`}
          >
            <div className="flex items-start gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#fff0e5] text-[#bd6439]">
                {address.type === "home" ? (
                  <Home size={24} />
                ) : (
                  <Briefcase size={24} />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-[#39251d]">
                    {address.label}
                  </h3>

                  {Boolean(address.is_default) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#e0f4e8] px-3 py-1 text-xs font-medium text-[#39754d]">
                      <Star size={12} fill="currentColor" />
                      Default
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs capitalize text-[#bd6439]">
                  {address.type}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => openEditModal(address)}
                  className="rounded-lg p-2 text-[#82736b] transition hover:bg-[#fff0e5] hover:text-[#bd6439]"
                  aria-label="Edit address"
                >
                  <Pencil size={19} />
                </button>

                <button
                  onClick={() =>
                    openConfirmation("delete", address)
                  }
                  className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                  aria-label="Delete address"
                >
                  <Trash2 size={19} />
                </button>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-[#82736b]">
              {address.address}
            </p>

            {!Boolean(address.is_default) && (
              <button
                onClick={() =>
                  openConfirmation("default", address)
                }
                className="mt-5 rounded-full border border-[#e6ddce] px-5 py-2.5 text-sm font-medium text-[#bd6439] transition hover:bg-[#fff8f0]"
              >
                Set as Default
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Add Button */}
      <button
        onClick={openAddModal}
        className="fixed bottom-7 right-6 z-30 flex size-[60px] items-center justify-center rounded-2xl bg-[#d6531d] text-white shadow-xl transition hover:bg-[#bd4818] sm:hidden"
        aria-label="Add address"
      >
        <Plus size={28} />
      </button>

      {/* Add / Edit Address Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[3px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !saving) {
              setModalOpen(false);
            }
          }}
        >
          <div className="w-full max-w-md rounded-[26px] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#39251d]">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h2>

                <p className="mt-1 text-xs text-[#82736b]">
                  Save your preferred booking location.
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                disabled={saving}
                className="rounded-full bg-[#fcf5eb] p-2 text-[#715b4e]"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-4">

              <div>
                <label className="mb-2 block text-sm font-medium text-[#39251d]">
                  Address Label *
                </label>

                <input
                  required
                  value={form.label}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      label: e.target.value,
                    })
                  }
                  placeholder="e.g. Home, Office"
                  className="w-full rounded-xl border border-[#e8ddce] px-4 py-3 text-sm outline-none focus:border-[#d6531d]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#39251d]">
                  Address Type
                </label>

                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-[#e8ddce] bg-white px-4 py-3 text-sm outline-none focus:border-[#d6531d]"
                >
                  <option value="home">Home</option>
                  <option value="office">Office</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#39251d]">
                  Complete Address *
                </label>

                <textarea
                  required
                  rows={4}
                  value={form.address}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address: e.target.value,
                    })
                  }
                  placeholder="House number, street, area, city, state..."
                  className="w-full resize-none rounded-xl border border-[#e8ddce] px-4 py-3 text-sm outline-none focus:border-[#d6531d]"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#d6531d] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#bd4818] disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    {editingAddress ? "Update Address" : "Save Address"}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Common Confirmation Modal */}
      <ConfirmModal
        open={confirm.open}
        onClose={() =>
          !saving &&
          setConfirm({
            open: false,
            action: "",
            address: null,
          })
        }
        onConfirm={handleConfirmAction}
        title={
          confirm.action === "delete"
            ? "Delete Address?"
            : "Set Default Address?"
        }
        message={
          confirm.action === "delete"
            ? `Are you sure you want to delete "${confirm.address?.label}"? This action cannot be undone.`
            : `Do you want to make "${confirm.address?.label}" your default booking address?`
        }
        confirmText={
          confirm.action === "delete"
            ? "Yes, Delete"
            : "Set as Default"
        }
        cancelText="Cancel"
        variant={confirm.action === "delete" ? "danger" : "warning"}
        loading={saving}
      />

      {/* Success / Error Alert */}
      <AlertModal
        open={alert.open}
        onClose={() =>
          setAlert((old) => ({ ...old, open: false }))
        }
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
    </div>
  );
}
