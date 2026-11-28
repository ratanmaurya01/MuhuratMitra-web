
import { apiCall } from "@/lib/api"; // apne existing apiCall import path ke according adjust karna

export const getAddresses = async () => {
    const response = await apiCall({
        endpoint: "/addresses",
        method: "GET",
    });

    return response?.data || [];
};

export const addAddress = (data) =>
    apiCall({
        endpoint: "/addresses",
        method: "POST",
        data,
    });

export const updateAddress = (id, data) =>
    apiCall({
        endpoint: `/addresses/${id}`,
        method: "PUT",
        data,
    });

export const setDefaultAddress = (id) =>
    apiCall({
        endpoint: `/addresses/${id}/default`,
        method: "PATCH",
    });

export const deleteAddress = (id) =>
    apiCall({
        endpoint: `/addresses/${id}`,
        method: "DELETE",
    });