

import { apiCall } from "@/lib/api";


export const getAllPandits = (status = "all") =>
    apiCall({
        endpoint: `/admin/pandits?status=${status}`,
        method: "GET",
    });
    
// Get all pending Pandits
export const getPendingPandits = () =>
    apiCall({
        endpoint: "/admin/pandits/pending",
        method: "GET",
    });

// Get Pandit details
export const getPanditById = (id) =>
    apiCall({
        endpoint: `/admin/pandits/${id}`,
        method: "GET",
    });

// Approve Pandit
export const approvePandit = (id) =>
    apiCall({
        endpoint: `/admin/pandits/${id}/approve`,
        method: "PATCH",
    });

// Reject Pandit
export const rejectPandit = (id) =>
    apiCall({
        endpoint: `/admin/pandits/${id}/reject`,
        method: "PATCH",
    });
