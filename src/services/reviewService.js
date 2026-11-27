import { apiCall } from "@/lib/api";

export const createReview = (data) =>
    apiCall({
        endpoint: "/reviews",
        method: "POST",
        data,
    });

export const getPanditReviews = (panditId) =>
    apiCall({
        endpoint: `/reviews/pandit/${panditId}/reviews`,
        method: "GET",
    });

export const getPanditRating = (panditId) =>
    apiCall({
        endpoint: `/reviews/pandit/${panditId}/rating`,
        method: "GET",
    });