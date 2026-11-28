
"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Flower2, } from "lucide-react";
import { getPuja } from "@/services/pujaService";
import PujaCard from "@/components/puja/PujaCard";
import PujaCardSkeleton from "@/components/puja/PujaCardSkeleton";

const CATEGORIES = [
  "All Pujas",
  "Prosperity",
  "Home & Vastu",
];


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

        const result = await getPuja();

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
    }, []);
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
