
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MoonStar,
  Sparkles,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { getMonthPanchang } from "@/lib/api";

const WEEKDAYS = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];

const MONTHS = [
  "जनवरी",
  "फरवरी",
  "मार्च",
  "अप्रैल",
  "मई",
  "जून",
  "जुलाई",
  "अगस्त",
  "सितंबर",
  "अक्टूबर",
  "नवंबर",
  "दिसंबर",
];

const HINDI_NUMBERS = new Intl.NumberFormat("hi-IN");

const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDaysInMonth(year, month) {
  if (month === 2) {
    const isLeapYear =
      year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);

    return isLeapYear ? 29 : 28;
  }

  return MONTH_DAYS[month - 1];
}

// Calculates weekday without creating a Date object.
function getWeekday(year, month, day = 1) {
  const offsets = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];

  let adjustedYear = year;

  if (month < 3) {
    adjustedYear -= 1;
  }

  return (
    (adjustedYear +
      Math.floor(adjustedYear / 4) -
      Math.floor(adjustedYear / 100) +
      Math.floor(adjustedYear / 400) +
      offsets[month - 1] +
      day) %
    7
  );
}

function formatSelectedDate(dateKey) {
  if (!dateKey) return "";

  const [year, month, day] = dateKey.split("-").map(Number);
  const weekday = getWeekday(year, month, day);

  return `${WEEKDAYS[weekday]}वार, ${HINDI_NUMBERS.format(
    day
  )} ${MONTHS[month - 1]} ${HINDI_NUMBERS.format(year)}`;
}

function CalendarDay({ day, isToday, isSelected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${day.day} तारीख${day.festival ? `, ${day.festival}` : ""}`}
      aria-pressed={isSelected}
      className={`relative flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl border p-2 transition-colors sm:min-h-20 ${
        isSelected
          ? "border-primary bg-saffron-light text-primary"
          : isToday
            ? "border-primary/50 bg-primary/5 text-primary"
            : "border-transparent text-foreground hover:border-border hover:bg-muted"
      }`}
    >
      <span
        className={`flex size-8 items-center justify-center rounded-full text-sm font-semibold ${
          isToday ? "bg-primary text-primary-foreground" : ""
        }`}
      >
        {HINDI_NUMBERS.format(day.day)}
      </span>

      {day.festival && (
        <span
          className="size-1.5 rounded-full bg-primary"
          aria-label="Festival"
        />
      )}
    </button>
  );
}

function CalendarSkeleton() {
  return (
    <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
      {Array.from({ length: 35 }).map((_, index) => (
        <div
          key={index}
          className="min-h-16 animate-pulse rounded-xl bg-muted sm:min-h-20"
        />
      ))}
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-saffron-light text-primary">
        <Icon size={18} aria-hidden="true" />
      </span>

      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm font-semibold leading-6 text-foreground">
          {value || "जानकारी उपलब्ध नहीं"}
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

  // Initialize current date after client mount.
  useEffect(() => {
    const now = new Date();

    setCurrentMonth({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    });

    setTodayKey(getDateKey(now));
  }, []);

  const year = currentMonth?.year;
  const month = currentMonth?.month;

  // Fetch monthly Panchang data.
  useEffect(() => {
    if (!year || !month) return;

    let isActive = true;

    async function loadMonth() {
      setLoading(true);
      setError("");
      setMonthData([]);

      try {
        const result = await getMonthPanchang(year, month);

        if (isActive) {
          setMonthData(result?.days || []);
        }
      } catch (err) {
        console.error("Unable to load monthly Panchang:", err);

        if (isActive) {
          setError(
            "Panchang data लोड नहीं हो पाया। कृपया दोबारा कोशिश करें।"
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadMonth();

    return () => {
      isActive = false;
    };
  }, [year, month, retryCount]);

  const firstWeekday =
    currentMonth && year && month
      ? getWeekday(year, month)
      : 0;

  const calendarCells = useMemo(() => {
    if (!currentMonth) return [];

    const daysInMonth = getDaysInMonth(year, month);

    const emptyCells = Array(firstWeekday).fill(null);

    const days = Array.from(
      { length: daysInMonth },
      (_, index) => monthData[index] || null
    );

    return [...emptyCells, ...days];
  }, [currentMonth, year, month, firstWeekday, monthData]);

  const selectedDay = monthData.find(
    (day) => day.date === selectedDate
  );

  function changeMonth(offset) {
    setCurrentMonth((previous) => {
      if (!previous) return previous;

      let nextMonth = previous.month + offset;
      let nextYear = previous.year;

      if (nextMonth > 12) {
        nextMonth = 1;
        nextYear += 1;
      } else if (nextMonth < 1) {
        nextMonth = 12;
        nextYear -= 1;
      }

      return {
        year: nextYear,
        month: nextMonth,
      };
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
    const currentDateKey = getDateKey(now);

    setCurrentMonth({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    });

    setTodayKey(currentDateKey);
    setSelectedDate(currentDateKey);
    setSheetOpen(true);
  }

  function retryLoading() {
    setRetryCount((count) => count + 1);
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:py-14 lg:px-8">
          <p className="mb-3 text-sm font-semibold tracking-wide text-primary">
            DAILY HINDU CALENDAR
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            पंचांग कैलेंडर
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            किसी भी तारीख को चुनें और उस दिन की तिथि, नक्षत्र, राहु काल
            और त्योहार की जानकारी देखें।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                {currentMonth
                  ? `${MONTHS[month - 1]} ${HINDI_NUMBERS.format(year)}`
                  : "कैलेंडर लोड हो रहा है..."}
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                तारीख चुनकर पंचांग देखें
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToToday}
                disabled={!currentMonth}
                className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                आज
              </button>

              <button
                type="button"
                onClick={() => changeMonth(-1)}
                disabled={!currentMonth}
                aria-label="पिछला महीना"
                className="flex size-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-50"
              >
                <ChevronLeft size={19} />
              </button>

              <button
                type="button"
                onClick={() => changeMonth(1)}
                disabled={!currentMonth}
                aria-label="अगला महीना"
                className="flex size-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-50"
              >
                <ChevronRight size={19} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 border-b border-border pb-3 sm:gap-2">
            {WEEKDAYS.map((weekday, index) => (
              <div
                key={weekday}
                className={`py-2 text-center text-xs font-semibold sm:text-sm ${
                  index === 0 ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {weekday}
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1.5 sm:gap-2">
            {!currentMonth || loading ? (
              <div className="col-span-7">
                <CalendarSkeleton />
              </div>
            ) : error ? (
              <div className="col-span-7 py-16 text-center">
                <p className="text-sm text-muted-foreground">{error}</p>

                <button
                  type="button"
                  onClick={retryLoading}
                  className="mt-4 text-sm font-semibold text-primary hover:underline"
                >
                  Retry
                </button>
              </div>
            ) : (
              calendarCells.map((day, index) => {
                if (!day) {
                  return (
                    <div
                      key={`empty-${index}`}
                      aria-hidden="true"
                      className="min-h-16 sm:min-h-20"
                    />
                  );
                }

                return (
                  <CalendarDay
                    key={day.date}
                    day={day}
                    isToday={day.date === todayKey}
                    isSelected={day.date === selectedDate}
                    onClick={() => openDayDetails(day)}
                  />
                );
              })
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-border pt-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="size-2.5 rounded-full bg-primary" />
              आज की तारीख
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="size-2.5 rounded-full bg-primary" />
              त्योहार
            </div>
          </div>
        </div>

        <p className="mt-5 text-xs leading-5 text-muted-foreground">
          नोट: यह calendar development के लिए mock Panchang data दिखाता है।
          धार्मिक कार्यों के लिए वास्तविक स्थानीय पंचांग से समय की पुष्टि करें।
        </p>
      </section>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="bottom"
          className="mx-auto max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border-border bg-background px-5 pb-8"
        >
          <SheetHeader className="border-b border-border pb-5 text-left">
            <SheetTitle className="text-xl font-bold text-foreground">
              {formatSelectedDate(selectedDate)}
            </SheetTitle>

            <SheetDescription>
              इस तारीख का पंचांग विवरण
            </SheetDescription>
          </SheetHeader>

          {selectedDay ? (
            <div className="mt-5 space-y-3">
              <DetailRow
                icon={MoonStar}
                label="तिथि"
                value={selectedDay.tithi}
              />

              <DetailRow
                icon={Sparkles}
                label="नक्षत्र"
                value={selectedDay.nakshatra}
              />

              <DetailRow
                icon={Clock3}
                label="राहु काल"
                value={selectedDay.rahuKaal}
              />

              <DetailRow
                icon={CalendarDays}
                label="त्योहार"
                value={
                  selectedDay.festival ||
                  "आज कोई सूचीबद्ध त्योहार नहीं"
                }
              />

              <p className="pt-2 text-xs leading-5 text-muted-foreground">
                यह जानकारी sample data पर आधारित है। वास्तविक पंचांग
                और स्थानीय समय में अंतर हो सकता है।
              </p>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {loading
                ? "पंचांग जानकारी लोड हो रही है..."
                : "इस तारीख की जानकारी उपलब्ध नहीं है।"}
            </p>
          )}
        </SheetContent>
      </Sheet>
    </main>
  );
}
