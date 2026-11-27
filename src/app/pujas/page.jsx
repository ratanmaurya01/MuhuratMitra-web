
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Clock3,
  IndianRupee,
  Search,
  Flower2,
  Sparkles,
} from "lucide-react";
import { getPujas } from "@/lib/api";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  "All Pujas",
  "Prosperity",
  "Home & Vastu",
];

function PujaCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[#e9dfd1] bg-white shadow-sm">
      <div className="aspect-[2.35/1] animate-pulse bg-[#f2e9dc]" />
      <div className="space-y-4 p-5">
        <div className="h-6 w-24 animate-pulse rounded-full bg-[#f2e9dc]" />
        <div className="h-6 w-3/4 animate-pulse rounded bg-[#f2e9dc]" />
        <div className="h-4 w-full animate-pulse rounded bg-[#f2e9dc]" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-[#f2e9dc]" />
      </div>
    </div>
  );
}

function PujaCard({ puja }) {
  const image =
    puja.image ||
    puja.imageUrl ||
    puja.bannerImage ||
    puja.thumbnail;

  const category =
    puja.categoryName ||
    puja.category ||
    "Traditional";

  const deity =
    puja.deity ||
    puja.deityName ||
    puja.god ||
    "Hindu Deity";

  return (
    <Link
      href={`/pujas/${puja.id}`}
      className="group block overflow-hidden rounded-[28px] border border-[#e8ddce] bg-white shadow-[0_3px_8px_rgba(76,48,30,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Puja Image */}
      <div className="relative aspect-[2.35/1] overflow-hidden bg-[#f4e8d5]">
        {image ? (
          <img
            src={image}
            alt={puja.nameHindi || puja.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#f8e6c9] to-[#edc99c] text-[#9c512d]">
            <Flower2 size={55} strokeWidth={1.2} />
            <span className="text-sm font-medium">
              Sacred Puja & Vidhi
            </span>
          </div>
        )}
      </div>

      {/* Puja Information */}
      <div className="p-5 sm:p-6">

        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-[#ffeadb] px-4 py-1.5 text-xs font-medium text-[#8b452c] sm:text-sm">
            {category}
          </span>

          <span className="flex shrink-0 items-center gap-0.5 text-xl font-semibold text-[#702c27]">
            <IndianRupee size={19} />
            {Number(puja.price || 0).toLocaleString("en-IN")}
          </span>
        </div>

        <h2 className="mt-4 text-xl font-medium leading-snug text-[#35251f] sm:text-2xl">
          {puja.name || puja.nameHindi}
        </h2>

        {puja.name && puja.nameHindi && (
          <p className="mt-1 text-sm text-[#806d61]">
            {puja.name}
          </p>
        )}

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#806d61] sm:text-base">
          {puja.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#806d61]">
          <Clock3 size={17} className="shrink-0 text-[#c85c32]" />

          <span>
            {puja.durationMin || "--"} mins
          </span>

          <span>•</span>
          <span>{deity}</span>

        </div>

        <div className="flex  justify-center mt-3">
          <Button className="w-full">
            View Details
          </Button>
        </div>


      </div>
    </Link>
  );
}

export default function PujasPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Pujas");
  const [pujas, setPujas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isActive = true;

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const result = await getPujas(query);

        if (isActive) {
          setPujas(Array.isArray(result) ? result : []);
        }
      } catch (err) {
        if (isActive) {
          setError("Pujas could not be loaded. Please try again.");
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
  }, [query, retryCount]);

  const filteredPujas = useMemo(() => {
    if (activeCategory === "All Pujas") return pujas;

    return pujas.filter((puja) => {
      const category = (
        puja.categoryName ||
        puja.category ||
        ""
      ).toLowerCase();

      return category === activeCategory.toLowerCase();
    });
  }, [pujas, activeCategory]);

  return (
    <main className="min-h-screen bg-[#fffdf7] pb-10">

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-10 lg:px-8">

        {/* Search Bar */}
        <div className="relative">
          <Search
            size={25}
            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#806d61]"
          />

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search puja, deity, or sanskar..."
            aria-label="Search pujas"
            className="h-[68px] w-full rounded-[24px] border border-[#e5d9c8] bg-transparent pl-14 pr-5 text-base text-[#35251f] outline-none transition-all placeholder:text-[#806d61] focus:border-[#c95725] focus:ring-2 focus:ring-[#c95725]/10 sm:h-[76px] sm:text-lg"
          />
        </div>

        {/* Category Filters */}
        <div className="mt-7 flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-2xl border px-5 py-3 text-sm font-medium transition-all sm:px-6 sm:text-base ${activeCategory === category
                ? "border-[#f5dfdc] bg-[#f7e4e1] text-[#702c27]"
                : "border-[#e5d9c8] bg-transparent text-[#806d61] hover:bg-[#fff0e5]"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Section Heading */}
        <div className="mb-5 mt-7 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[#35251f] sm:text-2xl">
            All Pujas
          </h1>

          {!loading && (
            <span className="text-sm text-[#806d61]">
              {filteredPujas.length} Pujas
            </span>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <PujaCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-[#e8ddce] bg-white px-6 py-12 text-center">
            <p className="text-sm text-[#806d61]">{error}</p>

            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-4 font-semibold text-[#bd6338]"
            >
              Retry
            </button>
          </div>
        ) : filteredPujas.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#e5d9c8] bg-white px-6 py-16 text-center">
            <Flower2
              size={42}
              className="mx-auto mb-4 text-[#bd6338]"
            />

            <h3 className="text-lg font-semibold text-[#35251f]">
              No Pujas Found
            </h3>

            <p className="mt-2 text-sm text-[#806d61]">
              Try another search or category.
            </p>

            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveCategory("All Pujas");
              }}
              className="mt-5 text-sm font-semibold text-[#bd6338]"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPujas.map((puja) => (
              <PujaCard key={puja.id} puja={puja} />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
