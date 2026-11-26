import Link from "next/link";
import { ArrowRight, Clock3, Flower2 } from "lucide-react";

const VRATS = [
  { date: "04 December 2026", tag: "Ekadashi", title: "उत्पन्ना Ekadashi व्रत", description: "An auspicious day for worshipping Lord Vishnu and observing the fast.", icon: Clock3 },
  { date: "27 November 2026", tag: "Pradosh", title: "मार्गशीर्ष Pradosh व्रत", description: "An auspicious occasion to worship and offer prayers to Lord Shiva.", icon: Flower2 },
];

export default function UpcomingVrats() {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">Upcoming Vrats</h2>
        <Link href="/festivals" className="shrink-0 text-sm font-semibold text-[#C75B2C] hover:underline">View All Vrats <ArrowRight className="ml-1 inline" size={16} /></Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {VRATS.map((item) => (
          <article key={item.title} className="flex gap-4 rounded-[25px] border border-[#E6D8C7] bg-white p-5 shadow-[0_3px_12px_rgba(65,39,23,0.05)] sm:p-6">
            <div className="flex size-14 shrink-0 items-center justify-center self-center rounded-2xl bg-[#FBE6D8] text-[#C65B2D]"><item.icon size={25} /></div>
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#FCE8D8] px-3 py-1 text-xs font-medium text-[#A94F2C]">{item.date}</span>
                <span className="rounded-full bg-[#DDF2E5] px-3 py-1 text-xs font-medium text-[#28734F]">{item.tag}</span>
              </div>
              <h3 className="font-display text-lg font-semibold sm:text-xl">{item.title}</h3>
              <p className="mt-1 text-sm leading-6 text-[#8A7064]">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="text-xs text-[#9A8174]">Vrat dates shown here are demo data. Connect a live Vrat API to display actual dates.</p>
    </section>
  );
}
