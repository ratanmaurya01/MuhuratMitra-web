import { apiCall } from "@/lib/api";
export const registerUser = (data) =>
    apiCall({
        endpoint: "/user/register",
        method: "POST",
        data,
    });

export const loginUser = (data) =>
    apiCall({
        endpoint: "/user/login",
        method: "POST",
        data,
    });

export const getProfile = () =>
    apiCall({
        endpoint: "/user/profile",
        method: "GET",
    });

export const logoutUser = () =>
    apiCall({
        endpoint: "/user/logout",
        method: "POST",
    });
