

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Cake,
  Heart,
  Sparkles,
  Bell,
  Users,
  X,
  Loader2,
  CalendarDays,
  Star,
} from "lucide-react";

import {
  getFamily,
  addFamilyMember,
  deleteFamilyMember,
  toggleFamilyReminder,
} from "@/services/familyService";
import ConfirmModal from "@/components/common/ConfirmModal";

function FamilyPage() {
  const [family, setFamily] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    relation: "",
    nakshatra: "",
  });

  // Fetch family members
  const fetchFamily = async () => {
    try {
      setError("");
      const response = await getFamily();

      setFamily(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Family Fetch Error:", err);
      setError("Unable to load family members. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamily();
  }, []);

  // Open Add Member Modal
  const openAddModal = () => {
    setForm({
      name: "",
      relation: "",
      nakshatra: "",
    });
    setModalOpen(true);
  };

  // Add Family Member
  const handleAddMember = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.relation.trim()) {
      alert("Please enter name and relation.");
      return;
    }
    try {
      setSaving(true);

      await addFamilyMember({
        name: form.name.trim(),
        relation: form.relation.trim(),
        nakshatra: form.nakshatra.trim(),
      });

      setModalOpen(false);

      setForm({
        name: "",
        relation: "",
        nakshatra: "",
      });

      await fetchFamily();
    } catch (err) {
      console.error("Add Family Error:", err);
      alert("Unable to add family member.");
    } finally {
      setSaving(false);
    }
  };




  const handleDeleteMember = (member) => {
    setSelectedMember(member);
    setConfirmOpen(true);
  };

  // Delete Family Member

  const confirmDeleteMember = async () => {
    if (!selectedMember) return;

    try {
      setDeleteLoading(true);

      await deleteFamilyMember(selectedMember.id);

      setFamily((old) =>
        old.filter((member) => member.id !== selectedMember.id)
      );

      setConfirmOpen(false);
      setSelectedMember(null);
    } catch (err) {
      console.error("Delete Family Error:", err);
      alert("Unable to delete family member.");
    } finally {
      setDeleteLoading(false);
    }
  };


  // Toggle Reminder
  const handleToggleReminder = async (memberId, reminderId, enabled) => {
    try {
      // Optimistic UI update
      setFamily((old) =>
        old.map((member) =>
          member.id !== memberId
            ? member
            : {
              ...member,
              reminders: member.reminders.map((reminder) =>
                reminder.id === reminderId
                  ? { ...reminder, enabled: !enabled }
                  : reminder
              ),
            }
        )
      );

      await toggleFamilyReminder(reminderId, !enabled);
    } catch (err) {
      console.error("Toggle Reminder Error:", err);

      // Rollback if API fails
      setFamily((old) =>
        old.map((member) =>
          member.id !== memberId
            ? member
            : {
              ...member,
              reminders: member.reminders.map((reminder) =>
                reminder.id === reminderId
                  ? { ...reminder, enabled }
                  : reminder
              ),
            }
        )
      );

      alert("Unable to update reminder.");
    }
  };

  // Format MySQL date
  const formatDate = (date) => {
    if (!date) return "";

    const datePart = String(date).slice(0, 10);
    const [year, month, day] = datePart.split("-").map(Number);

    if (!year || !month || !day) return datePart;

    return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  return (

    <>

      <div className="space-y-6">

        {/* Header */}
        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#39251d] sm:text-3xl">
                My Family
              </h1>

              <p className="mt-1 text-sm text-[#82736b]">
                Track birthdays, anniversaries, Nakshatra & puja reminders.
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 rounded-full bg-[#d6531d] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#b94316]"
            >
              <Plus size={18} />
              Add Member
            </button>
          </div>
        </div>

        {/* Family Count */}
        <div className="flex items-center justify-between rounded-2xl border border-[#eee1d3] bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#fff0e3] text-[#bd6439]">
              <Users size={22} />
            </div>

            <div>
              <p className="text-sm text-[#82736b]">
                Family Members
              </p>
              <p className="text-xl font-semibold text-[#39251d]">
                {family.length}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-[#82736b]">
              Total Reminders
            </p>
            <p className="text-xl font-semibold text-[#39251d]">
              {family.reduce(
                (total, member) =>
                  total + (member.reminders?.length || 0),
                0
              )}
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-[#eee1d3] bg-white py-14 text-sm text-[#82736b]">
            <Loader2 size={20} className="animate-spin" />
            Loading family members...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <button
              onClick={fetchFamily}
              className="mt-3 text-sm font-semibold text-red-700 underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && family.length === 0 && (
          <div className="rounded-3xl border border-dashed border-[#e8d5c1] bg-white px-6 py-14 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#fff0e3] text-[#bd6439]">
              <Users size={30} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-[#39251d]">
              No Family Members Yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#82736b]">
              Add your family members to manage birthdays,
              anniversaries and puja reminders in one place.
            </p>

            <button
              onClick={openAddModal}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#d6531d] px-5 py-3 text-sm font-semibold text-white"
            >
              <Plus size={18} />
              Add Your First Member
            </button>
          </div>
        )}

        {/* Family Members */}
        {!loading && !error && family.length > 0 && (
          <div className="space-y-5">
            {family.map((member) => (
              <div
                key={member.id}
                className="rounded-[26px] border border-[#eee1d3] bg-white p-5 shadow-[0_3px_14px_rgba(76,48,30,0.04)] sm:p-6"
              >
                {/* Member Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff0e3] text-[#bd6439]">
                      <Users size={23} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-[#39251d] sm:text-xl">
                        {member.name}
                      </h3>

                      <p className="mt-1 text-sm text-[#bd6439]">
                        {member.relation}
                      </p>

                      {member.nakshatra && (
                        <p className="mt-1 text-xs text-[#82736b]">
                          <Star
                            size={12}
                            className="mr-1 inline"
                          />
                          {member.nakshatra}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteMember(member)}
                    className="rounded-xl p-2 text-[#927d70] transition hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete family member"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* Reminders */}
                <div className="mt-5 space-y-3">
                  {member.reminders?.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-center gap-3 rounded-[20px] bg-[#fcf5eb] p-3 sm:p-4"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#792a2d]">
                        {reminder.type === "birthday" ? (
                          <Cake size={23} />
                        ) : (
                          <Heart
                            size={23}
                            fill="currentColor"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#39251d]">
                          {reminder.type === "birthday"
                            ? "Birthday"
                            : "Anniversary"}
                          {" • "}
                          {formatDate(reminder.date)}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#82736b] sm:text-sm">
                          {reminder.puja ||
                            "No puja suggestion"}
                        </p>
                      </div>

                      {/* Toggle */}
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleReminder(
                            member.id,
                            reminder.id,
                            reminder.enabled
                          )
                        }
                        className={`relative h-8 w-[58px] shrink-0 rounded-full transition ${reminder.enabled
                          ? "bg-[#d6531d]"
                          : "bg-[#ded8d4]"
                          }`}
                        aria-label="Toggle reminder"
                        aria-pressed={reminder.enabled}
                      >
                        <span
                          className={`absolute top-1 size-6 rounded-full bg-white shadow transition-all ${reminder.enabled
                            ? "left-[30px]"
                            : "left-1"
                            }`}
                        />
                      </button>
                    </div>
                  ))}

                  {(!member.reminders ||
                    member.reminders.length === 0) && (
                      <div className="rounded-xl bg-[#fcf5eb] p-4 text-center text-sm text-[#82736b]">
                        No reminders added yet.
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Yearly Puja Suggestions */}
        <div className="rounded-[26px] border border-[#f1d9c5] bg-[#fff0e3] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-white text-[#bd6439]">
              <Sparkles size={23} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#39251d] sm:text-xl">
                Yearly Puja Suggestions
              </h2>
              <p className="mt-1 text-xs text-[#82736b]">
                Spiritual moments for your family
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {[
              {
                title: "Kartik Purnima",
                date: "24 Nov",
                puja: "Family Satyanarayan Katha & Deep Daan",
              },
              {
                title: "Makara Sankranti",
                date: "14 Jan",
                puja: "Surya Arghya & Til-Gud Daan",
              },
              {
                title: "Vasant Panchami",
                date: "February",
                puja: "Saraswati Puja for children's studies",
              },
              {
                title: "Shravan Somvaar",
                date: "Shravan Month",
                puja: "Rudrabhishek for parents' health & longevity",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-2xl bg-white/70 p-4"
              >
                <div className="mt-0.5 text-[#d6531d]">
                  <CalendarDays size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-[#39251d]">
                      {item.title}
                    </p>

                    <span className="rounded-full bg-[#fff0e3] px-2.5 py-1 text-[10px] font-medium text-[#bd6439]">
                      {item.date}
                    </span>
                  </div>

                  <p className="mt-1 text-sm leading-5 text-[#82736b]">
                    {item.puja}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/pujas"
            className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#d6531d] px-4 py-4 text-sm font-semibold text-white transition hover:bg-[#b94316]"
          >
            <Bell size={19} />
            Explore Pujas & Book Pandit
          </Link>
        </div>

        {/* Add Member Modal */}
        {modalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => !saving && setModalOpen(false)}
          >
            <div
              className="w-full max-w-md rounded-[26px] bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#39251d]">
                    Add Family Member
                  </h2>
                  <p className="mt-1 text-xs text-[#82736b]">
                    Enter family member details
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

              <form
                onSubmit={handleAddMember}
                className="mt-6 space-y-4"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#39251d]">
                    Full Name *
                  </label>

                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter full name"
                    className="w-full rounded-xl border border-[#e8ddce] px-4 py-3 text-sm outline-none focus:border-[#d6531d]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#39251d]">
                    Relation *
                  </label>

                  <select
                    required
                    value={form.relation}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        relation: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[#e8ddce] bg-white px-4 py-3 text-sm outline-none focus:border-[#d6531d]"
                  >
                    <option value="">Select relation</option>
                    <option value="Self">Self</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#39251d]">
                    Nakshatra
                  </label>

                  <input
                    type="text"
                    value={form.nakshatra}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        nakshatra: e.target.value,
                      })
                    }
                    placeholder="e.g. Rohini (Vrishabha)"
                    className="w-full rounded-xl border border-[#e8ddce] px-4 py-3 text-sm outline-none focus:border-[#d6531d]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#d6531d] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#b94316] disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Save Family Member
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setSelectedMember(null);
        }}
        onConfirm={confirmDeleteMember}
        title="Delete Family Member?"
        message={`Are you sure you want to delete ${selectedMember?.name || "this family member"}? Their associated reminders will also be deleted. This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Keep Member"
        variant="danger"
        loading={deleteLoading}
      />

    </>

  );
}


export default FamilyPage