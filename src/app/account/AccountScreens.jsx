
"use client";

import { useState } from "react";
import {
  ArrowLeft, Languages, Moon, Sun, CalendarDays, MapPin,
  Clock3, Trash2, Pencil, Home, Briefcase, Heart, Cake,
  Bell, CheckCheck, SlidersHorizontal, Sparkles, Plus,
  ChevronRight, IndianRupee, Flower2, UserRound,
  Settings, CircleHelp, Bookmark, Users, CreditCard
} from "lucide-react";
import Link from "next/link";

const C = {
  bg: "#fffdf6",
  card: "#ffffff",
  border: "#e6ddce",
  text: "#39251d",
  muted: "#82736b",
  orange: "#d6531d",
  light: "#fff2e6",
  pale: "#fbf4e9",
  green: "#e0f4e8",
  red: "#f9e6e3",
  yellow: "#fff1cc",
};

function Header({ title }) {
  const [language, setLanguage] = useState("EN");
  const [dark, setDark] = useState(false);

  return (
    <header className="mb-7 flex min-h-[65px] items-center justify-between gap-2 border-b border-[#eee4d7] pb-4 lg:hidden">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="shrink-0 rounded-full p-2 text-[#39251d] hover:bg-[#f5eadf]"
          aria-label="Go back"
        >
          <ArrowLeft size={25} />
        </button>
        <h1 className="truncate font-display text-[23px] text-[#39251d]">
          {title}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={() => setLanguage(language === "EN" ? "हि" : "EN")}
          className="flex h-10 items-center gap-1 rounded-full border border-[#ead9c8] bg-[#fff2e6] px-2.5 text-sm text-[#713c32]"
        >
          <Languages size={17} />
          {language}
        </button>
        <button
          onClick={() => setDark(!dark)}
          className="flex size-10 items-center justify-center rounded-full text-[#624b40]"
          aria-label="Toggle theme"
        >
          {dark ? <Sun size={21} /> : <Moon size={21} />}
        </button>
        <span className="flex size-10 items-center justify-center rounded-full bg-[#fbe9dc] font-display text-lg text-[#bd6439]">
          U
        </span>
      </div>
    </header>
  );
}

function PageTitle({ title, subtitle }) {
  return (
    <div className="mb-7 hidden lg:block">
      <p className="text-xs font-semibold tracking-widest text-[#bd6439]">
        MUHURATMITRA / MY ACCOUNT
      </p>
      <h1 className="mt-2 font-display text-3xl text-[#39251d]">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-[#82736b]">{subtitle}</p>}
    </div>
  );
}

function Screen({ title, subtitle, children }) {
  return (
    <div className="min-w-0">
      <Header title={title} />
      <PageTitle title={title} subtitle={subtitle} />
      {children}
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-[24px] border border-[#e6ddce] bg-white p-5 shadow-[0_2px_8px_rgba(70,45,25,0.025)] sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

function Status({ children }) {
  const styles = {
    Paid: "bg-[#e0f4e8] text-[#39754d]",
    Completed: "bg-[#e0f4e8] text-[#39754d]",
    Confirmed: "bg-[#e0f4e8] text-[#39754d]",
    Pending: "bg-[#fff1cc] text-[#85641b]",
    Held: "bg-[#fff1cc] text-[#85641b]",
    Refunded: "bg-[#f9e6e3] text-[#a34b43]",
    Cancelled: "bg-[#f9e6e3] text-[#a34b43]",
  };

  return (
    <span className={`rounded-full px-3 py-1.5 text-xs font-medium ${styles[children] || "bg-[#f4eee6] text-[#78665a]"}`}>
      {children}
    </span>
  );
}

// 1. MY BOOKINGS
const BOOKING_DATA = [
  {
    id: 1,
    name: "Griha Pravesh & Vastu Puja",
    pandit: "Pt. Devendra Joshi",
    date: "29 Nov 2026",
    time: "07:00 AM – 09:00 AM",
    address: "B-42, Vasant Kunj, New Delhi - 110070",
    amount: "₹5100",
    status: "Confirmed",
  },
  {
    id: 2,
    name: "Satyanarayan Katha",
    pandit: "Pt. Makarand Kulkarni",
    date: "28 Nov 2026",
    time: "06:00 PM – 08:00 PM",
    address: "Flat 402, Shanti Residency, Jaipur",
    amount: "₹2800",
    status: "Held",
  },
  {
    id: 3,
    name: "Naamkaran Sanskar",
    pandit: "Vidwan Subramanian Iyer",
    date: "18 Nov 2026",
    time: "09:00 AM – 11:00 AM",
    address: "Jaipur, Rajasthan",
    amount: "₹3400",
    status: "Completed",
  },
  {
    id: 4,
    name: "Ganesh Lakshmi Puja",
    pandit: "Pt. Harshvardhan Trivedi",
    date: "08 Nov 2026",
    time: "04:00 PM – 06:00 PM",
    address: "Jaipur, Rajasthan",
    amount: "₹2200",
    status: "Cancelled",
  },
];

export function BookingsPage() {
  const [tab, setTab] = useState("Upcoming");
  const tabs = ["Upcoming", "Completed", "Cancelled"];

  const filtered = BOOKING_DATA.filter((b) => {
    if (tab === "Upcoming") return ["Confirmed", "Held"].includes(b.status);
    if (tab === "Completed") return b.status === "Completed";
    return b.status === "Cancelled";
  });

  return (
    <Screen title="My Bookings" subtitle="View and manage your puja bookings.">
      <div className="-mx-4 mb-6 flex border-b border-[#e6ddce] bg-[#fff8ed] sm:mx-0 sm:rounded-xl sm:border">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 border-b-[3px] px-2 py-4 text-sm font-medium transition sm:text-base ${
              tab === t
                ? "border-[#d6531d] text-[#bd6439]"
                : "border-transparent text-[#89786d]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {filtered.map((b) => (
          <Card key={b.id}>
            <div className="flex items-start gap-3">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#fbe9df] text-[#bd6439]">
                <Flower2 size={26} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-[#39251d]">{b.name}</h3>
                <p className="mt-1 text-sm text-[#82736b]">{b.pandit}</p>
              </div>
              <Status>{b.status}</Status>
            </div>
            <div className="my-4 border-t border-[#eee8dc]" />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-2 text-sm text-[#82736b]">
                <p className="flex items-center gap-2">
                  <CalendarDays size={17} className="text-[#bd6439]" />
                  {b.date} · {b.time}
                </p>
                <p className="flex items-start gap-2">
                  <MapPin size={17} className="mt-0.5 shrink-0 text-[#bd6439]" />
                  {b.address}
                </p>
              </div>
              <p className="font-display text-xl text-[#713c32]">{b.amount}</p>
            </div>
            {b.status === "Confirmed" && (
              <button className="mt-4 w-full rounded-full border border-[#e6ddce] py-2.5 text-sm font-medium text-[#bd6439] hover:bg-[#fff8f0]">
                View Booking Details
              </button>
            )}
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card>
            <div className="py-10 text-center">
              <CalendarDays className="mx-auto mb-3 text-[#bd6439]" size={35} />
              <p className="font-medium text-[#39251d]">No {tab.toLowerCase()} bookings</p>
              <p className="mt-1 text-sm text-[#82736b]">Your bookings will appear here.</p>
            </div>
          </Card>
        )}
      </div>
    </Screen>
  );
}

// 2. PAYMENT HISTORY
const PAYMENT_DATA = [
  ["Griha Pravesh & Vastu Puja", "22 Nov 2026", "UPI (GPay)", "₹5100", "Paid"],
  ["Satyanarayan Katha", "20 Nov 2026", "HDFC Card ••4128", "₹2800", "Pending"],
  ["Naamkaran Sanskar", "18 Nov 2026", "UPI (PhonePe)", "₹3400", "Paid"],
  ["Ganesh Lakshmi Puja", "08 Nov 2026", "UPI (Paytm)", "₹2200", "Refunded"],
  ["Maha Rudrabhishek Puja", "02 Nov 2026", "UPI (GPay)", "₹2500", "Paid"],
  ["Navgraha Shanti Havan", "19 Oct 2026", "ICICI Card ••9014", "₹2700", "Paid"],
];

export function PaymentsPage() {
  return (
    <Screen title="Payment History" subtitle="Track all your puja payments and refunds.">
      <div className="mb-5 grid grid-cols-2 gap-3">
        <Card>
          <p className="text-sm text-[#82736b]">Total Paid</p>
          <h2 className="mt-2 font-display text-2xl text-[#39754d]">₹13,700</h2>
        </Card>
        <Card>
          <p className="text-sm text-[#82736b]">Transactions</p>
          <h2 className="mt-2 font-display text-2xl text-[#713c32]">6</h2>
        </Card>
      </div>

      <div className="space-y-4">
        {PAYMENT_DATA.map((p) => (
          <Card key={p[0]}>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-medium leading-6 text-[#39251d]">{p[0]}</h3>
                <p className="mt-1 text-sm text-[#82736b]">{p[1]} · {p[2]}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <span className="font-display text-xl text-[#39251d]">{p[3]}</span>
                <Status>{p[4]}</Status>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Screen>
  );
}

// 3. SAVED MUHURATS
const MUHURAT_DATA = [
  { id: 1, name: "Griha Pravesh", date: "29 Nov 2026 (Sunday)", city: "Jaipur", time: "07:15 AM – 08:45 AM", score: "91%", type: "Muhurats" },
  { id: 2, name: "Vehicle Purchase", date: "03 Dec 2026 (Thursday)", city: "Delhi", time: "10:15 AM – 11:45 AM", score: "84%", type: "Muhurats" },
];

export function SavedMuhuratsPage() {
  const [filter, setFilter] = useState("All");
  const [items, setItems] = useState(MUHURAT_DATA);
  const [alerts, setAlerts] = useState({});

  const visible = items.filter((item) => filter === "All" || item.type === filter);

  return (
    <Screen title="Saved Muhurats" subtitle="Your bookmarked auspicious dates and puja timings.">
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {["All", "Muhurats", "Puja Dates"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`shrink-0 rounded-xl border px-5 py-3 text-sm ${
              filter === t
                ? "border-[#f3dfd8] bg-[#f8e7e5] text-[#843f3b]"
                : "border-[#e6ddce] bg-white text-[#82736b]"
            }`}
          >
            {t} ({t === "Puja Dates" ? 0 : items.length})
          </button>
        ))}
      </div>

      <h2 className="mb-4 font-display text-2xl text-[#39251d]">
        {filter} ({visible.length})
      </h2>

      <div className="space-y-5">
        {visible.map((m) => (
          <Card key={m.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-medium text-[#39251d]">{m.name}</h3>
                <p className="mt-1 text-sm text-[#82736b]">{m.date} · {m.city}</p>
                <p className="mt-2 font-medium text-[#bd6439]">{m.time}</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className="rounded-full bg-[#e0f4e8] px-3 py-1 text-sm text-[#39754d]">{m.score}</span>
                <button
                  onClick={() => setItems((old) => old.filter((x) => x.id !== m.id))}
                  className="text-red-700"
                  aria-label="Remove saved muhurat"
                >
                  <Trash2 size={21} />
                </button>
              </div>
            </div>
            <div className="my-5 border-t border-[#eee8dc]" />
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm text-[#82736b]">
                <Bell size={18} /> Tap to Set Alert
              </span>
              <button
                onClick={() => setAlerts((old) => ({ ...old, [m.id]: !old[m.id] }))}
                className={`relative h-10 w-[70px] rounded-full transition ${alerts[m.id] ? "bg-[#d6531d]" : "bg-[#e8e2e7]"}`}
                aria-label="Toggle alert"
              >
                <span className={`absolute top-1 size-8 rounded-full bg-white shadow transition-all ${alerts[m.id] ? "left-[34px]" : "left-1"}`} />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </Screen>
  );
}

// 4. NOTIFICATIONS
const NOTIFICATIONS = [
  { id: 1, group: "Today", title: "Utpanna Ekadashi Tomorrow", body: "Ekadashi Tithi begins at 05:42 AM. Abhijit Muhurat is 11:48 AM – 12:31 PM.", time: "2h ago", unread: true },
  { id: 2, group: "Today", title: "Pandit Ji Confirmed Booking", body: "Pt. Devendra Joshi confirmed your Griha Pravesh & Vastu Puja for 25 Nov.", time: "5h ago", unread: true },
  { id: 3, group: "Earlier", title: "Pradosh Vrat Reminder", body: "Shukla Pradosh evening Shiva puja timing starts at 05:38 PM.", time: "2d ago", unread: false },
  { id: 4, group: "Earlier", title: "Family Sankalp Suggestion", body: "Ananya's birthday puja (Ayushya Homam) is coming up next week.", time: "4d ago", unread: false },
];

export function NotificationsPage() {
  const [items, setItems] = useState(NOTIFICATIONS);

  const markAll = () => {
    setItems((old) => old.map((n) => ({ ...n, unread: false })));
  };

  return (
    <Screen title="Notifications Inbox" subtitle="Your reminders, booking updates and important messages.">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/account/settings"
          className="flex items-center gap-2 rounded-full border border-[#e6ddce] px-5 py-3 text-sm text-[#bd6439]"
        >
          <SlidersHorizontal size={18} /> Notification Settings
        </Link>
        <button onClick={markAll} className="flex items-center gap-2 text-sm text-[#bd6439]">
          <CheckCheck size={20} /> Mark all as read
        </button>
      </div>

      {["Today", "Earlier"].map((group) => (
        <section key={group} className="mb-7">
          <h2 className="mb-4 font-display text-2xl text-[#39251d]">{group}</h2>
          <div className="space-y-4">
            {items.filter((n) => n.group === group).map((n) => (
              <Card key={n.id} className={n.unread ? "border-[#e4ad8e] bg-[#fff2e8]" : ""}>
                <div className="flex items-start gap-3">
                  <span className={`mt-2 size-3 shrink-0 rounded-full ${n.unread ? "bg-[#d6531d]" : "bg-[#eee4d7]"}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-[#39251d]">{n.title}</h3>
                      <span className="shrink-0 text-xs text-[#82736b]">{n.time}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#82736b]">{n.body}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </Screen>
  );
}

// 5. MY FAMILY
const FAMILY_DATA = [
  {
    id: 1, name: "Aarav Sharma", relation: "Self",
    nakshatra: "Rohini (Vrishabha (Taurus))",
    reminders: [
      { type: "Birthday", date: "14 Dec", puja: "Ayushya Homam & Ganesh Puja", enabled: true },
      { type: "Anniversary", date: "08 Feb", puja: "Satyanarayan Katha", enabled: true },
    ],
  },
  {
    id: 2, name: "Meera Sharma", relation: "Spouse",
    nakshatra: "Hasta (Kanya (Virgo))",
    reminders: [
      { type: "Birthday", date: "29 Nov", puja: "Lakshmi Narayan Puja", enabled: true },
    ],
  },
  {
    id: 3, name: "Raghavendra & Savitri", relation: "Parents",
    nakshatra: "Pushya (Karka (Cancer))",
    reminders: [
      { type: "Anniversary", date: "19 Jan", puja: "Maha Rudrabhishek & Shashti Shanti", enabled: false },
    ],
  },
];


export function FamilyPage() {
  const [family, setFamily] = useState(FAMILY_DATA);
  const toggleReminder = (memberId, reminderIndex) => {
    setFamily((old) => old.map((member) => member.id !== memberId ? member : {
      ...member,
      reminders: member.reminders.map((r, i) => i === reminderIndex ? { ...r, enabled: !r.enabled } : r),
    }));
  };

  const deleteMember = (id) => {
    setFamily((old) => old.filter((m) => m.id !== id));
  };

  return (
    <Screen title="My Family" subtitle="Track birthdays, anniversaries, Nakshatra & puja reminders.">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm text-[#82736b]">{family.length} family entries</span>
        <button
          onClick={() => alert("Connect Add Family form here.")}
          className="flex items-center gap-2 rounded-full bg-[#d6531d] px-5 py-3 text-sm font-semibold text-white shadow-md"
        >
          <Plus size={18} /> Add Member
        </button>
      </div>

      <div className="space-y-5">
        {family.map((member) => (
          <Card key={member.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-xl text-[#39251d]">{member.name}</h3>
                <p className="mt-1 text-sm text-[#bd6439]">
                  {member.relation} • {member.nakshatra}
                </p>
              </div>
              <button
                onClick={() => deleteMember(member.id)}
                className="shrink-0 p-2 text-[#715b4e]"
                aria-label="Delete family member"
              >
                <Trash2 size={22} />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {member.reminders.map((r, i) => (
                <div key={i} className="flex items-center gap-3 rounded-[20px] bg-[#fcf5eb] p-4">
                  <span className="flex size-9 shrink-0 items-center justify-center text-[#792a2d]">
                    {r.type === "Birthday" ? <Cake size={27} /> : <Heart size={27} fill="currentColor" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[#39251d]">{r.type} • {r.date}</p>
                    <p className="text-sm leading-5 text-[#82736b]">{r.puja}</p>
                  </div>
                  <button
                    onClick={() => toggleReminder(member.id, i)}
                    className={`relative h-9 w-[66px] shrink-0 rounded-full transition ${r.enabled ? "bg-[#d6531d]" : "bg-[#e7e1e7]"}`}
                    aria-label="Toggle reminder"
                  >
                    <span className={`absolute top-1 size-7 rounded-full bg-white shadow transition-all ${r.enabled ? "left-[34px]" : "left-1"}`} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      
      <Card className="mt-6 border-[#f1d9c5] bg-[#fff0e3]">
        <div className="flex items-center gap-2 text-[#bd6439]">
          <Sparkles size={24} />
          <h2 className="text-xl font-medium text-[#39251d]">Yearly Puja Suggestions</h2>
        </div>
        <ul className="mt-5 space-y-4 text-sm leading-6 text-[#39251d]">
          <li>🟠 Kartik Purnima (24 Nov) — Family Satyanarayan Katha & Deep Daan</li>
          <li>🟠 Makara Sankranti (14 Jan) — Surya Arghya & Til-Gud Daan</li>
          <li>🟠 Vasant Panchami (Feb) — Saraswati Puja for children's studies</li>
          <li>🟠 Shravan Somvaar — Rudrabhishek for parents' health & longevity</li>
        </ul>
        <Link
          href="/pujas"
          className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#d6531d] px-4 py-4 font-medium text-white"
        >
          <Bell size={19} /> Explore Pujas & Book Pandit
        </Link>
      </Card>
    </Screen>
  );
}

// 6. SAVED ADDRESSES
const ADDRESS_DATA = [
  { id: 1, label: "Home", type: "home", address: "Flat 402, Shanti Residency, Vaishali Nagar, Jaipur - 302021", isDefault: true },
  { id: 2, label: "Office", type: "office", address: "Suite 710, Sunrise Tech Park, Malviya Nagar, Jaipur - 302017", isDefault: false },
];

export function AddressesPage() {
  const [addresses, setAddresses] = useState(ADDRESS_DATA);

  const setDefault = (id) => {
    setAddresses((old) => old.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const remove = (id) => {
    setAddresses((old) => old.filter((a) => a.id !== id));
  };

  return (
    <Screen title="Saved Addresses" subtitle="Manage your puja and booking addresses.">
      <div className="space-y-5">
        {addresses.map((a) => (
          <Card key={a.id} className={a.isDefault ? "border-[#bd6439]" : ""}>
            <div className="flex items-center gap-3">
              <span className="text-[#bd6439]">
                {a.type === "home" ? <Home size={26} /> : <Briefcase size={26} />}
              </span>
              <h3 className="text-xl text-[#39251d]">{a.label}</h3>
              {a.isDefault && (
                <span className="rounded-full bg-[#e0f4e8] px-3 py-1 text-xs text-[#39754d]">
                  Default
                </span>
              )}
              <div className="ml-auto flex items-center gap-3">
                <button
                  onClick={() => alert("Connect Edit Address form here.")}
                  className="p-1 text-[#39251d]"
                  aria-label="Edit address"
                >
                  <Pencil size={23} />
                </button>
                <button
                  onClick={() => remove(a.id)}
                  className="p-1 text-red-700"
                  aria-label="Delete address"
                >
                  <Trash2 size={23} />
                </button>
              </div>
            </div>
            <p className="mt-5 text-[15px] leading-7 text-[#82736b]">{a.address}</p>
            {!a.isDefault && (
              <button
                onClick={() => setDefault(a.id)}
                className="mt-5 rounded-full border border-[#e6ddce] px-5 py-3 text-sm font-medium text-[#bd6439]"
              >
                ✓ Set Default
              </button>
            )}
          </Card>
        ))}
      </div>

      <button
        onClick={() => alert("Connect Add Address form here.")}
        className="fixed bottom-7 right-6 flex size-[68px] items-center justify-center rounded-[24px] bg-[#d6531d] text-white shadow-xl lg:static lg:mt-6 lg:size-auto lg:gap-2 lg:rounded-full lg:px-6 lg:py-4"
      >
        <Plus size={30} />
        <span className="hidden lg:inline">Add Address</span>
      </button>
    </Screen>
  );
}

// 7. PANCHANG ALERTS
export function AlertsPage() {
  const [enabled, setEnabled] = useState([true, true, false, true]);
  const options = [
    ["Daily Panchang", "Get daily tithi, nakshatra and sunrise updates."],
    ["Ekadashi & Vrat", "Reminders before important vrat and fasting days."],
    ["Festival Reminders", "Upcoming Hindu festivals and celebrations."],
    ["Muhurat Alerts", "Get notified before your saved auspicious time."],
  ];

  return (
    <Screen title="Panchang Alerts" subtitle="Customize your daily spiritual reminders.">
      <Card>
        <div className="space-y-5">
          {options.map(([title, description], i) => (
            <div key={title} className="flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[#39251d]">{title}</p>
                <p className="mt-1 text-sm leading-5 text-[#82736b]">{description}</p>
              </div>
              <button
                onClick={() => setEnabled((old) => old.map((v, j) => i === j ? !v : v))}
                className={`relative h-9 w-[66px] shrink-0 rounded-full ${enabled[i] ? "bg-[#d6531d]" : "bg-[#e7e1e7]"}`}
              >
                <span className={`absolute top-1 size-7 rounded-full bg-white shadow ${enabled[i] ? "left-[34px]" : "left-1"}`} />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </Screen>
  );
}

// 8. SETTINGS
export function SettingsPage() {
  const [language, setLanguage] = useState("English");
  const [theme, setTheme] = useState("Light");

  return (
    <Screen title="Settings" subtitle="Manage your account preferences.">
      <Card>
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#39251d]">Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full rounded-xl border border-[#e6ddce] bg-white p-3 text-sm">
              <option>English</option>
              <option>हिन्दी</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#39251d]">Appearance</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full rounded-xl border border-[#e6ddce] bg-white p-3 text-sm">
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </select>
          </div>
          <Link href="/account/profile" className="flex items-center justify-between border-t border-[#eee8dc] pt-5 text-sm text-[#39251d]">
            Edit Profile <ChevronRight size={18} />
          </Link>
        </div>
      </Card>
    </Screen>
  );
}

// 9. HELP & SUPPORT
export function HelpPage() {
  const questions = [
    ["How can I cancel a booking?", "Open My Bookings, select the booking and check its cancellation options."],
    ["Where can I see payment details?", "Visit Payment History to review payment methods and transaction status."],
    ["How do I save a Muhurat?", "Open a Muhurat and tap the bookmark option to save it."],
    ["How can I contact support?", "Use the support contact details provided by MuhuratMitra."],
  ];
  const [open, setOpen] = useState(0);

  return (
    <Screen title="Help & Support" subtitle="Find answers to common questions.">
      <div className="space-y-3">
        {questions.map(([q, a], i) => (
          <Card key={q} className="p-0">
            <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-3 p-5 text-left font-medium text-[#39251d]">
              {q}
              <ChevronRight className={`shrink-0 transition ${open === i ? "rotate-90" : ""}`} size={19} />
            </button>
            {open === i && <p className="px-5 pb-5 text-sm leading-6 text-[#82736b]">{a}</p>}
          </Card>
        ))}
      </div>
    </Screen>
  );
}

// 10. PROFILE
export function ProfilePage() {
  return (
    <Screen title="My Profile" subtitle="View and manage your personal information.">
      <Card>
        <div className="flex items-center gap-4">
          <span className="flex size-16 items-center justify-center rounded-full bg-[#fbe9dc] font-display text-2xl text-[#bd6439]">
            U
          </span>
          <div>
            <h2 className="font-display text-2xl text-[#39251d]">Your Profile</h2>
            <p className="text-sm text-[#82736b]">Devotee Account</p>
          </div>
        </div>
        <p className="mt-5 text-sm text-[#82736b]">
          Connect this page to your profile API to load and update your personal details.
        </p>
      </Card>
    </Screen>
  );
}
