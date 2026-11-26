import { Sun } from "lucide-react";
export default function WelcomeHero({ today, citySelect }) {
  return (
    <section className="relative isolate flex min-h-[300px] items-end overflow-hidden rounded-[30px] border border-[#E8D5C1] bg-[#6F3828] p-6 shadow-[0_12px_30px_rgba(83,43,27,0.16)] sm:min-h-[360px] sm:p-9">
      {/* Background */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1606293926075-69a00db8f2f8?auto=format&fit=crop&w=1800&q=85')",
        }}
      />

      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#32160F]/90 via-[#4C2419]/50 to-[#32160F]/25" />
      {/* Date */}
      <div className="absolute left-4 top-5 z-10 rounded-full border border-white/20 bg-black/20 px-3 py-2 text-xs text-white backdrop-blur sm:left-8 sm:top-8 sm:px-4 sm:text-sm">
        {today}
      </div>
      <div className="absolute right-4 top-16 z-30 sm:right-8 sm:top-8">
        {citySelect}
      </div>
      {/* Hero Content */}
      <div className="relative z-10 max-w-2xl text-white">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs text-white/90 backdrop-blur">
          <Sun size={15} />
          Your Daily Spiritual Guidance
        </div>

        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
          Good Morning 🙏
        </h1>

        <p className="mt-3 max-w-xl text-base leading-relaxed text-white/90 sm:text-xl">
          Plan auspicious rituals with the Vedic Panchang and experienced pandits.
        </p>
      </div>
    </section>
  );
}