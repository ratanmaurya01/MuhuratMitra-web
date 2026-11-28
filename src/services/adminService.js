

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




// ================= USER MANAGEMENT =================

// GET ALL USERS
export const getAllUsers = async () => {
    const response = await apiCall({
        endpoint: "/admin/users",
        method: "GET",
    });
    return response?.data ?? response;
};

// GET USER BY ID
export const getUserById = async (id) => {
    const response = await apiCall({
        endpoint: `/admin/users/${id}`,
        method: "GET",
    });

    return response?.data ?? response;
};

// UPDATE USER STATUS
export const updateUserStatus = async (id, status) => {
    const response = await apiCall({
        endpoint: `/admin/users/${id}/status`,
        method: "PATCH",
        data: {
            status: status.toUpperCase(),
        },
    });

    return response?.data ?? response;
};


export const getAllPujas = async () => {
    const response = await apiCall({
        endpoint: "/pujas",
        method: "GET",
    });
    return response?.data ?? response;
};

export const getPujaById = async (id) => {
    const response = await apiCall({
        endpoint: `/admin/pujas/${id}`,
        method: "GET",
    });
    return response?.data ?? response;
};

export const createPuja = async (payload) => {
    const response = await apiCall({
        endpoint: "/admin/pujas",
        method: "POST",
        data: payload,
    });

    return response?.data ?? response;
};

export const updatePuja = async (id, payload) => {
    const response = await apiCall({
        endpoint: `/admin/pujas/${id}`,
        method: "PUT",
        data: payload,
    });

    return response?.data ?? response;
};

export const deletePuja = async (id) => {
    const response = await apiCall({
        endpoint: `/admin/pujas/${id}`,
        method: "DELETE",
    });

    return response?.data ?? response;
};


/// All booking management
export const getAllBookings = async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.append(key, value);
        }
    });

    const query = params.toString();
    const response = await apiCall({
        endpoint: `/admin/bookings${query ? `?${query}` : ""}`,
        method: "GET",
    });

    // Return complete response including pagination
    return response;
};


export const getAdminBookingById = async (id) => {
    const response = await apiCall({
        endpoint: `/admin/bookings/${id}`,
        method: "GET",
    });

    return response?.data ?? response;
};

export const updateAdminBookingStatus = async (id, status) => {
    const response = await apiCall({
        endpoint: `/admin/bookings/${id}/status`,
        method: "PATCH",
        data: { status },
    });

    return response?.data ?? response;
};






export const getAllPayments = async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.append(key, value);
        }
    });
    const query = params.toString();
    const response = await apiCall({
        endpoint: `/admin/payments${query ? `?${query}` : ""}`,
        method: "GET",
    });
    return response?.data ?? response;
};


export const getAdminPaymentById = async (id) => {
    const response = await apiCall({
        endpoint: `/admin/payments/${id}`,
        method: "GET",
    });
    return response?.data ?? response;
};





