
export const pandits = [
  {
    id: "pandit-001",
    name: "Pandit Ramesh Sharma",
    city: "Jaipur",
    image: "/images/pandits/ramesh-sharma.jpg",
    languages: ["Hindi", "Sanskrit"],
    rating: 4.9,
    reviewCount: 3,
    experienceYears: 18,
    verified: true,
    dakshina: 2500,

    specializations: [
      "Griha Pravesh",
      "Rudrabhishek",
      "Satyanarayan"
    ],

    description:
      "Experienced Vedic Pandit specializing in traditional Hindu rituals and family ceremonies. Dedicated to performing authentic Vedic pujas with proper mantras and rituals.",

    availableSlots: [
      {
        date: "2026-11-26",
        startTime: "09:00 AM",
        endTime: "11:00 AM"
      },
      {
        date: "2026-11-27",
        startTime: "10:00 AM",
        endTime: "12:00 PM"
      }
    ],

    reviews: [
      {
        id: "review-001",
        userName: "Meera & Siddharth Tiwari",
        pujaName: "Griha Pravesh Puja",
        date: "14 Nov 2026",
        rating: 5,
        tags: ["Punctual", "Knowledgeable", "Clear explanation"],
        comment:
          "Pandit Ji arrived on time and guided our entire family through every Sankalp with calm clarity. The puja experience was wonderful.",
        images: ["/images/reviews/griha-pravesh.jpg"]
      },
      {
        id: "review-002",
        userName: "Ankit Mishra",
        pujaName: "Rudrabhishek",
        date: "06 Nov 2026",
        rating: 5,
        tags: ["Knowledgeable", "Polite"],
        comment:
          "Very knowledgeable Pandit. All mantras and rituals were performed beautifully.",
        images: []
      },
      {
        id: "review-003",
        userName: "Priya Verma",
        pujaName: "Satyanarayan Katha",
        date: "29 Oct 2026",
        rating: 4,
        tags: ["Polite", "Clear explanation"],
        comment:
          "Very peaceful experience. Pandit Ji explained every ritual in simple Hindi.",
        images: []
      }
    ]
  },

  {
    id: "pandit-002",
    name: "Pandit Suresh Joshi",
    city: "Jaipur",
    image: "/images/pandits/suresh-joshi.jpg",
    languages: ["Hindi", "Sanskrit", "English"],
    rating: 4.8,
    reviewCount: 5,
    experienceYears: 15,
    verified: true,
    dakshina: 2800,

    specializations: [
      "Ganesh Puja",
      "Vastu Shanti",
      "Satyanarayan",
      "Navgraha Shanti"
    ],

    description:
      "Experienced priest known for authentic Vedic rituals and clear explanations. Specializes in household ceremonies, Vastu Shanti and traditional pujas.",

    availableSlots: [
      {
        date: "2026-11-26",
        startTime: "08:00 AM",
        endTime: "10:00 AM"
      },
      {
        date: "2026-11-28",
        startTime: "04:00 PM",
        endTime: "06:00 PM"
      }
    ],

    reviews: [
      {
        id: "review-004",
        userName: "Rahul Sharma",
        pujaName: "Ganesh Puja",
        date: "15 Nov 2026",
        rating: 5,
        tags: ["Punctual", "Knowledgeable"],
        comment:
          "Excellent puja experience. Every ritual was explained properly.",
        images: []
      },
      {
        id: "review-005",
        userName: "Neha Gupta",
        pujaName: "Vastu Shanti",
        date: "10 Nov 2026",
        rating: 5,
        tags: ["Polite", "Professional"],
        comment:
          "Very professional and knowledgeable Pandit. Highly satisfied.",
        images: []
      },
      {
        id: "review-006",
        userName: "Amit Jain",
        pujaName: "Satyanarayan Katha",
        date: "04 Nov 2026",
        rating: 5,
        tags: ["Clear explanation"],
        comment:
          "The entire ceremony was conducted beautifully.",
        images: []
      },
      {
        id: "review-007",
        userName: "Pooja Mehta",
        pujaName: "Ganesh Puja",
        date: "28 Oct 2026",
        rating: 4,
        tags: ["Knowledgeable"],
        comment:
          "Good experience and very peaceful puja.",
        images: []
      },
      {
        id: "review-008",
        userName: "Karan Singh",
        pujaName: "Navgraha Shanti",
        date: "20 Oct 2026",
        rating: 5,
        tags: ["Punctual", "Polite"],
        comment:
          "Wonderful experience with proper Vedic chanting.",
        images: []
      }
    ]
  },

  {
    id: "pandit-003",
    name: "Pandit Mohan Lal Vyas",
    city: "Delhi",
    image: "/images/pandits/mohan-lal.jpg",
    languages: ["Hindi", "Sanskrit"],
    rating: 4.7,
    reviewCount: 4,
    experienceYears: 12,
    verified: true,
    dakshina: 2200,

    specializations: [
      "Griha Pravesh",
      "Ganapathi Homam",
      "Naamkaran",
      "Vivah Puja"
    ],

    description:
      "Dedicated Vedic Pandit offering traditional puja services and guidance. Experienced in family ceremonies and Sanskrit chanting.",

    availableSlots: [
      {
        date: "2026-11-27",
        startTime: "09:00 AM",
        endTime: "11:00 AM"
      }
    ],

    reviews: [
      {
        id: "review-009",
        userName: "Rohit Verma",
        pujaName: "Griha Pravesh",
        date: "12 Nov 2026",
        rating: 5,
        tags: ["Punctual", "Professional"],
        comment:
          "Very good experience. All rituals were performed according to tradition.",
        images: []
      },
      {
        id: "review-010",
        userName: "Anjali Kapoor",
        pujaName: "Naamkaran",
        date: "05 Nov 2026",
        rating: 5,
        tags: ["Polite", "Knowledgeable"],
        comment:
          "Pandit Ji explained all the rituals very nicely.",
        images: []
      },
      {
        id: "review-011",
        userName: "Vikas Sharma",
        pujaName: "Ganapathi Homam",
        date: "30 Oct 2026",
        rating: 4,
        tags: ["Knowledgeable"],
        comment:
          "Good traditional puja experience.",
        images: []
      },
      {
        id: "review-012",
        userName: "Sneha Gupta",
        pujaName: "Vivah Puja",
        date: "18 Oct 2026",
        rating: 5,
        tags: ["Punctual", "Clear explanation"],
        comment:
          "Very nice and organized ceremony.",
        images: []
      }
    ]
  },

  {
    id: "pandit-004",
    name: "Pandit Anil Tripathi",
    city: "Varanasi",
    image: "/images/pandits/anil-tripathi.jpg",
    languages: ["Hindi", "Sanskrit", "Bhojpuri"],
    rating: 4.9,
    reviewCount: 8,
    experienceYears: 22,
    verified: true,
    dakshina: 3500,

    specializations: [
      "Rudrabhishek",
      "Maha Mrityunjaya Jaap",
      "Kaal Sarp Dosh Puja",
      "Navgraha Shanti"
    ],

    description:
      "Senior Vedic scholar specializing in traditional rituals and Sanskrit chanting. Experienced in ancient Vedic ceremonies and religious practices.",

    availableSlots: [
      {
        date: "2026-11-26",
        startTime: "07:00 AM",
        endTime: "09:00 AM"
      },
      {
        date: "2026-11-29",
        startTime: "10:00 AM",
        endTime: "12:00 PM"
      }
    ],

    reviews: [
      {
        id: "review-013",
        userName: "Aditya Singh",
        pujaName: "Rudrabhishek",
        date: "16 Nov 2026",
        rating: 5,
        tags: ["Knowledgeable", "Punctual"],
        comment:
          "Outstanding knowledge of Vedic mantras and traditional rituals.",
        images: []
      },
      {
        id: "review-014",
        userName: "Shivani Mishra",
        pujaName: "Maha Mrityunjaya Jaap",
        date: "12 Nov 2026",
        rating: 5,
        tags: ["Polite", "Professional"],
        comment:
          "Very peaceful experience. Pandit Ji performed every ritual with dedication.",
        images: []
      },
      {
        id: "review-015",
        userName: "Manish Tiwari",
        pujaName: "Kaal Sarp Dosh Puja",
        date: "08 Nov 2026",
        rating: 5,
        tags: ["Knowledgeable"],
        comment:
          "Very experienced and knowledgeable Pandit.",
        images: []
      },
      {
        id: "review-016",
        userName: "Kavita Sharma",
        pujaName: "Navgraha Shanti",
        date: "03 Nov 2026",
        rating: 5,
        tags: ["Punctual", "Clear explanation"],
        comment:
          "All procedures were explained properly.",
        images: []
      },
      {
        id: "review-017",
        userName: "Deepak Gupta",
        pujaName: "Rudrabhishek",
        date: "28 Oct 2026",
        rating: 5,
        tags: ["Professional"],
        comment:
          "Excellent traditional puja experience.",
        images: []
      },
      {
        id: "review-018",
        userName: "Neeraj Pandey",
        pujaName: "Maha Mrityunjaya Jaap",
        date: "23 Oct 2026",
        rating: 5,
        tags: ["Knowledgeable"],
        comment:
          "Very good Vedic chanting and guidance.",
        images: []
      },
      {
        id: "review-019",
        userName: "Ritika Verma",
        pujaName: "Rudrabhishek",
        date: "18 Oct 2026",
        rating: 4,
        tags: ["Polite"],
        comment:
          "Good experience and well organized ceremony.",
        images: []
      },
      {
        id: "review-020",
        userName: "Sanjay Mishra",
        pujaName: "Navgraha Shanti",
        date: "10 Oct 2026",
        rating: 5,
        tags: ["Punctual", "Professional"],
        comment:
          "Very satisfied with the entire puja arrangement.",
        images: []
      }
    ]
  },

  {
    id: "pandit-005",
    name: "Pandit Rajesh Mishra",
    city: "Mumbai",
    image: "/images/pandits/rajesh-mishra.jpg",
    languages: ["Hindi", "Marathi", "Sanskrit"],
    rating: 4.6,
    reviewCount: 3,
    experienceYears: 10,
    verified: true,
    dakshina: 2800,

    specializations: [
      "Ganesh Lakshmi Puja",
      "Satyanarayan",
      "Griha Pravesh"
    ],

    description:
      "Experienced priest offering household pujas and traditional ceremonies. Specializes in Ganesh Lakshmi Puja and family rituals.",

    availableSlots: [
      {
        date: "2026-11-27",
        startTime: "08:00 AM",
        endTime: "10:00 AM"
      }
    ],

    reviews: [
      {
        id: "review-021",
        userName: "Aarav Patel",
        pujaName: "Ganesh Lakshmi Puja",
        date: "13 Nov 2026",
        rating: 5,
        tags: ["Punctual", "Polite"],
        comment:
          "Very nice puja arrangement and traditional chanting.",
        images: []
      },
      {
        id: "review-022",
        userName: "Simran Kaur",
        pujaName: "Satyanarayan Katha",
        date: "05 Nov 2026",
        rating: 4,
        tags: ["Knowledgeable"],
        comment:
          "Pandit Ji was very helpful and explained the puja.",
        images: []
      },
      {
        id: "review-023",
        userName: "Rohan Shah",
        pujaName: "Griha Pravesh",
        date: "25 Oct 2026",
        rating: 5,
        tags: ["Professional", "Punctual"],
        comment:
          "Excellent experience with proper traditional rituals.",
        images: []
      }
    ]
  },

  {
    id: "pandit-006",
    name: "Pandit Deepak Acharya",
    city: "Jaipur",
    image: "/images/pandits/deepak-acharya.jpg",
    languages: ["Hindi", "Sanskrit", "English"],
    rating: 4.5,
    reviewCount: 2,
    experienceYears: 8,
    verified: false,
    dakshina: 1800,

    specializations: [
      "Vivah Puja",
      "Naamkaran",
      "Sundarkand",
      "Hanuman Chalisa"
    ],

    description:
      "Devotional Pandit specializing in family ceremonies and traditional pujas. Provides guidance for various Hindu religious occasions.",

    availableSlots: [
      {
        date: "2026-11-28",
        startTime: "09:00 AM",
        endTime: "11:00 AM"
      }
    ],

    reviews: [
      {
        id: "review-024",
        userName: "Kunal Sharma",
        pujaName: "Vivah Puja",
        date: "11 Nov 2026",
        rating: 5,
        tags: ["Polite", "Knowledgeable"],
        comment:
          "Very good experience. Pandit Ji performed the wedding rituals nicely.",
        images: []
      },
      {
        id: "review-025",
        userName: "Nisha Verma",
        pujaName: "Naamkaran",
        date: "02 Nov 2026",
        rating: 4,
        tags: ["Clear explanation"],
        comment:
          "Good puja experience and helpful guidance.",
        images: []
      }
    ]
  }
];
