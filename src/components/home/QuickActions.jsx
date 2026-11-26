import Link from "next/link";
import {
  CalendarDays,
  PartyPopper,
  UserRoundSearch,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const ACTIONS = [
  { title: "Find Muhurat", subtitle: "Find auspicious timings", href: "/muhurat", icon: CalendarDays, tone: "orange" },
  { title: "Festival Hub", subtitle: "Upcoming festivals", href: "/festival-hub", icon: PartyPopper, tone: "rose" },
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
    <section
      aria-label="Quick Services"
      className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3"
    >
      {ACTIONS.map(({ title, href, icon: Icon, tone }) => (
        <Link
          key={href}
          href={href}
          className="group flex min-h-[100px] flex-col items-center justify-center rounded-xl border
           border-[#E7DCCB] bg-white px-2 py-3 text-center 
           shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:min-h-[115px] sm:rounded-2xl sm:py-4"
        >
          <span
            className={`mb-2 flex size-9 items-center justify-center rounded-full sm:size-10 ${TONES[tone]}`}
          >
            <Icon size={19} strokeWidth={2} />
          </span>
          <span className="text-xs">
            {title}
          </span>
      
        </Link>
      ))}
    </section>
  );
}