
export const todayPanchang = {
  date: "2026-11-25",
  city: "Jaipur",
  state: "Rajasthan",
  timezone: "Asia/Kolkata",

  tithi: {
    name: "Shukla Panchami",
    hindi: "शुक्ल पंचमी",
    paksha: "Shukla",
  },

  nakshatra: {
    name: "Uttara Ashadha",
    hindi: "उत्तराषाढ़ा",
  },

  yoga: {
    name: "Siddha",
    hindi: "सिद्ध",
  },

  karana: {
    name: "Bava",
    hindi: "बव",
  },

  sunrise: "06:55 AM",
  sunset: "05:25 PM",

  rahuKaal: {
    start: "12:05 PM",
    end: "01:25 PM",
    display: "12:05 PM – 01:25 PM",
  },

  bestMuhurat: {
    start: "09:14 AM",
    end: "10:38 AM",
    display: "09:14 AM – 10:38 AM",
  },

  note: "Sample data for development preview. Verify actual Panchang timings before religious use.",
};

// Upcoming festivals - Sample development data
export const upcomingFestivals = [
  {
    id: "festival-001",
    name: "Geeta Jayanti",
    date: "2026-12-01",
    nameHindi: "गीता जयंती",
  },
  {
    id: "festival-002",
    name: "Mokshada Ekadashi",
    date: "2026-12-01",
    nameHindi: "मोक्षदा एकादशी",
  },
  {
    id: "festival-003",
    name: "Dattatreya Jayanti",
    date: "2026-12-04",
    nameHindi: "दत्तात्रेय जयंती",
  },
  {
    id: "festival-004",
    name: "Saphala Ekadashi",
    date: "2026-12-15",
    nameHindi: "सफला एकादशी",
  },
  {
    id: "festival-005",
    name: "Christmas",
    date: "2026-12-25",
    nameHindi: "क्रिसमस",
  },
  {
    id: "festival-006",
    name: "Pausha Purnima",
    date: "2026-12-31",
    nameHindi: "पौष पूर्णिमा",
  },
];




const TITHI_NAMES = [
  "प्रतिपदा",
  "द्वितीया",
  "तृतीया",
  "चतुर्थी",
  "पंचमी",
  "षष्ठी",
  "सप्तमी",
  "अष्टमी",
  "नवमी",
  "दशमी",
  "एकादशी",
  "द्वादशी",
  "त्रयोदशी",
  "चतुर्दशी",
  "पूर्णिमा",
];

const NAKSHATRA_NAMES = [
  "अश्विनी",
  "भरणी",
  "कृत्तिका",
  "रोहिणी",
  "मृगशिरा",
  "आर्द्रा",
  "पुनर्वसु",
  "पुष्य",
  "आश्लेषा",
  "मघा",
  "पूर्वा फाल्गुनी",
  "उत्तरा फाल्गुनी",
  "हस्त",
  "चित्रा",
  "स्वाती",
  "विशाखा",
  "अनुराधा",
  "ज्येष्ठा",
  "मूल",
  "पूर्वाषाढ़ा",
  "उत्तराषाढ़ा",
  "श्रवण",
  "धनिष्ठा",
  "शतभिषा",
  "पूर्वा भाद्रपद",
  "उत्तरा भाद्रपद",
  "रेवती",
];

const RAHU_KAAL_BY_DAY = [
  "04:30 PM – 06:00 PM",
  "07:30 AM – 09:00 AM",
  "03:00 PM – 04:30 PM",
  "12:00 PM – 01:30 PM",
  "01:30 PM – 03:00 PM",
  "10:30 AM – 12:00 PM",
  "09:00 AM – 10:30 AM",
];

/**
 * Returns mock Panchang data for a calendar month.
 * month is 1-based: January = 1, December = 12.
 */
export function getMonthPanchangMock(year, month) {
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  ) {
    throw new Error("Invalid year or month. Month must be between 1 and 12.");
  }

  const festivalMap = new Map(
    upcomingFestivals.map((festival) => [festival.date, festival.nameHindi || festival.name])
  );

  const daysInMonth = new Date(year, month, 0).getDate();

  const days = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const date = new Date(year, month - 1, day);
    const dateKey = [
      year,
      String(month).padStart(2, "0"),
      String(day).padStart(2, "0"),
    ].join("-");

    const paksha = day <= 15 ? "शुक्ल पक्ष" : "कृष्ण पक्ष";

    return {
      date: dateKey,
      day,
      tithi: `${paksha} ${TITHI_NAMES[(day - 1) % TITHI_NAMES.length]}`,
      nakshatra: NAKSHATRA_NAMES[(day - 1) % NAKSHATRA_NAMES.length],
      rahuKaal: RAHU_KAAL_BY_DAY[date.getDay()],
      festival: festivalMap.get(dateKey) || null,
    };
  });

  return { year, month, days };
}
