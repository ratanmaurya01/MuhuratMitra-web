

import { apiCall } from "@/lib/api";

export const getFamily = async () => {
    const response = await apiCall({
        endpoint: "/family",
        method: "GET",
    });

    const result = response?.data ?? response;

    return Array.isArray(result) ? result : result?.data || [];
};

export const addFamilyMember = async (data) => {
    return apiCall({
        endpoint: "/family",
        method: "POST",
        data,
    });
};

export const updateFamilyMember = async (id, data) => {
    return apiCall({
        endpoint: `/family/${id}`,
        method: "PUT",
        data,
    });
};

export const deleteFamilyMember = async (id) => {
    return apiCall({
        endpoint: `/family/${id}`,
        method: "DELETE",
    });
};

export const addFamilyReminder = async (memberId, data) => {
    return apiCall({
        endpoint: `/family/${memberId}/reminders`,
        method: "POST",
        data,
    });
};

export const toggleFamilyReminder = async (id, enabled) => {
    return apiCall({
        endpoint: `/family/reminders/${id}/toggle`,
        method: "PATCH",
        data: { enabled },
    });
};

export const deleteFamilyReminder = async (id) => {
    return apiCall({
        endpoint: `/family/reminders/${id}`,
        method: "DELETE",
    });
};
