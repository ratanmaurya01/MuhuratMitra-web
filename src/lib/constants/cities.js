
export const CITIES = [
    { value: "all", label: "सभी शहर" },
    { value: "Jaipur", label: "Jaipur" },
    { value: "Delhi", label: "Delhi" },
    { value: "Varanasi", label: "Varanasi" },
    { value: "Mumbai", label: "Mumbai" },
];

export const CITY_OPTIONS = CITIES.filter(
    (city) => city.value !== "all"
);
