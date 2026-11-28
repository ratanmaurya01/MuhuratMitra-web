import { apiCall } from "@/lib/api";

export const getPujaById = async (id) => {
    const response = await apiCall({
        endpoint: `/pujas/${id}`,
        method: "GET",
    });
    return response?.data || null;
};


export const getPuja = async () => {
    const response = await apiCall({
        endpoint: `/pujas`,
        method: "GET",
    });
    return response?.data || null;
};





