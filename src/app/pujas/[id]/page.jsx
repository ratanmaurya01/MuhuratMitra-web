
"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  Flower2,
  IndianRupee,
  PackageCheck,
} from "lucide-react";
import { getPuja } from "@/lib/api";

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse px-5 py-10 lg:px-8">
      <div className="mb-8 h-5 w-28 rounded bg-muted" />
      <div className="mb-4 h-9 w-2/3 rounded bg-muted" />
      <div className="mb-8 h-5 w-full max-w-2xl rounded bg-muted" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-64 rounded-2xl bg-muted" />
        <div className="h-64 rounded-2xl bg-muted" />
      </div>
    </div>
  );
}

export default function PujaDetailPage({ params }) {
  const { id } = use(params);

  const [puja, setPuja] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    let isActive = true;

    async function loadPuja() {
      setLoading(true);
      setPuja(null);
      setCheckedItems([]);

      try {
        const result = await getPuja(id);

        if (isActive) {
          setPuja(result);
        }
      } catch (error) {
        console.error("Unable to load puja:", error);

        if (isActive) {
          setPuja(null);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadPuja();

    return () => {
      isActive = false;
    };
  }, [id]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!puja) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-20 text-center lg:px-8">
        <Flower2 className="mx-auto mb-4 size-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold text-foreground">
          पूजा नहीं मिली
        </h1>
        <p className="mt-2 text-muted-foreground">
          यह पूजा उपलब्ध नहीं है या इसका link गलत है।
        </p>
        <Link
          href="/pujas"
          className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
        >
          <ArrowLeft size={17} />
          सभी पूजाएं देखें
        </Link>
      </main>
    );
  }

  const samagri = puja.samagri || [];
  const vidhi = puja.vidhi || [];
  const readyCount = checkedItems.length;
  const totalItems = samagri.length;
  const progress = totalItems
    ? Math.round((readyCount / totalItems) * 100)
    : 0;

  function toggleSamagri(item) {
    setCheckedItems((previous) =>
      previous.includes(item)
        ? previous.filter((value) => value !== item)
        : [...previous, item]
    );
  }

  return (
    <main className="min-h-screen bg-background pb-28">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <Link
          href="/pujas"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft size={17} />
          सभी पूजाएं
        </Link>

        <section className="mt-7 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-saffron-light text-primary">
            <Flower2 size={28} aria-hidden="true" />
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {puja.nameHindi || puja.name}
          </h1>

          {puja.nameHindi && (
            <p className="mt-1 text-sm text-muted-foreground">{puja.name}</p>
          )}

          <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
            {puja.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-4 border-t border-border pt-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock3 size={18} className="text-primary" aria-hidden="true" />
              <span>{puja.durationMin} minutes</span>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <IndianRupee size={18} aria-hidden="true" />
              <span>{Number(puja.price).toLocaleString("en-IN")}</span>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-saffron-light text-primary">
                <Flower2 size={21} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  पूजा विधि
                </h2>
                <p className="text-sm text-muted-foreground">
                  Puja steps
                </p>
              </div>
            </div>

            {vidhi.length > 0 ? (
              <ol className="space-y-5">
                {vidhi.map((step, index) => (
                  <li key={`${index}-${step}`} className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-saffron-light text-sm font-semibold text-primary">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-sm leading-6 text-foreground">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground">
                पूजा विधि की जानकारी जल्द उपलब्ध होगी।
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-saffron-light text-primary">
                <PackageCheck size={21} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  पूजा सामग्री
                </h2>
                <p className="text-sm text-muted-foreground">
                  Samagri checklist
                </p>
              </div>
            </div>

            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-foreground">
                  तैयारी की progress
                </span>
                <span className="text-sm font-semibold text-primary">
                  {readyCount}/{totalItems} ready
                </span>
              </div>

              <div
                className="h-2 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-label="Samagri preparation progress"
                aria-valuemin={0}
                aria-valuemax={totalItems}
                aria-valuenow={readyCount}
              >
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {samagri.length > 0 ? (
              <ul className="space-y-3">
                {samagri.map((item, index) => {
                  const isChecked = checkedItems.includes(item);

                  return (
                    <li key={`${index}-${item}`}>
                      <label
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                          isChecked
                            ? "border-primary/30 bg-saffron-light"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSamagri(item)}
                          className="peer sr-only"
                        />

                        <span
                          className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                            isChecked
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-input bg-background"
                          }`}
                          aria-hidden="true"
                        >
                          {isChecked && <Check size={14} />}
                        </span>

                        <span
                          className={`text-sm ${
                            isChecked
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
                          }`}
                        >
                          {item}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                पूजा सामग्री की जानकारी जल्द उपलब्ध होगी।
              </p>
            )}

            {totalItems > 0 && readyCount === totalItems && (
              <p className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
                <CheckCircle2 size={17} />
                सभी सामग्री तैयार है!
              </p>
            )}
          </section>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-5 py-4 shadow-lg backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 lg:px-3">
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-foreground">
              {puja.nameHindi || puja.name}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              ₹{Number(puja.price).toLocaleString("en-IN")}
            </p>
          </div>

          <Link
            href={`/pandits?puja=${encodeURIComponent(puja.id)}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-saffron-dark sm:ml-auto sm:w-auto"
          >
            Pandit बुक करें
            <ArrowLeft className="rotate-180" size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  );
}
