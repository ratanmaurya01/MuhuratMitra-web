
const TITHIS = [
  "शुक्ल प्रतिपदा",
  "शुक्ल तृतीया",
  "शुक्ल पंचमी",
  "शुक्ल सप्तमी",
  "शुक्ल दशमी",
  "शुक्ल एकादशी",
  "शुक्ल त्रयोदशी",
  "कृष्ण द्वितीया",
  "कृष्ण पंचमी",
  "कृष्ण अष्टमी",
  "कृष्ण दशमी",
  "कृष्ण एकादशी",
];

const NAKSHATRAS = [
  "रोहिणी",
  "मृगशिरा",
  "पुष्य",
  "हस्त",
  "चित्रा",
  "अनुराधा",
  "उत्तराषाढ़ा",
  "श्रवण",
  "रेवती",
  "अश्विनी",
  "मघा",
  "स्वाती",
];

const YOGAS = [
  "सिद्ध योग",
  "शुभ योग",
  "अमृत सिद्धि योग",
  "सौभाग्य योग",
  "धृति योग",
  "शोभन योग",
];

const KARANAS = [
  "बव",
  "बालव",
  "कौलव",
  "तैतिल",
  "गर",
  "वणिज",
];

const TIME_WINDOWS = [
  { start: "06:30 AM", end: "08:15 AM" },
  { start: "08:45 AM", end: "10:30 AM" },
  { start: "10:45 AM", end: "12:15 PM" },
  { start: "01:45 PM", end: "03:15 PM" },
  { start: "04:00 PM", end: "05:30 PM" },
];

const TIMELINE = [
  { start: "06:00 AM", end: "07:30 AM", type: "safe", label: "शुभ समय" },
  { start: "07:30 AM", end: "09:00 AM", type: "caution", label: "सावधानी" },
  { start: "09:00 AM", end: "12:00 PM", type: "safe", label: "शुभ समय" },
  { start: "12:00 PM", end: "01:30 PM", type: "avoid", label: "राहु काल" },
  { start: "01:30 PM", end: "04:30 PM", type: "safe", label: "शुभ समय" },
  { start: "04:30 PM", end: "06:00 PM", type: "caution", label: "सावधानी" },
];

function createSeed(value) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function seededNumber(seed, index) {
  let value = (seed + Math.imul(index + 1, 2654435761)) >>> 0;

  value ^= value >>> 16;
  value = Math.imul(value, 2246822507);
  value ^= value >>> 13;
  value = Math.imul(value, 3266489909);
  value ^= value >>> 16;

  return value >>> 0;
}

function getScore(seed) {
  return 55 + (seededNumber(seed, 0) % 46);
}

/**
 * MOCK MUHURAT ENGINE
 *
 * TODO:
 * Replace this deterministic mock calculation with a real,
 * location-aware Panchang calculation/API.
 *
 * Real calculation should consider:
 * - Sunrise and sunset
 * - Tithi and Nakshatra transitions
 * - Yoga and Karana
 * - Rahu Kaal, Yamaganda and Gulika
 * - Local timezone and geographical coordinates
 * - Event-specific Muhurat rules
 */
export function getMuhuratResult({ event, date, city }) {
  if (!event || !date || !city) {
    throw new Error("Event, date and city are required.");
  }

  const seed = createSeed(`${date}|${event}|${city}`);

  const score = getScore(seed);
  const timeIndex = seededNumber(seed, 1) % TIME_WINDOWS.length;

  const tithi = TITHIS[seededNumber(seed, 2) % TITHIS.length];
  const nakshatra =
    NAKSHATRAS[seededNumber(seed, 3) % NAKSHATRAS.length];
  const yoga = YOGAS[seededNumber(seed, 4) % YOGAS.length];
  const karana = KARANAS[seededNumber(seed, 5) % KARANAS.length];

  return {
    date,
    event,
    city,
    score,
    bestTime: TIME_WINDOWS[timeIndex],
    tithi,
    nakshatra,
    yoga,
    karana,
    timeline: TIMELINE,
    doList: [
      "पूजा से पहले स्नान करके स्वच्छ वस्त्र पहनें।",
      "कार्य शुरू करने से पहले गणेश जी का स्मरण करें।",
      "आवश्यक पूजा सामग्री पहले से तैयार रखें।",
      "स्थानीय पंचांग से शुभ समय की पुष्टि करें।",
    ],
    dontList: [
      "राहु काल में शुभ कार्य शुरू न करें।",
      "जल्दबाजी में पूजा या अनुष्ठान न करें।",
      "अशुद्ध या अव्यवस्थित स्थान पर पूजा न करें।",
      "केवल mock score के आधार पर अंतिम निर्णय न लें।",
    ],
  };
}

/**
 * Generate and rank all dates in a date range.
 * Date format: YYYY-MM-DD
 */
export function getMuhuratDateComparisons({ event, city, startDate, endDate }) {
  if (!event || !city || !startDate || !endDate) {
    return [];
  }

  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end < start
  ) {
    return [];
  }

  const dayDifference = Math.floor(
    (end.getTime() - start.getTime()) / 86400000
  );

  if (dayDifference > 29) {
    throw new Error("Date range cannot exceed 30 days.");
  }

  const results = [];

  for (let offset = 0; offset <= dayDifference; offset += 1) {
    const date = new Date(start.getTime() + offset * 86400000)
      .toISOString()
      .slice(0, 10);

    results.push(getMuhuratResult({ event, date, city }));
  }

  return results.sort(
    (first, second) => second.score - first.score
  );
}

