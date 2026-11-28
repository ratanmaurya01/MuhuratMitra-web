import { getMonthPanchangMock, todayPanchang, upcomingFestivals } from "@/lib/mock/panchang";
import { mockBookings } from "./mock/bookings";

// "https://rstar.alwaysdata.net/api/v1/user/register"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8100/api/v1";

export const apiCall = async ({
  endpoint,
  method = "GET",
  data = null,
  headers = {},
}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      credentials: "include",
      ...(data && { body: JSON.stringify(data) }),
    });

    const result = await response.json();
    if (!response.ok || result.success === false) {
      throw new Error(result.message || "Something went wrong");
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};


const delay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function getPanchang(city = "Jaipur") {

  return {
    ...todayPanchang,
    city,
  };
}

export async function getFestivals() {
  return [...upcomingFestivals];
}


export const getPandits = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });
  const query = params.toString();
  return apiCall({
    endpoint: `/pandits${query ? `?${query}` : ""}`,
    method: "GET",
  });
};

export async function getMonthPanchang(year, month) {
  await delay();
  return getMonthPanchangMock(year, month);
}

export async function createBooking(data) {
  await delay(500);

  return {
    bookingId: `MM${Date.now().toString().slice(-8)}`,
    status: "confirmed",
    createdAt: new Date().toISOString(),
    ...data,
  };
}

export async function askAssistant(question) {
  const query = question.trim().toLowerCase();

  const responses = [
    {
      keywords: ["satyanarayan", "satya narayan"],
      answer:
        "Satyanarayan Puja Bhagwan Vishnu ko samarpit ek pavitra puja hai. Ise aam taur par Purnima, Ekadashi ya kisi shubh avsar par kiya jata hai. Puja mein Bhagwan Vishnu ki pooja, Satyanarayan Katha ka paath aur prasad vitran shamil hota hai. Samagri mein roli, chawal, phool, tulsi, panchamrit, fruits aur prasad rakhe ja sakte hain.",
    },
    {
      keywords: ["ganesh", "ganapati", "ganpati"],
      answer:
        "Ganesh Puja kisi bhi shubh karya se pehle Bhagwan Ganesha ka aashirwad lene ke liye ki jati hai. Ismein Ganesh ji ko durva, modak, phool aur dhoop arpit kiye jate hain. Aap Ganesh mantra ka jaap karke aur aarti karke puja complete kar sakte hain.",
    },
    {
      keywords: ["griha pravesh", "house warming", "new home"],
      answer:
        "Griha Pravesh Puja naye ghar mein pravesh karne se pehle ki jati hai. Ismein Ganesh Puja, Kalash Sthapana, Vastu Puja aur havan shamil ho sakte hain. Shubh date aur muhurat ka selection karne ke liye apne city ke Panchang aur local pandit se salah lena achha rahega.",
    },
    {
      keywords: ["lakshmi", "diwali", "dhan"],
      answer:
        "Lakshmi Puja dhan, samriddhi aur sukh-shanti ke liye ki jati hai. Puja ke liye Maa Lakshmi ki murti ya photo, diya, roli, chawal, phool, sweets aur dhoop taiyar rakhein. Parampara ke anusaar saaf-safai aur pavitrata ka vishesh dhyan rakha jata hai.",
    },
    {
      keywords: ["rudrabhishek", "shiv", "maha mrityunjaya"],
      answer:
        "Rudrabhishek Bhagwan Shiv ki upasana ka ek pavitra vidhan hai. Ismein Shivling par jal, doodh, dahi, shahad aur anya samagri se abhishek kiya jata hai. Mantra jaap aur puja ki vidhi parampara ke anusaar alag ho sakti hai, isliye local pandit se confirm karna achha rahega.",
    },
    {
      keywords: ["puja samagri", "samagri", "pooja items"],
      answer:
        "Aam puja samagri mein roli, chawal, haldi, kumkum, dhoop, agarbatti, kapoor, diya, ghee, phool, paan, supari, fruits aur mithai shamil hote hain. Har puja ki samagri alag hoti hai. Aap puja ka naam batayein, main uske hisaab se checklist bata sakta hoon.",
    },
    {
      keywords: ["rahu kaal", "rahukaal"],
      answer:
        "Rahu Kaal ko Hindu Panchang mein ek ashubh samay avadhi maana jata hai. Is dauran kai log naye shubh karya ya mahatvapurn shuruaat karne se bachte hain. Iska samay har din aur location ke hisaab se badalta hai. Exact timing ke liye apne city ka daily Panchang check karein.",
    },
    {
      keywords: ["ekadashi"],
      answer:
        "Ekadashi Hindu Panchang ki ek pavitra tithi hai jo har lunar month mein do baar aati hai. Is din kai bhakt Bhagwan Vishnu ki pooja aur vrat karte hain. Vrat ke niyam aur paran ka samay alag-alag Ekadashi ke anusaar hota hai. Exact details ke liye local Panchang dekhein.",
    },
    {
      keywords: ["muhurat", "shubh samay", "auspicious"],
      answer:
        "Shubh Muhurat ka selection tithi, nakshatra, yoga, karana aur location jaise factors par depend karta hai. Aap kis kaam ke liye muhurat chahte hain aur kaunsi date ya date range dekh rahe hain? Main aapko relevant information samjha sakta hoon.",
    },
    {
      keywords: ["namaste", "hello", "hi", "namaskar"],
      answer:
        "Namaste! 🙏 Main MuhuratMitra Puja Assistant hoon. Aap puja vidhi, puja samagri, vrat, tithi, nakshatra aur Hindu parampara se jude sawal pooch sakte hain. Aaj main aapki kis tarah madad kar sakta hoon?",
    },
  ];

  const matchedResponse = responses.find((item) =>
    item.keywords.some((keyword) => query.includes(keyword))
  );

  if (matchedResponse) {
    return matchedResponse.answer;
  }

  return "Aapka sawal achha hai. Main abhi ek demo Puja Assistant hoon aur meri knowledge limited mock responses par based hai. Aap Ganesh Puja, Satyanarayan Puja, Lakshmi Puja, Griha Pravesh, Rudrabhishek, Ekadashi ya Rahu Kaal ke baare mein pooch sakte hain. Dharmik vidhi aur exact muhurat ko local Panchang ya experienced pandit se verify zaroor karein.";
}

const bookingDelay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function getBookings() {
  await bookingDelay();

  return [...mockBookings].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

export async function getBooking(id) {
  await bookingDelay();

  return mockBookings.find((booking) => booking.id === id) ?? null;
}

export async function cancelBooking(id, reason = "") {
  await bookingDelay();

  const bookingIndex = mockBookings.findIndex(
    (booking) => booking.id === id
  );

  if (bookingIndex === -1) {
    throw new Error("Booking not found.");
  }

  const booking = mockBookings[bookingIndex];

  if (!["HELD", "CONFIRMED"].includes(booking.status)) {
    throw new Error("This booking cannot be cancelled.");
  }

  const updatedBooking = {
    ...booking,
    status: "CANCELLED",
    cancellationReason: reason,
    statusTimeline: [
      ...booking.statusTimeline,
      {
        status: "CANCELLED",
        timestamp: new Date().toISOString(),
      },
    ],
  };

  mockBookings[bookingIndex] = updatedBooking;

  return updatedBooking;
}

export async function rescheduleBooking(id, date, time) {
  await bookingDelay();

  const bookingIndex = mockBookings.findIndex(
    (booking) => booking.id === id
  );

  if (bookingIndex === -1) {
    throw new Error("Booking not found.");
  }

  const booking = mockBookings[bookingIndex];

  if (!["HELD", "CONFIRMED"].includes(booking.status)) {
    throw new Error("This booking cannot be rescheduled.");
  }

  const updatedBooking = {
    ...booking,
    date,
    time,
  };

  mockBookings[bookingIndex] = updatedBooking;

  return updatedBooking;
}

