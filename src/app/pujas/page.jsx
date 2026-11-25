
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock3, IndianRupee, Search, Flower2, ArrowRight } from "lucide-react";
import { getPujas } from "@/lib/api";

function PujaCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 size-12 rounded-xl bg-muted" />
      <div className="mb-3 h-5 w-2/3 rounded bg-muted" />
      <div className="mb-5 h-4 w-full rounded bg-muted" />
      <div className="mb-6 h-4 w-1/2 rounded bg-muted" />
      <div className="h-10 w-full rounded-lg bg-muted" />
    </div>
  );
}

function PujaCard({ puja }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg sm:p-6">
      <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-saffron-light text-primary">
        <Flower2 size={24} aria-hidden="true" />
      </div>

      <h2 className="text-lg font-semibold text-foreground">
        {puja.nameHindi || puja.name}
      </h2>

      {puja.nameHindi && (
        <p className="mt-1 text-sm text-muted-foreground">{puja.name}</p>
      )}

      <p className="mt-3 line-clamp-2 flex-1 text-sm leading-6 text-muted-foreground">
        {puja.description}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock3 size={16} aria-hidden="true" />
          {puja.durationMin} min
        </span>

        <span className="flex items-center gap-1 font-semibold text-primary">
          <IndianRupee size={17} aria-hidden="true" />
          {Number(puja.price).toLocaleString("en-IN")}
        </span>
      </div>

      <Link
        href={`/pujas/${puja.id}`}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-saffron-dark"
      >
        View Details
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}

export default function PujasPage() {
  const [query, setQuery] = useState("");
  const [pujas, setPujas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const result = await getPujas(query);

        if (isActive) {
          setPujas(result);
        }
      } catch (err) {
        if (isActive) {
          setError("Pujas load नहीं हो पाईं। कृपया दोबारा कोशिश करें।");
          setPujas([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16 lg:px-8">
          <p className="mb-3 text-sm font-semibold tracking-wide text-primary">
            OUR PUJA SERVICES
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            पूजा और अनुष्ठान
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            अपनी आवश्यकता के अनुसार पूजा चुनें और अनुभवी पंडित के साथ
            पूजा की तैयारी करें।
          </p>

          <div className="relative mt-8 max-w-xl">
            <Search
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />

            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="पूजा खोजें..."
              aria-label="पूजा खोजें"
              className="h-12 w-full rounded-xl border border-input bg-background pl-12 pr-4 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-foreground">
            सभी पूजाएं
          </h2>

          {!loading && (
            <span className="text-sm text-muted-foreground">
              {pujas.length} services
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <PujaCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-border bg-card px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
              type="button"
              onClick={() => setQuery((current) => `${current} `)}
              className="mt-4 text-sm font-semibold text-primary hover:underline"
            >
              Retry
            </button>
          </div>
        ) : pujas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <Flower2 className="mx-auto mb-4 size-10 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">
              कोई पूजा नहीं मिली
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              दूसरा नाम या keyword search करके देखें।
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-5 text-sm font-semibold text-primary hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pujas.map((puja) => (
              <PujaCard key={puja.id} puja={puja} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
