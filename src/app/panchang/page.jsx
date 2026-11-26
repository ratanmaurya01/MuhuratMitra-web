"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MoonStar,
  Sunrise,
  Sunset,
  Sparkles,
  Sun,
  TriangleAlert,
  BadgeCheck,
  UserRoundSearch,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getMonthPanchang } from "@/lib/api";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const HINDI_MONTHS = [
  "जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून",
  "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर",
];
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// Screenshot-backed observances used only when the API returns no observance names.
const FALLBACK_OBSERVANCES = {
  "2026-11": [
    { day: 19, festival: "Utpanna Ekadashi (Smarta)", nakshatra: "Krittika", observanceType: "Ekadashi" },
    { day: 21, festival: "Tulsi Vivah Samapan", nakshatra: "Mrigashira" },
    { day: 24, festival: "Kartik Purnima & Dev Deepawali", nakshatra: "Krittika (till 08:42 PM)" },
  ],
  "2026-12": [
    { day: 4, festival: "Utpanna Ekadashi Vrat", nakshatra: "Magha", observanceType: "Ekadashi" },
  ],
};

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDaysInMonth(year, month) {
  if (month === 2) {
    const leap = year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
    return leap ? 29 : 28;
  }
  return MONTH_DAYS[month - 1];
}

function getWeekday(year, month, day = 1) {
  const offsets = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
  let adjustedYear = year;
  if (month < 3) adjustedYear -= 1;
  return (
    adjustedYear +
    Math.floor(adjustedYear / 4) -
    Math.floor(adjustedYear / 100) +
    Math.floor(adjustedYear / 400) +
    offsets[month - 1] +
    day
  ) % 7;
}

function getDayNumber(day, fallback) {
  if (Number.isFinite(Number(day?.day))) return Number(day.day);
  if (day?.date && /^\d{4}-\d{2}-\d{2}$/.test(day.date)) {
    return Number(day.date.slice(-2));
  }
  return fallback;
}

function getDayDateKey(day, year, month, fallbackDay) {
  if (day?.date && /^\d{4}-\d{2}-\d{2}$/.test(day.date)) return day.date;
  const number = getDayNumber(day, fallbackDay);
  return `${year}-${String(month).padStart(2, "0")}-${String(number).padStart(2, "0")}`;
}

function getValue(day, ...keys) {
  for (const key of keys) {
    const value = day?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return "";
}

function formatDetailDate(dateKey) {
  if (!dateKey) return "";
  const [year, month, day] = dateKey.split("-").map(Number);
  const weekday = WEEKDAYS[getWeekday(year, month, day)];
  return `${day} ${MONTHS[month - 1]} ${year} (${weekday})`;
}

function formatHindiDate(dateKey) {
  if (!dateKey) return "";
  const [year, month, day] = dateKey.split("-").map(Number);
  return `${day} ${HINDI_MONTHS[month - 1]} ${year}`;
}

function isEkadashi(day) {
  const text = `${day?.festival || ""} ${day?.tithi || ""} ${day?.observance || ""}`;
  return /ekadashi|एकादशी/i.test(text);
}

function CalendarDay({ day, dayNumber, isToday, isSelected, onClick }) {
  const festival = getValue(day, "festival", "observance", "eventName");
  const ekadashi = isEkadashi(day);
  const shubh = Boolean(getValue(day, "shubhDay", "isShubh", "auspicious"));

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${dayNumber}${festival ? `, ${festival}` : ""}`}
      aria-pressed={isSelected}
      className={`flex min-h-[68px] flex-col items-center justify-center gap-1 rounded-2xl border text-[#35251f] transition-all sm:min-h-[76px] ${isSelected
        ? "border-[#c95725] bg-[#fff7ef] ring-2 ring-[#c95725]/20"
        : festival || ekadashi
          ? "border-transparent bg-[#fff0e5]"
          : isToday
            ? "border-[#c95725] bg-white"
            : "border-transparent bg-transparent hover:bg-[#faf1e7]"
        }`}
    >
      <span className="text-[17px] font-medium leading-none sm:text-lg">{dayNumber}</span>
      <span className="flex h-2 items-center justify-center gap-1.5" aria-hidden="true">
        {festival && <span className="size-2 rounded-full bg-[#d95725]" />}
        {ekadashi && <span className="size-2 rounded-full bg-[#7d2025]" />}
        {shubh && <span className="size-2 rounded-full bg-[#287448]" />}
      </span>
    </button>
  );
}

function CalendarSkeleton() {
  return (
    <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
      {Array.from({ length: 35 }).map((_, index) => (
        <div key={index} className="min-h-[68px] animate-pulse rounded-2xl bg-[#f5eee5] sm:min-h-[76px]" />
      ))}
    </div>
  );
}

function DetailCard({ icon: Icon, label, value, tone = "default" }) {
  const toneClasses = {
    default: "bg-[#fbf1e5] text-[#3a2a23]",
    warning: "bg-[#fbe5e3] text-[#9d302b]",
    success: "bg-[#e0f4e6] text-[#286b43]",
  };
  return (
    <div className={`flex min-h-[36px] items-start gap-2 rounded-xl p-2 sm:p-3 ${toneClasses[tone]}`}>
      {Icon && (
        <Icon size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      )}

      <div className="min-w-0">
        <p className="text-[11px] font-medium opacity-75 sm:text-xs">
          {label}
        </p>
        <p className="mt-0.5 break-words text-xs font-medium leading-5 sm:text-sm">
          {value || "Not available"}
        </p>
      </div>
    </div>
  );
}

export default function PanchangPage() {
  const [currentMonth, setCurrentMonth] = useState(null);
  const [todayKey, setTodayKey] = useState(null);
  const [monthData, setMonthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const now = new Date();
    setCurrentMonth({ year: now.getFullYear(), month: now.getMonth() + 1 });
    setTodayKey(getDateKey(now));
  }, []);

  const year = currentMonth?.year;
  const month = currentMonth?.month;

  useEffect(() => {
    if (!year || !month) return undefined;
    let isActive = true;

    async function loadMonth() {
      setLoading(true);
      setError("");
      setMonthData([]);
      try {
        const result = await getMonthPanchang(year, month);
        if (isActive) setMonthData(Array.isArray(result?.days) ? result.days : []);
      } catch (err) {
        console.error("Unable to load monthly Panchang:", err);
        if (isActive) setError("Panchang data could not be loaded. Please try again.");
      } finally {
        if (isActive) setLoading(false);
      }
    }

    loadMonth();
    return () => {
      isActive = false;
    };
  }, [year, month, retryCount]);

  const firstWeekday = year && month ? getWeekday(year, month) : 0;
  const daysInMonth = year && month ? getDaysInMonth(year, month) : 0;

  const daysByNumber = useMemo(() => {
    const map = new Map();
    monthData.forEach((day, index) => {
      const dayNumber = getDayNumber(day, index + 1);
      map.set(dayNumber, { ...day, day: dayNumber, date: getDayDateKey(day, year, month, dayNumber) });
    });
    return map;
  }, [monthData, year, month]);

  const calendarCells = useMemo(() => {
    if (!year || !month) return [];
    return [
      ...Array(firstWeekday).fill(null),
      ...Array.from({ length: daysInMonth }, (_, index) => daysByNumber.get(index + 1) || {
        day: index + 1,
        date: `${year}-${String(month).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`,
      }),
    ];
  }, [year, month, firstWeekday, daysInMonth, daysByNumber]);

  const selectedDay = monthData.find((day, index) =>
    getDayDateKey(day, year, month, index + 1) === selectedDate
  ) || (selectedDate ? daysByNumber.get(Number(selectedDate.slice(-2))) : null);

  const observances = useMemo(() => {
    const apiObservances = monthData
      .map((day, index) => ({
        ...day,
        day: getDayNumber(day, index + 1),
        date: getDayDateKey(day, year, month, index + 1),
      }))
      .filter((day) => getValue(day, "festival", "observance", "eventName"))
      .sort((a, b) => a.day - b.day);

    if (apiObservances.length) return apiObservances;

    const monthKey = year && month ? `${year}-${String(month).padStart(2, "0")}` : "";
    return (FALLBACK_OBSERVANCES[monthKey] || []).map((item) => ({
      ...item,
      date: `${monthKey}-${String(item.day).padStart(2, "0")}`,
    }));
  }, [monthData, year, month]);

  function changeMonth(offset) {
    setCurrentMonth((previous) => {
      if (!previous) return previous;
      const date = new Date(previous.year, previous.month - 1 + offset, 1);
      return { year: date.getFullYear(), month: date.getMonth() + 1 };
    });
    setSelectedDate(null);
    setSheetOpen(false);
  }

  function openDayDetails(day) {
    if (!day) return;
    setSelectedDate(day.date);
    setSheetOpen(true);
  }

  function goToToday() {
    const now = new Date();
    const key = getDateKey(now);
    setCurrentMonth({ year: now.getFullYear(), month: now.getMonth() + 1 });
    setTodayKey(key);
    setSelectedDate(key);
    setSheetOpen(true);
  }

  const detailDate = selectedDate ? formatDetailDate(selectedDate) : "";
  const selectedTithi = getValue(selectedDay, "tithi");
  const selectedNakshatra = getValue(selectedDay, "nakshatra");

  return (
    <main className="min-h-screen bg-[#fffdf7] px-3 py-5 text-[#35251f] sm:px-5 sm:py-7">

      <section className="mx-auto max-w-4xl space-y-6 sm:space-y-2">
        <div className="grid grid-cols-[40px_1fr_40px] items-center rounded-[32px] border border-[#e6dac9] bg-white
        px-4 py-5 shadow-[0_3px_14px_rgba(76,48,30,0.04)] sm:px-6 sm:py-6">

          {/* Previous Month */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => changeMonth(-1)}
            disabled={!currentMonth}
            aria-label="Previous month"
            className="size-10 rounded-full text-[#3b2922] hover:bg-[#fbf0e5]"
          >
            <ChevronLeft size={28} />
          </Button>

          {/* Month & City */}
          <div className="min-w-0 text-center">
            <h1 className="text-[26px] font-medium leading-tight tracking-tight text-[#35251f] sm:text-3xl">
              {currentMonth
                ? `${MONTHS[month - 1]} ${year}`
                : "Loading calendar..."}
            </h1>

            <p className="mt-1 text-sm text-[#806d61] sm:text-base">
              Varanasi • Tap a date for details
            </p>
          </div>

          {/* Next Month */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => changeMonth(1)}
            disabled={!currentMonth}
            aria-label="Next month"
            className="size-10 rounded-full text-[#3b2922] hover:bg-[#fbf0e5]"
          >
            <ChevronRight size={28} />
          </Button>

        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-1 text-sm text-[#806d61] sm:text-base">
          <span className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-[#d95725]" />Festival</span>
          <span className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-[#7d2025]" />Ekadashi</span>
          <span className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-[#287448]" />Shubh Day</span>
        </div>

        <div className="rounded-[28px] border border-[#e6dac9] bg-white p-3 shadow-[0_3px_14px_rgba(76,48,30,0.035)] sm:p-5">
          <div className="grid grid-cols-7 gap-1 border-b border-[#eee5da] pb-3 sm:gap-2">
            {WEEKDAYS.map((weekday) => (
              <div key={weekday} className="py-2 text-center text-xs font-medium text-[#806d61] sm:text-sm">{weekday}</div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1 sm:mt-3 sm:gap-2">
            {!currentMonth || loading ? (
              <div className="col-span-7"><CalendarSkeleton /></div>
            ) : error ? (
              <div className="col-span-7 py-14 text-center">
                <p className="text-sm text-[#806d61]">{error}</p>
                <Button variant="outline" onClick={() => setRetryCount((count) => count + 1)} className="mt-4 rounded-full border-[#dfcdb9]">Retry</Button>
              </div>
            ) : (
              calendarCells.map((day, index) => day ? (
                <CalendarDay
                  key={day.date}
                  day={day}
                  dayNumber={day.day}
                  isToday={day.date === todayKey}
                  isSelected={day.date === selectedDate}
                  onClick={() => openDayDetails(day)}
                />
              ) : <div key={`empty-${index}`} className="min-h-[68px] sm:min-h-[76px]" aria-hidden="true" />)
            )}
          </div>
        </div>

        <div className="space-y-4 pb-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold sm:text-xl">Key Observances This Month</h2>
            <span className="shrink-0 text-sm font-medium text-[#c95725] sm:text-base">Festival Hub</span>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((item) => <div key={item} className="h-24 animate-pulse rounded-3xl bg-[#f5eee5]" />)}
            </div>
          ) : observances.length ? (
            <div className="space-y-3">
              {observances.map((day) => {
                const title = getValue(day, "festival", "observance", "eventName");
                const nakshatra = getValue(day, "nakshatra");
                const ekadashi = isEkadashi(day);
                return (
                  <button key={day.date} type="button" onClick={() => openDayDetails(day)} className="flex w-full items-center gap-3 rounded-[24px] border border-[#e6dac9] bg-white p-3 text-left shadow-[0_2px_10px_rgba(76,48,30,0.025)] transition-colors hover:bg-[#fff9f2] sm:gap-4 sm:p-4">
                    <span className={`flex size-14 shrink-0 items-center justify-center rounded-2xl text-xl font-medium ${ekadashi ? "bg-[#f6e3e3] text-[#7d2025]" : "bg-[#ffeadb] text-[#c95725]"}`}>{day.day}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium leading-5 sm:text-base">{title}</span>
                      <span className="mt-1 block text-xs text-[#806d61] sm:text-sm">{day.day} {MONTHS[month - 1]} {year}{nakshatra ? ` • ${nakshatra}` : ""}</span>
                    </span>
                    {ekadashi && <span className="rounded-full bg-[#f6e3e3] px-3 py-1.5 text-xs font-medium text-[#7d2025]">Ekadashi</span>}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#e6dac9] bg-white/70 px-4 py-8 text-center text-sm text-[#806d61]">
              No observances are available for this month.
            </div>
          )}
        </div>
      </section>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>

        <SheetContent
          side="bottom"
          className="mx-auto max-h-[75dvh] w-full max-w-xl overflow-y-auto rounded-t-[26px] border-[#eadfce] bg-[#fff8ed] px-3 pb-4 pt-2 sm:px-5"
        >


          <div className="mx-auto  h-1.5 w-14 rounded-full bg-[#806258]" />

          <SheetHeader className="space-y-0.5 text-left">
            <SheetTitle className="text-xl font-semibold text-[#35251f] sm:text-2xl">
              {detailDate}
            </SheetTitle>

            <SheetDescription className="text-xs text-[#bd6338] sm:text-sm">
              {getValue(selectedDay, "city") || "Panchang Details"}
              {getValue(selectedDay, "vikramSamvat", "samvat")
                ? ` • ${getValue(selectedDay, "vikramSamvat", "samvat")}`
                : selectedDate
                  ? ` • ${formatHindiDate(selectedDate)}`
                  : ""}
            </SheetDescription>
          </SheetHeader>




          {selectedDay ? (
            <div className="space-y-1">
              <div className="grid grid-cols-2 gap-2">
                <DetailCard icon={MoonStar} label="Tithi" value={selectedTithi} />
                <DetailCard icon={Sparkles} label="Nakshatra" value={selectedNakshatra} />
                <DetailCard icon={Sun} label="Yoga / Karana" value={getValue(selectedDay, "yogaKarana", "yoga", "karana")} />
                <DetailCard icon={MoonStar} label="Moonrise" value={getValue(selectedDay, "moonrise", "moonRise")} />
                <DetailCard icon={Sunrise} label="Sunrise" value={getValue(selectedDay, "sunrise", "sunRise")} />
                <DetailCard icon={Sunset} label="Sunset" value={getValue(selectedDay, "sunset", "sunSet")} />
                <DetailCard icon={TriangleAlert} label="Rahu Kaal" value={getValue(selectedDay, "rahuKaal", "rahu_kaal")} tone="warning" />
                <DetailCard icon={BadgeCheck} label="Abhijit Muhurat" value={getValue(selectedDay, "abhijitMuhurat", "abhijitMuhurta")} tone="success" />
              </div>

              {getValue(selectedDay, "description", "summary", "significance") && (
                <p className="text-sm leading-6 text-[#806d61] sm:text-base">{getValue(selectedDay, "description", "summary", "significance")}</p>
              )}
              {getValue(selectedDay, "festival", "observance", "eventName") && (
                <div className="rounded-2xl border border-[#f0d8c5] bg-white/70 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#bd6338]">Festival / Observance</p>
                  <p className="mt-1 font-medium text-[#35251f]">{getValue(selectedDay, "festival", "observance", "eventName")}</p>
                </div>
              )}

              <p className="text-xs leading-5 text-[#8a786c]">Panchang timings may vary by location. Please verify important religious timings with a trusted local Panchang.</p>
              <div className="flex flex-row gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  className="h-12 min-w-0 flex-1 rounded-full border-[#e5d5c3] bg-transparent px-2 text-[#bd6338] hover:bg-[#fff0e4]"
                >
                  <CalendarDays size={17} className="shrink-0 sm:mr-2" />
                  <span className="truncate">Find Muhurat</span>
                </Button>

                <Button
                  className="h-12 min-w-0 flex-1 rounded-full bg-[#d95725] px-2 text-white hover:bg-[#bd4820]"
                >
                  <UserRoundSearch size={17} className="shrink-0 sm:mr-2" />
                  <span className="truncate">Book Pandit</span>
                </Button>
              </div>



            </div>
          ) : (
            <p className="py-10 text-center text-sm text-[#806d61]">{loading ? "Loading Panchang details..." : "Panchang details are not available for this date."}</p>
          )}
        </SheetContent>
      </Sheet>
    </main>
  );
}
