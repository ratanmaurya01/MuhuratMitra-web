
import { apiCall } from "@/lib/api";

export const getPanditProfile = () =>
    apiCall({
        endpoint: "/pandit/profile",
        method: "GET",
    });

export const savePanditProfile = (data) =>
    apiCall({
        endpoint: "/pandit/profile",
        method: "POST",
        data,
    });


export const getPanditServices = () =>
    apiCall({
        endpoint: "/pandit/services",
        method: "GET",
    });

export const addPanditService = (data) =>
    apiCall({
        endpoint: "/pandit/services",
        method: "POST",
        data,
    });

export const updatePanditService = (id, data) =>
    apiCall({
        endpoint: `/pandit/services/${id}`,
        method: "PUT",
        data,
    });

export const deletePanditService = (id) =>
    apiCall({
        endpoint: `/pandit/services/${id}`,
        method: "DELETE",
    });

export const updatePanditServiceStatus = (id, status) =>
    apiCall({
        endpoint: `/pandit/services/${id}/status`,
        method: "PATCH",
        data: { status },
    });


export const getPanditById = (panditId) =>
    apiCall({
        endpoint: `/public/pandits/${panditId}`,
        method: "GET",
    });




