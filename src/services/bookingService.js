
import { apiCall } from "@/lib/api";

export const getPublicPanditServices = (panditId) =>
    apiCall({
        endpoint: `/public/pandits/${panditId}/services`,
        method: "GET",
    });

export const submitBooking = (data) =>
    apiCall({
        endpoint: "/bookings",
        method: "POST",
        data,
    });


export const getMyBookings = () =>
    apiCall({
        endpoint: "/bookings/my-bookings",
        method: "GET",
    });



export const getPanditBookings = () =>
    apiCall({
        endpoint: "/pandit/bookings",
        method: "GET",
    });

export const updatePanditBookingStatus = (bookingId, status) =>
    apiCall({
        endpoint: `/pandit/bookings/${bookingId}/status`,
        method: "PATCH",
        data: { status },
    });
