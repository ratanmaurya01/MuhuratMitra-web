import Link from "next/link";
import { CalendarDays, PartyPopper, UserRoundSearch, Sparkles, ArrowUpRight } from "lucide-react";
const ACTIONS = [
  { title: "Find Muhurat", subtitle: "शुभ समय और Tithi खोजें", href: "/muhurat", icon: CalendarDays, tone: "orange" },
  { title: "Festival Dashboard", subtitle: "Explore upcoming festivals", href: "/festivals", icon: PartyPopper, tone: "rose" },
  { title: "Book a Pandit", subtitle: "Find experienced pandits", href: "/pandits", icon: UserRoundSearch, tone: "rose" },
  { title: "AI Assistant", subtitle: "Ask about puja and rituals", href: "/assistant", icon: Sparkles, tone: "gold" },
];
const TONES = {
  orange: "bg-[#FCE5D6] text-[#C95726]",
  rose: "bg-[#F5E2E1] text-[#7A2527]",
  gold: "bg-[#FFF0C9] text-[#A87912]",
};

export default function QuickActions() {
  return (
    <section aria-label="Quick Services" className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {ACTIONS.map(({ title, subtitle, href, icon: Icon, tone }) => (
        <Link
          key={href}
          href={href}
          className="group flex min-h-[154px] flex-col items-center justify-center rounded-[24px] border border-[#E7DCCB] bg-white px-3 py-5 text-center shadow-[0_3px_8px_rgba(65,39,23,0.07)] transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:min-h-[180px] sm:rounded-[28px]"
        >
          <span className={`mb-3 flex size-14 items-center justify-center rounded-full sm:size-[68px] ${TONES[tone]}`}>
            <Icon size={27} strokeWidth={2.1} />
          </span>
          <span className="font-display text-lg font-semibold text-[#43251D] sm:text-xl">{title}</span>
          <span className="mt-1 text-xs text-[#92766A] sm:text-sm">{subtitle}</span>
          <ArrowUpRight size={15} className="mt-2 text-[#C65B2D] opacity-0 transition group-hover:opacity-100" />
        </Link>
      ))}
    </section>
  );
}
