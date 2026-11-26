import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";

const EVENTS = [
  { date: "14 December 2026", day: "Monday", title: "Vivah Panchami", description: "A sacred day celebrating the divine wedding of Lord Rama and Goddess Sita.", tone: "orange" },
  { date: "20 December 2026", day: "Sunday", title: "Mokshada Ekadashi & Gita Jayanti", description: "A sacred occasion marking the appearance of the Bhagavad Gita and Mokshada Ekadashi.", tone: "rose" },
  { date: "24 December 2026", day: "Thursday", title: "Margashirsha Purnima & Datta Jayanti", description: "An auspicious occasion for Satyanarayan Puja and paying homage to the Guru.", tone: "orange" },
];

export default function UpcomingEvents() {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Upcoming Festival</h1>
        <Link href="/festival-hub" className="shrink-0 text-sm font-semibold text-[#C75B2C] hover:underline">Festival Hub <ArrowRight className="ml-1 inline" size={16} /></Link>
      </div>


      <div className="grid gap-2 md:grid-cols-2">
        {EVENTS.map((event) => (
          <article
            key={event.title}
            className="flex gap-3 rounded-lg border border-[#E5D9C8] bg-white p-3 shadow-sm"
          >
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${event.tone === "rose"
                  ? "bg-[#F5E2E1] text-[#842D32]"
                  : "bg-[#FCE7D8] text-[#C65B2D]"
                }`}
            >
              <CalendarDays size={19} />
            </span>

            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-[#38251f]">
                {event.title}
              </h3>

              <p className="mt-1 flex items-center gap-1 text-xs text-[#8A7064]">
                <Clock3 size={12} />
                {event.date} · {event.day}
              </p>

              <p className="mt-1 text-xs leading-5 text-[#80695D]">
                {event.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      <p className="text-xs text-[#9A8174]">The festivals shown here are demo data. Connect your festivals API to display live data.</p>
  
    </section>
  );
}
