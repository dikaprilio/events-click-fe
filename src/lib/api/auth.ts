"use client";

import { clientFetch, ApiError } from "./client";

export interface LoginCredentials {
  username: string;
  password: string;
}

// Alias for compatibility with existing code
export type LoginRequest = LoginCredentials;

export interface AuthResponse {
  accessToken: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: "user" | "admin";
}

const AUTH_TOKEN_KEY = "admin_token";

export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
  return null;
}

export function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await clientFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  
  if (response?.accessToken) {
    setAuthToken(response.accessToken);
  }
  
  return response;
}

export async function logout(): Promise<void> {
  removeAuthToken();
}

export async function getCurrentUser(): Promise<User | null> {
  const token = getAuthToken();
  if (!token) {
    return null;
  }

  try {
    return await getProfile(token);
  } catch (error) {
    if (error instanceof ApiError && error.code === 401) {
      removeAuthToken();
    }
    return null;
  }
}

export async function getProfile(token: string): Promise<User> {
  const response = await clientFetch<User>("/profile/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}
