
import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Flower2,
  MapPin,
  MoonStar,
  Sunrise,
  Sunset,
  Users,
  WandSparkles,
} from "lucide-react";

import { getPanchang, getFestivals } from "@/lib/api";
import CitySelect from "@/components/CitySelect";

// Quick navigation actions
const QUICK_ACTIONS = [
  {
    title: "मुहूर्त खोजें",
    description: "शुभ कार्यों के लिए सही समय चुनें",
    href: "/muhurat",
    icon: WandSparkles,
  },
  {
    title: "पंडित बुक करें",
    description: "अनुभवी पंडित से जुड़ें",
    href: "/pandits",
    icon: Users,
  },
  {
    title: "AI से पूछें",
    description: "पूजा और परंपराओं के बारे में जानें",
    href: "/assistant",
    icon: Flower2,
  },
];

// Format date without UTC timezone shifting
function formatFestivalDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "short",
  });
}

function PanchangMetric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm text-primary-foreground/80">
        <Icon size={17} aria-hidden="true" />
        <span>{label}</span>
      </div>

      <p className="text-base font-semibold text-primary-foreground sm:text-lg">
        {value || "—"}
      </p>
    </div>
  );
}

export default async function HomePage() {
  const [panchang, festivals] = await Promise.all([
    getPanchang("Jaipur"),
    getFestivals(),
  ]);

  const festivalList = festivals.slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* =================================
          PAGE HEADER
      ================================= */}
      <section className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="mb-2 text-sm font-semibold tracking-wide text-primary">
            आपका स्वागत है
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            नमस्ते 🙏
          </h1>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            आज का दिन शुभ और मंगलमय हो।
          </p>
        </div>

        <CitySelect initialCity={panchang.city} />

      </section>

      {/* =================================
          TODAY'S PANCHANG
      ================================= */}
      <section aria-labelledby="panchang-heading" className="mb-10">

        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2
              id="panchang-heading"
              className="text-xl font-bold text-foreground"
            >
              आज का पंचांग
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {panchang.date} · {panchang.city}
            </p>
          </div>

          <Link
            href="/panchang"
            className="flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            पूरा पंचांग
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-lg">

          {/* Panchang Header */}
          <div className="border-b border-primary-foreground/20 p-5 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

              <div>
                <p className="mb-2 text-sm font-medium text-primary-foreground/80">
                  आज की तिथि
                </p>

                <h3 className="text-2xl font-bold sm:text-3xl">
                  {panchang.tithi.hindi}
                </h3>

                <p className="mt-2 text-sm text-primary-foreground/80">
                  {panchang.tithi.name}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-sm">
                <MapPin size={16} />
                {panchang.city}
              </div>

            </div>
          </div>

          {/* Panchang Details */}
          <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 sm:p-7">

            <PanchangMetric
              icon={MoonStar}
              label="नक्षत्र"
              value={panchang.nakshatra.hindi}
            />

            <PanchangMetric
              icon={Flower2}
              label="योग"
              value={panchang.yoga.hindi}
            />

            <PanchangMetric
              icon={Sunrise}
              label="सूर्योदय"
              value={panchang.sunrise}
            />

            <PanchangMetric
              icon={Sunset}
              label="सूर्यास्त"
              value={panchang.sunset}
            />

            <PanchangMetric
              icon={Clock3}
              label="राहु काल"
              value={panchang.rahuKaal.display}
            />

            <PanchangMetric
              icon={CalendarDays}
              label="शुभ मुहूर्त"
              value={panchang.bestMuhurat.display}
            />

          </div>

          {/* Panchang Footer */}
          <div className="border-t border-primary-foreground/20 bg-primary-foreground/10 px-5 py-4 sm:px-7">
            <p className="text-xs leading-5 text-primary-foreground/80">
              {panchang.note}
            </p>
          </div>

        </div>
      </section>

      {/* =================================
          QUICK ACTIONS
      ================================= */}
      <section aria-labelledby="quick-actions-heading" className="mb-10">

        <div className="mb-5">
          <h2
            id="quick-actions-heading"
            className="text-xl font-bold text-foreground"
          >
            आपके लिए खास सेवाएं
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            अपनी जरूरत के अनुसार सेवा चुनें।
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {QUICK_ACTIONS.map(({ title, description, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >

              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-saffron-light text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon size={23} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-card-foreground">
                  {title}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              </div>

              <ArrowRight
                size={18}
                className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
              />

            </Link>
          ))}

        </div>
      </section>

      {/* =================================
          UPCOMING FESTIVALS
      ================================= */}
      <section aria-labelledby="festivals-heading" className="mb-8">

        <div className="mb-5 flex items-center justify-between gap-3">

          <div>
            <h2
              id="festivals-heading"
              className="text-xl font-bold text-foreground"
            >
              आने वाले त्योहार
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              आगामी पर्व और विशेष अवसर।
            </p>
          </div>

          <Link
            href="/panchang"
            className="flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            सभी देखें
            <ArrowRight size={16} />
          </Link>

        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">

          {festivalList.length > 0 ? (
            festivalList.map((festival, index) => (
              <div
                key={festival.id}
                className={`flex items-center gap-4 p-4 sm:p-5 ${index !== festivalList.length - 1
                  ? "border-b border-border"
                  : ""
                  }`}
              >

                <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl bg-saffron-light text-primary">
                  <CalendarDays size={18} />
                  <span className="mt-0.5 text-[10px] font-semibold">
                    {formatFestivalDate(festival.date)}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-card-foreground sm:text-base">
                    {festival.nameHindi}
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {festival.name}
                  </p>
                </div>

                <ArrowRight
                  size={17}
                  className="shrink-0 text-muted-foreground"
                />

              </div>
            ))
          ) : (
            <p className="p-6 text-center text-sm text-muted-foreground">
              अभी कोई आगामी त्योहार उपलब्ध नहीं है।
            </p>
          )}
        </div>
        
      </section>
    </div>
  );
}
