import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, MapPin, Moon, Sunrise, Sunset, Sparkles, TriangleAlert } from "lucide-react";

function Metric({ icon: Icon, label, value, detail, tone = "cream" }) {
  const tones = {
    cream: "bg-[#FBF3E9] text-[#B9582C]",
    green: "bg-[#DDF2E5] text-[#246B49]",
    red: "bg-[#FBE4E3] text-[#A43A35]",
  };
  return (
    <div className={`min-w-0 rounded-2xl p-4 ${tones[tone]}`}>
      <div className="flex items-center gap-2 text-sm opacity-80">
        <Icon size={18} />
        <span>{label}</span>
      </div>
      <p className="mt-2 truncate text-base font-semibold sm:text-lg">{value || "—"}</p>
      {detail ? <p className="mt-1 truncate text-xs opacity-80">{detail}</p> : null}
    </div>
  );
}

export default function PanchangSection({ panchang, festivals = [] }) {
  const tithi = panchang?.tithi?.name || panchang?.tithi?.hindi || "Information unavailable";
  const nakshatra = panchang?.nakshatra?.name || panchang?.nakshatra?.hindi || "Information unavailable";
  const date = new Date().toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric", weekday: "long", timeZone: "Asia/Kolkata",
  });
  const festival = festivals[0];

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">Today's Panchang</h2>
        <Link href="/panchang" className="shrink-0 text-sm font-semibold text-[#C75B2C] hover:underline sm:text-base">
          Full Panchang <ArrowRight className="ml-1 inline" size={16} />
        </Link>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[#E5D9C8] bg-white shadow-[0_5px_18px_rgba(65,39,23,0.08)]">
        <Link href="/panchang" className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#FCE8D8] to-[#FFF2D9] px-5 py-4 transition hover:brightness-[0.98] sm:px-7">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-[#6C3928] sm:text-base">
              <MapPin size={17} className="text-[#D45B2C]" /> {panchang?.city || "Jaipur"} · {date}
            </p>
            <p className="mt-1 font-display text-lg font-medium sm:text-xl">Margashirsha, Vikram Samvat 2083</p>
          </div>
          <ArrowRight size={23} className="shrink-0" />
        </Link>

        <div className="space-y-5 p-4 sm:p-7">
          <div className="grid grid-cols-2 gap-3">
            <Metric icon={Moon} label="Tithi" value={tithi} detail={panchang?.tithi?.paksha || "आज की Tithi"} />
            <Metric icon={Sparkles} label="Nakshatra" value={nakshatra} detail={panchang?.nakshatra?.yoga ? `Yoga: ${panchang.nakshatra.yoga}` : ""} />
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#E7DCCB] bg-[#FFF9F0] p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#FFF0CB] text-[#B9851B]"><Sunrise size={21} /></span>
              <div><p className="text-xs text-[#8D7163]">Sunrise</p><p className="font-semibold">{panchang?.sunrise || "—"}</p></div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <div className="text-right"><p className="text-xs text-[#8D7163]">Sunset</p><p className="font-semibold">{panchang?.sunset || "—"}</p></div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F7E2E5] text-[#8B3034]"><Sunset size={21} /></span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-[#E9DFD2] pt-5">
            <Metric icon={Sparkles} label="Auspicious Muhurat" value={panchang?.bestMuhurat?.display || "—"} tone="green" />
            <Metric icon={TriangleAlert} label="Rahu Kaal" value={panchang?.rahuKaal?.display || "—"} tone="red" />
          </div>
          {panchang?.note ? <p className="rounded-xl bg-[#FFF7E9] p-3 text-sm leading-6 text-[#806557]">{panchang.note}</p> : null}
        </div>
      </div>

      {festival ? (
        <Link href="/panchang" className="flex items-center gap-3 rounded-2xl border border-[#E9D9C8] bg-[#FFF9F0] p-4 text-sm text-[#725346] hover:bg-[#FFF3E5]">
          <CalendarDays size={20} className="shrink-0 text-[#C65B2D]" />
          <span className="min-w-0 flex-1"><strong className="block text-[#43251D]">{festival.name || festival.nameHindi}</strong><span>{festival.date || "Upcoming Festival"}</span></span>
          <ArrowRight size={18} />
        </Link>
      ) : null}
    </section>
  );
}
