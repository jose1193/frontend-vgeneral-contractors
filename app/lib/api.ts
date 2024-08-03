// lib/api.ts

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL; // Representa example.com

import { UserData } from "../types/user";

export async function fetchWithCSRF(
  url: string,
  options: RequestInit = {},
  token?: string
) {
  const csrfResponse = await fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
    method: "GET",
    credentials: "include",
  });

  const setCookieHeader = csrfResponse.headers.get("set-cookie");
  const cookies = setCookieHeader?.split(", ");

  let sessionKey, xsrfToken;
  for (const cookie of cookies || []) {
    if (cookie.startsWith("laravel_session="))
      sessionKey = cookie.split(";")[0];
    else if (cookie.startsWith("XSRF-TOKEN="))
      xsrfToken = decodeURIComponent(cookie.split(";")[0].split("=")[1]);
    if (sessionKey && xsrfToken) break;
  }

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    "X-XSRF-TOKEN": xsrfToken || "",
    Cookie: `${sessionKey}; XSRF-TOKEN=${xsrfToken}`,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  return response.json();
}

export const login = (
  credentials: Partial<{ email: string; password: string }>
) =>
  fetchWithCSRF("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

export const getUserDetails = (token: string) =>
  fetchWithCSRF("/api/user", {}, token);

export const Logout = (token: string) =>
  fetchWithCSRF(
    "/api/logout",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    token
  );

export const updateProfile = (token: string, userData: UserData) =>
  fetchWithCSRF(
    "/api/update-profile",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    },
    token
  );

export const updateProfilePhoto = (token: string, photoFile: File) => {
  const formData = new FormData();
  formData.append("profile_photo", photoFile);
  return fetchWithCSRF(
    "/api/update-profile-photo",
    {
      method: "POST",
      body: formData,
    },
    token
  );
};

export const updatePassword = (
  token: string,
  passwordData: { current_password: string; new_password: string }
) =>
  fetchWithCSRF(
    "/api/update-password",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwordData),
    },
    token
  );

export const checkEmailAvailable = (token: string, email: string) =>
  fetchWithCSRF(`/api/email-check/${email}`, {}, token);

export const checkUsernameAvailable = (token: string, username: string) =>
  fetchWithCSRF(
    `/api/username-check/${encodeURIComponent(username)}`,
    {},
    token
  );

export const forgotPassword = (email: string) =>
  fetchWithCSRF("/api/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

export const verifyResetPassword = (token: string, pin: string) =>
  fetchWithCSRF("/api/enter-pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, pin }),
  });

export const updateResetPassword = (
  token: string,
  password: string,
  password_confirmation: string
) =>
  fetchWithCSRF("/api/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password, password_confirmation }),
  });

export const checkRolesAvailable = async (token: string) => {
  const response = await fetchWithCSRF(`/api/roles-list/`, {}, token);
  // Extrae el array de roles de la respuesta
  return response;
};
