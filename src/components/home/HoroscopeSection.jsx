import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Heart, Sparkles, Star } from "lucide-react";

const RASHIS = [
  ["Aries", "♈"], ["Taurus", "♉"], ["Gemini", "♊"], ["Cancer", "♋"],
  ["Leo", "♌"], ["Virgo", "♍"], ["Libra", "♎"], ["Scorpio", "♏"],
  ["Sagittarius", "♐"], ["Capricorn", "♑"], ["Aquarius", "♒"], ["Pisces", "♓"],
];

export default function HoroscopeSection() {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">Today's Vedic Horoscope</h2>
        <Link href="/horoscope" className="shrink-0 text-sm font-semibold text-[#C75B2C] hover:underline">View Details <ArrowRight className="ml-1 inline" size={16} /></Link>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[#E5D8C8] bg-white shadow-[0_5px_18px_rgba(65,39,23,0.07)]">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#F9E4DE] to-[#FCEBDD] px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-[#7D2025] text-2xl text-white">♉</span>
            <div><p className="font-display text-xl font-semibold">Choose Your Zodiac Sign</p><p className="text-sm text-[#80665B]">View Today's Horoscope</p></div>
          </div>
          <span className="rounded-full bg-[#DDF2E5] px-4 py-2 text-sm font-medium text-[#28734F]">12 Zodiac Signs</span>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b border-[#EEE3D7] p-4 [scrollbar-width:thin]">
          {RASHIS.map(([name, symbol], index) => (
            <Link key={name} href={`/horoscope`} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${index === 1 ? "border-[#F6D9C7] bg-[#FCE8D8] text-[#9D4828]" : "border-[#E8DDCF] bg-white text-[#765D51] hover:bg-[#FFF5E9]"}`}>
              {symbol} {name}
            </Link>
          ))}
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
          <div className="rounded-2xl bg-[#FBF3E9] p-5">
            <p className="flex items-center gap-2 font-semibold"><BriefcaseBusiness size={18} className="text-[#C65B2D]" /> Career & Finance</p>
            <p className="mt-2 text-sm leading-6 text-[#80695D]">Today's career and financial horoscope will be available soon.</p>
          </div>
          <div className="rounded-2xl bg-[#FBF3E9] p-5">
            <p className="flex items-center gap-2 font-semibold"><Heart size={18} className="text-[#C65B2D]" /> Family & Well-being</p>
            <p className="mt-2 text-sm leading-6 text-[#80695D]">Daily insights about family and relationships will be available soon.</p>
          </div>
          <div className="rounded-2xl bg-[#FFF5E2] p-5 sm:col-span-2">
            <p className="flex items-center gap-2 font-semibold"><Star size={18} className="text-[#A87912]" /> Vedic Remedies</p>
            <p className="mt-2 text-sm leading-6 text-[#80695D]">दैनिक Vedic Remedies और मंत्र यहां दिखाए जाएंगे।</p>
          </div>
        </div>
        <div className="flex justify-end px-5 pb-5 sm:px-7">
          <Link href="/assistant" className="inline-flex items-center gap-2 font-semibold text-[#C65B2D] hover:underline"><Sparkles size={17} /> Ask AI</Link>
        </div>
      </div>
    </section>
  );
}
