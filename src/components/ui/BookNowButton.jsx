
import { CalendarDays } from "lucide-react";
export default function BookNowButton({ pandit, onBook, className = "" }) {
  return (
    <button
      type="button"
      onClick={() => onBook(pandit)}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#d95718] px-8 font-semibold text-white shadow-sm transition hover:bg-[#b94715] ${className}`}
    >
      <CalendarDays size={18} />
      Book Now
    </button>
  );
}
