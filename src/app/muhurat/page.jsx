
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Compass,
  Home,
  BriefcaseBusiness,
  Heart,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  MoonStar,
  Plane,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  XCircle,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CITIES } from "@/lib/constants/cities";

import {
  getMuhuratResult,
  getMuhuratDateComparisons,
} from "@/lib/muhurat";
import { MuhuratHeader } from "@/components/muhurat/MuhuratHeader";
// -------------------- Constants --------------------

const CATEGORIES = [
  {
    id: "property",
    label: "Home & Property",
    icon: Home,
    events: [
      "Griha Pravesh",
      "Bhumi Pujan",
      "House Construction",
      "Property Purchase",
    ],
  },
  {
    id: "family",
    label: "Family",
    icon: Heart,
    events: [
      "Marriage",
      "Engagement",
      "Namkaran",
      "Annaprashan",
      "Mundan",
      "Baby Shower",
    ],
  },
  {
    id: "career",
    label: "Career & Finance",
    icon: BriefcaseBusiness,
    events: [
      "New Business",
      "Business Opening",
      "Job Joining",
      "Investment Start",
      "Office Opening",
    ],
  },
  {
    id: "shopping",
    label: "Shopping",
    icon: ShoppingBag,
    events: [
      "Vehicle Purchase",
      "Gold Purchase",
      "Electronics Purchase",
      "New Purchase",
    ],
  },
  {
    id: "spiritual",
    label: "Spiritual",
    icon: Sparkles,
    events: [
      "Puja",
      "Havan",
      "Temple Inauguration",
      "Religious Ceremony",
    ],
  },
  {
    id: "travel",
    label: "Travel",
    icon: Plane,
    events: [
      "Long Journey",
      "International Travel",
      "Pilgrimage",
      "New Journey",
    ],
  },
];

const LOADING_MESSAGES = [
  "पंचांग पढ़ रहे हैं...",
  "नक्षत्र विश्लेषण...",
  "दोष निवारण...",
];

const STEP_LABELS = [
  "कार्य चुनें",
  "तारीख और शहर",
  "विश्लेषण",
  "परिणाम",
];

const MAX_RANGE_DAYS = 30;

function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(dateString, days) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  date.setUTCDate(date.getUTCDate() + days);

  return date.toISOString().slice(0, 10);
}

function getDateDifference(startDate, endDate) {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);

  return Math.floor((end - start) / 86400000);
}

function formatDate(dateString) {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return new Intl.DateTimeFormat("hi-IN", {
    day: "numeric",
    month: "short",
    weekday: "short",
    timeZone: "UTC",
  }).format(date);
}

function getScoreLabel(score) {
  if (score >= 85) return "बहुत शुभ";
  if (score >= 75) return "शुभ";
  if (score >= 65) return "अनुकूल";
  return "सामान्य";
}

function getScoreColor(score) {
  if (score >= 85) return "text-primary";
  if (score >= 70) return "text-gold";
  return "text-muted-foreground";
}

// -------------------- Progress --------------------

function StepProgress({ step }) {
  return (
    <div className="mb-2">
      <div className="mb-1 flex items-center justify-between gap-2">
        {STEP_LABELS.map((label, index) => {
          const number = index + 1;
          const completed = number < step;
          const active = number === step;

          return (
            <div
              key={label}
              className="flex min-w-0 flex-1 flex-col items-center gap-2"
            >
              <div
                className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
                  completed
                    ? "bg-primary text-primary-foreground"
                    : active
                      ? "border-2 border-primary bg-saffron-light text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {completed ? <Check size={16} /> : number}
              </div>

              <span
                className={`truncate text-center text-[10px] font-medium sm:text-xs ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>
    </div>
  );
}

// -------------------- Score Ring --------------------

function ScoreRing({ score }) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  return (
    <div className="relative flex size-44 items-center justify-center">
      <svg
        viewBox="0 0 160 160"
        className="size-full -rotate-90"
        role="img"
        aria-label={`Muhurat score ${score} out of 100`}
      >
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          className="stroke-muted"
          strokeWidth="11"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          className="stroke-primary transition-all duration-1000"
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tabular-nums text-foreground">
          {score}
        </span>

        <span className="mt-1 text-xs text-muted-foreground">
          out of 100
        </span>
      </div>
    </div>
  );
}

// -------------------- Timeline --------------------

function DayTimeline({ segments }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <h3 className="font-semibold text-foreground">
        दिन का समय विश्लेषण
      </h3>

      <p className="mt-1 text-sm text-muted-foreground">
        शुभ, सावधानी और राहु काल के समय
      </p>

      <div className="mt-6 flex h-5 overflow-hidden rounded-full">
        {segments.map((segment, index) => (
          <div
            key={index}
            className={`${
              segment.type === "safe"
                ? "bg-primary"
                : segment.type === "caution"
                  ? "bg-gold"
                  : "bg-destructive"
            }`}
            style={{
              flex: segment.type === "avoid" ? 1.5 : 1,
            }}
            title={`${segment.label}: ${segment.start} – ${segment.end}`}
          />
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-start gap-2">
            <span
              className={`mt-1.5 size-2.5 shrink-0 rounded-full ${
                segment.type === "safe"
                  ? "bg-primary"
                  : segment.type === "caution"
                    ? "bg-gold"
                    : "bg-destructive"
              }`}
            />

            <div>
              <p className="text-xs font-semibold text-foreground">
                {segment.label}
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {segment.start} – {segment.end}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        Timeline demo data है। वास्तविक राहु काल सूर्योदय और सूर्यास्त
        के आधार पर location के अनुसार calculate होना चाहिए।
      </p>
    </div>
  );
}

// -------------------- Main Page --------------------

export default function MuhuratPage() {
  const [step, setStep] = useState(1);

  const [category, setCategory] = useState("property");
  const [event, setEvent] = useState("");
  const [search, setSearch] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [city, setCity] = useState("Jaipur");

  const [todayKey, setTodayKey] = useState("");
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const [result, setResult] = useState(null);
  const [comparisons, setComparisons] = useState([]);
  const [error, setError] = useState("");

  // Initialize current date after client mount.
  useEffect(() => {
    const today = getLocalDateString(new Date());

    setTodayKey(today);
    setStartDate(today);
    setEndDate(addDays(today, 7));
  }, []);

  const selectedCategory = CATEGORIES.find(
    (item) => item.id === category
  );

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return (selectedCategory?.events || []).filter((item) =>
      item.toLowerCase().includes(query)
    );
  }, [selectedCategory, search]);

  // Loading screen with rotating messages.
  useEffect(() => {
    if (step !== 3) return;

    setLoadingMessageIndex(0);

    const messageInterval = setInterval(() => {
      setLoadingMessageIndex((previous) =>
        (previous + 1) % LOADING_MESSAGES.length
      );
    }, 850);

    const loadingTimeout = setTimeout(() => {
      try {
        const selectedResult = getMuhuratResult({
          event,
          date: startDate,
          city,
        });

        const rankedDates = getMuhuratDateComparisons({
          event,
          city,
          startDate,
          endDate,
        });

        setResult(selectedResult);
        setComparisons(rankedDates);
        setError("");
        setStep(4);
      } catch (err) {
        console.error("Muhurat calculation failed:", err);
        setError("Muhurat analysis नहीं हो पाया। कृपया दोबारा कोशिश करें।");
        setStep(2);
      }
    }, 2500);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(loadingTimeout);
    };
  }, [step, event, startDate, endDate, city]);

  function handleCategoryChange(nextCategory) {
    setCategory(nextCategory);
    setEvent("");
    setSearch("");
  }

  function handleDateChange(type, value) {
    setError("");

    if (type === "start") {
      setStartDate(value);

      if (endDate && value && getDateDifference(value, endDate) < 0) {
        setEndDate(value);
      }

      if (
        endDate &&
        value &&
        getDateDifference(value, endDate) >= MAX_RANGE_DAYS
      ) {
        setEndDate(addDays(value, MAX_RANGE_DAYS - 1));
      }
    } else {
      setEndDate(value);
    }
  }

  function validateStepOne() {
    if (!event) {
      setError("कृपया पहले अपना कार्य चुनें।");
      return false;
    }

    setError("");
    return true;
  }

  function validateStepTwo() {
    if (!startDate || !endDate || !city) {
      setError("कृपया तारीख और शहर चुनें।");
      return false;
    }

    if (startDate < todayKey) {
      setError("पुरानी तारीख select नहीं कर सकते।");
      return false;
    }

    const difference = getDateDifference(startDate, endDate);

    if (difference < 0) {
      setError("End date, start date के बाद होनी चाहिए।");
      return false;
    }

    if (difference >= MAX_RANGE_DAYS) {
      setError("Date range अधिकतम 30 दिनों का हो सकता है।");
      return false;
    }

    setError("");
    return true;
  }

  function startAnalysis() {
    if (!validateStepTwo()) return;

    setResult(null);
    setComparisons([]);
    setStep(3);
  }

  function resetFinder() {
    setStep(1);
    setEvent("");
    setSearch("");
    setCategory("property");
    setResult(null);
    setComparisons([]);
    setError("");
  }

  function selectComparisonDate(date) {
    setStartDate(date);
    setEndDate(date);
    setResult(
      getMuhuratResult({
        event,
        date,
        city,
      })
    );
  }

  return (
    <main className="min-h-screen bg-background">
     

       <MuhuratHeader/>



      <section className="mx-auto max-w-5xl p-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
          <StepProgress step={step} />
          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground">
                  
                </h2>

              </div>

              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((item) => {
                  const Icon = item.icon;
                  const active = category === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleCategoryChange(item.id)}
                      aria-pressed={active}
                      className={`inline-flex items-center gap-2 rounded-full border px-2
                         py-2 text-sm font-medium transition-colors ${
                        active
                          ? "border-primary bg-saffron-light text-primary"
                          : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="relative mt-2 max-w-lg">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="कार्य खोजें..."
                  className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="mt-5">
                <p className="mb-3 text-sm font-semibold text-foreground">
                  Select your event
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredEvents.map((item) => {
                    const active = event === item;

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setEvent(item);
                          setError("");
                        }}
                        aria-pressed={active}
                        className={`flex items-center justify-between rounded-xl border p-4 text-left text-sm font-medium transition-colors ${
                          active
                            ? "border-primary bg-saffron-light text-primary"
                            : "border-border text-foreground hover:border-primary/50"
                        }`}
                      >
                        {item}
                        {active && <Check size={17} />}
                      </button>
                    );
                  })}

                  {filteredEvents.length === 0 && (
                    <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
                      कोई event नहीं मिला।
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-foreground">
                तारीख और शहर चुनें
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                अगले अधिकतम 30 दिनों के लिए मुहूर्त खोजें।
              </p>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="start-date"
                    className="mb-2 block text-sm font-semibold text-foreground"
                  >
                    From date
                  </label>

                  <input
                    id="start-date"
                    type="date"
                    min={todayKey || undefined}
                    max={endDate || undefined}
                    value={startDate}
                    onChange={(event) =>
                      handleDateChange("start", event.target.value)
                    }
                    className="h-12 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="end-date"
                    className="mb-2 block text-sm font-semibold text-foreground"
                  >
                    To date
                  </label>

                  <input
                    id="end-date"
                    type="date"
                    min={startDate || todayKey || undefined}
                    max={
                      startDate
                        ? addDays(startDate, MAX_RANGE_DAYS - 1)
                        : undefined
                    }
                    value={endDate}
                    onChange={(event) =>
                      handleDateChange("end", event.target.value)
                    }
                    className="h-12 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    <Compass className="mr-1 inline size-4 text-primary" />
                    आपका शहर
                  </label>

                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="h-12 w-full">
                      <SelectValue placeholder="शहर चुनें" />
                    </SelectTrigger>

                    <SelectContent>
                      {CITIES.filter((item) => item.value !== "all").map(
                        (item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {startDate && endDate && (
                <p className="mt-5 rounded-lg bg-saffron-light p-3 text-sm text-primary">
                  Selected range: {formatDate(startDate)} – {formatDate(endDate)}
                  {" · "}
                  {getDateDifference(startDate, endDate) + 1} days
                </p>
              )}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="flex min-h-[390px] flex-col items-center justify-center py-12 text-center">
              <div className="relative flex size-24 items-center justify-center rounded-full bg-saffron-light text-primary">
                <Sparkles size={42} className="animate-pulse" />

                <span className="absolute -right-1 -top-1 size-4 animate-ping rounded-full bg-primary/40" />
              </div>

              <h2 className="mt-8 text-2xl font-bold text-foreground">
                शुभ मुहूर्त का विश्लेषण
              </h2>

              <p
                key={loadingMessageIndex}
                className="mt-4 min-h-7 animate-pulse text-base font-semibold text-primary"
              >
                {LOADING_MESSAGES[loadingMessageIndex]}
              </p>

              <div className="mt-8 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-primary" />
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                {event} · {city}
              </p>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && result && (
            <div>
              <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-primary">
                    MUHURAT ANALYSIS
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-foreground">
                    आपका शुभ मुहूर्त
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {event} · {city} · {formatDate(result.date)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetFinder}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  <RotateCcw size={15} />
                  Start again
                </button>
              </div>

              {/* Score and best time */}
              <div className="grid gap-5 md:grid-cols-2">
                <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-6">
                  <ScoreRing score={result.score} />

                  <p className={`mt-3 text-lg font-bold ${getScoreColor(result.score)}`}>
                    {getScoreLabel(result.score)}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Mock Muhurat Compatibility Score
                  </p>
                </div>

                <div className="flex flex-col justify-center rounded-2xl border border-primary/20 bg-saffron-light p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <Star size={18} />
                    Best time window
                  </div>

                  <p className="mt-5 text-3xl font-bold tracking-tight text-foreground">
                    {result.bestTime.start}
                  </p>

                  <p className="mt-1 text-lg font-medium text-foreground">
                    to {result.bestTime.end}
                  </p>

                  <p className="mt-5 text-sm leading-6 text-muted-foreground">
                    यह selected date के लिए generated mock time window है।
                    वास्तविक मुहूर्त की पुष्टि स्थानीय पंचांग से करें।
                  </p>
                </div>
              </div>

              {/* Next best dates */}
              <section className="mt-8">
                <h3 className="text-lg font-bold text-foreground">
                  अगले अच्छे दिन
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Selected date range में सबसे अधिक mock scores वाले दिन।
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {comparisons.slice(0, 4).map((item) => (
                    <button
                      key={item.date}
                      type="button"
                      onClick={() => selectComparisonDate(item.date)}
                      className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors ${
                        item.date === result.date
                          ? "border-primary bg-saffron-light"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-foreground">
                          {formatDate(item.date)}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.bestTime.start} – {item.bestTime.end}
                        </p>
                      </div>

                      <span className="font-bold text-primary">
                        {item.score}/100
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Why this works */}
              <section className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-primary" size={20} />

                  <h3 className="font-bold text-foreground">
                    Why this works
                  </h3>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "तिथि", value: result.tithi },
                    { label: "नक्षत्र", value: result.nakshatra },
                    { label: "योग", value: result.yoga },
                    { label: "करण", value: result.karana },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl bg-muted/50 p-4"
                    >
                      <p className="text-xs text-muted-foreground">
                        {item.label}
                      </p>

                      <p className="mt-1 font-semibold text-foreground">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Timeline */}
              <section className="mt-8">
                <DayTimeline segments={result.timeline} />
              </section>

              {/* Do and Don't */}
              <section className="mt-8 grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="flex items-center gap-2 font-bold text-foreground">
                    <ShieldCheck className="text-primary" size={19} />
                    क्या करें
                  </h3>

                  <ul className="mt-4 space-y-3">
                    {result.doList.map((item, index) => (
                      <li key={index} className="flex gap-2 text-sm leading-6 text-muted-foreground">
                        <Check size={17} className="mt-0.5 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="flex items-center gap-2 font-bold text-foreground">
                    <AlertTriangle className="text-destructive" size={19} />
                    क्या न करें
                  </h3>

                  <ul className="mt-4 space-y-3">
                    {result.dontList.map((item, index) => (
                      <li key={index} className="flex gap-2 text-sm leading-6 text-muted-foreground">
                        <XCircle size={17} className="mt-0.5 shrink-0 text-destructive" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Date comparison */}
              <section className="mt-8">
                <h3 className="text-lg font-bold text-foreground">
                  तारीखों की तुलना
                </h3>

                <div className="mt-4 overflow-hidden rounded-xl border border-border">
                  <div className="grid grid-cols-[1fr_auto_auto] gap-3 bg-muted/60 px-4 py-3 text-xs font-semibold text-muted-foreground">
                    <span>तारीख</span>
                    <span>Best time</span>
                    <span>Score</span>
                  </div>

                  {comparisons.map((item) => (
                    <button
                      key={item.date}
                      type="button"
                      onClick={() => selectComparisonDate(item.date)}
                      className={`grid w-full grid-cols-[1fr_auto_auto] items-center gap-3 border-t border-border px-4 py-4 text-left text-xs transition-colors hover:bg-muted/50 sm:text-sm ${
                        item.date === result.date ? "bg-saffron-light/50" : ""
                      }`}
                    >
                      <span className="font-medium text-foreground">
                        {formatDate(item.date)}
                      </span>

                      <span className="text-muted-foreground">
                        {item.bestTime.start}
                      </span>

                      <span className="font-bold text-primary">
                        {item.score}/100
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <p className="mt-6 rounded-xl bg-muted/50 p-4 text-xs leading-6 text-muted-foreground">
                महत्वपूर्ण: यह Muhurat Finder deterministic mock data का
                उपयोग करता है। Score, तिथि, नक्षत्र, योग, करण और समय वास्तविक
                पंचांग गणना नहीं हैं। किसी भी शुभ कार्य से पहले स्थानीय
                योग्य ज्योतिषी या प्रमाणित पंचांग से पुष्टि करें।
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <p
              role="alert"
              className="mt-5 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          {/* Navigation */}
          {step !== 3 && step !== 4 && (
            <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setStep((current) => Math.max(1, current - 1));
                }}
                disabled={step === 1}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft size={17} />
                Back
              </button>

              {step === 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (validateStepOne()) setStep(2);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-saffron-dark"
                >
                  Continue
                  <ArrowRight size={17} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startAnalysis}
                  disabled={!todayKey}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-saffron-dark disabled:opacity-50"
                >
                  Find Muhurat
                  <Sparkles size={17} />
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
