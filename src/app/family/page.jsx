

"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Plus,
  Trash2,
  Cake,
  Heart,
  Flower2,
  Bell,
  BellOff,
  CalendarDays,
  UserRound,
  X,
} from "lucide-react";

const STORAGE_KEY = "muhuratmitra_family";

const DATE_TYPES = [
  {
    value: "birthday",
    label: "Birthday",
    icon: Cake,
  },
  {
    value: "anniversary",
    label: "Anniversary",
    icon: Heart,
  },
  {
    value: "punyatithi",
    label: "Punyatithi",
    icon: Flower2,
  },
];

const createId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${dateString}T00:00:00`));
};

export default function FamilyPage() {
  const [members, setMembers] = useState([]);
  const [importantDates, setImportantDates] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [memberName, setMemberName] = useState("");
  const [relation, setRelation] = useState("");

  const [dateMember, setDateMember] = useState("");
  const [dateType, setDateType] = useState("birthday");
  const [dateValue, setDateValue] = useState("");
  const [dateNote, setDateNote] = useState("");

  const [showMemberForm, setShowMemberForm] = useState(false);
  const [showDateForm, setShowDateForm] = useState(false);

  // Read localStorage only after the component mounts.
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);

      if (savedData) {
        const parsedData = JSON.parse(savedData);

        setMembers(
          Array.isArray(parsedData.members) ? parsedData.members : []
        );

        setImportantDates(
          Array.isArray(parsedData.importantDates)
            ? parsedData.importantDates
            : []
        );
      }
    } catch (error) {
      console.error("Unable to load family data:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save data only after the initial localStorage read.
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          members,
          importantDates,
        })
      );
    } catch (error) {
      console.error("Unable to save family data:", error);
    }
  }, [members, importantDates, isLoaded]);

  const handleAddMember = (event) => {
    event.preventDefault();

    const trimmedName = memberName.trim();

    if (!trimmedName) return;

    const newMember = {
      id: createId(),
      name: trimmedName,
      relation: relation.trim(),
      createdAt: new Date().toISOString(),
    };

    setMembers((previous) => [...previous, newMember]);

    setMemberName("");
    setRelation("");
    setShowMemberForm(false);
  };

  const handleRemoveMember = (memberId) => {
    const confirmed = window.confirm(
      "Remove this family member and their important dates?"
    );

    if (!confirmed) return;

    setMembers((previous) =>
      previous.filter((member) => member.id !== memberId)
    );

    setImportantDates((previous) =>
      previous.filter((date) => date.memberId !== memberId)
    );

    if (dateMember === memberId) {
      setDateMember("");
    }
  };

  const handleAddDate = (event) => {
    event.preventDefault();

    if (!dateMember || !dateValue) return;

    const newDate = {
      id: createId(),
      memberId: dateMember,
      type: dateType,
      date: dateValue,
      note: dateNote.trim(),
      reminder: true,
    };

    setImportantDates((previous) =>
      [...previous, newDate].sort((a, b) =>
        a.date.localeCompare(b.date)
      )
    );

    setDateValue("");
    setDateNote("");
    setShowDateForm(false);
  };

  const handleRemoveDate = (dateId) => {
    setImportantDates((previous) =>
      previous.filter((date) => date.id !== dateId)
    );
  };

  const handleReminderToggle = (dateId) => {
    setImportantDates((previous) =>
      previous.map((date) =>
        date.id === dateId
          ? { ...date, reminder: !date.reminder }
          : date
      )
    );
  };

  const getMemberName = (memberId) =>
    members.find((member) => member.id === memberId)?.name ??
    "Unknown member";

  const getDateType = (type) =>
    DATE_TYPES.find((item) => item.value === type) ?? DATE_TYPES[0];

  const getMemberDates = (memberId) =>
    importantDates.filter((date) => date.memberId === memberId);

  if (!isLoaded) {
    return (
      <div className="min-h-[60vh] bg-background">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
          <div className="mt-6 h-40 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
              <Users size={17} />
              Family Management
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Your Family
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Keep your loved ones and their important dates together.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowMemberForm(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Plus size={18} />
            Add Family Member
          </button>
        </div>

        {/* Summary */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users size={21} />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Family Members
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {members.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarDays size={21} />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Important Dates
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {importantDates.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Dates */}
        <section className="mt-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Important Dates
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Birthdays, anniversaries and punyatithis.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (members.length === 0) {
                  setShowMemberForm(true);
                  return;
                }

                setDateMember(members[0].id);
                setShowDateForm(true);
              }}
              disabled={members.length === 0}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={17} />
              Add Important Date
            </button>
          </div>

          {importantDates.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-12 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <CalendarDays size={25} />
              </div>

              <h3 className="mt-4 font-semibold text-foreground">
                No important dates yet
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Add birthdays, anniversaries and punyatithis to keep track
                of the special days in your family.
              </p>

              <button
                type="button"
                onClick={() => {
                  if (members.length === 0) {
                    setShowMemberForm(true);
                    return;
                  }

                  setDateMember(members[0].id);
                  setShowDateForm(true);
                }}
                disabled={members.length === 0}
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                <Plus size={17} />
                Add First Date
              </button>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {importantDates.map((date) => {
                const dateTypeInfo = getDateType(date.type);
                const DateIcon = dateTypeInfo.icon;

                return (
                  <div
                    key={date.id}
                    className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4"
                  >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <DateIcon size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {dateTypeInfo.label}
                        </h3>

                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                          {getMemberName(date.memberId)}
                        </span>
                      </div>

                      <p className="mt-1 text-sm font-medium text-foreground">
                        {formatDate(date.date)}
                      </p>

                      {date.note && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {date.note}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleReminderToggle(date.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-primary"
                        >
                          {date.reminder ? (
                            <>
                              <Bell size={14} className="text-primary" />
                              Reminder on
                            </>
                          ) : (
                            <>
                              <BellOff size={14} />
                              Reminder off
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveDate(date.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive hover:underline"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Family Members */}
        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-foreground">
              Family Members
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage the people in your family.
            </p>
          </div>

          {members.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-12 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <UserRound size={25} />
              </div>

              <h3 className="mt-4 font-semibold text-foreground">
                Your family list is empty
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Add your first family member to get started.
              </p>

              <button
                type="button"
                onClick={() => setShowMemberForm(true)}
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
              >
                <Plus size={17} />
                Add Family Member
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                        {member.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-foreground">
                          {member.name}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          {member.relation || "Family Member"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      aria-label={`Remove ${member.name}`}
                      className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <div className="mt-5 border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground">
                      Important dates
                    </p>

                    <p className="mt-1 font-semibold text-foreground">
                      {getMemberDates(member.id).length}
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setDateMember(member.id);
                        setShowDateForm(true);
                      }}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                    >
                      <Plus size={16} />
                      Add date
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Add Member Modal */}
      {showMemberForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                Add Family Member
              </h2>

              <button
                type="button"
                onClick={() => setShowMemberForm(false)}
                aria-label="Close"
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label
                  htmlFor="member-name"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Full Name
                </label>

                <input
                  id="member-name"
                  value={memberName}
                  onChange={(event) => setMemberName(event.target.value)}
                  placeholder="Enter family member name"
                  required
                  maxLength={80}
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label
                  htmlFor="member-relation"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Relation
                </label>

                <input
                  id="member-relation"
                  value={relation}
                  onChange={(event) => setRelation(event.target.value)}
                  placeholder="e.g. Father, Mother, Brother"
                  maxLength={50}
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMemberForm(false)}
                  className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-foreground"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="h-10 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Important Date Modal */}
      {showDateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                Add Important Date
              </h2>

              <button
                type="button"
                onClick={() => setShowDateForm(false)}
                aria-label="Close"
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleAddDate} className="space-y-4">
              <div>
                <label
                  htmlFor="date-member"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Family Member
                </label>

                <select
                  id="date-member"
                  value={dateMember}
                  onChange={(event) => setDateMember(event.target.value)}
                  required
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                >
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="date-type"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Date Type
                </label>

                <select
                  id="date-type"
                  value={dateType}
                  onChange={(event) => setDateType(event.target.value)}
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                >
                  {DATE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="important-date"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Date
                </label>

                <input
                  id="important-date"
                  type="date"
                  value={dateValue}
                  onChange={(event) => setDateValue(event.target.value)}
                  required
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="date-note"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Note (Optional)
                </label>

                <input
                  id="date-note"
                  value={dateNote}
                  onChange={(event) => setDateNote(event.target.value)}
                  placeholder="Add a short note"
                  maxLength={120}
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDateForm(false)}
                  className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-foreground"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!dateMember || !dateValue}
                  className="h-10 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                >
                  Save Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

