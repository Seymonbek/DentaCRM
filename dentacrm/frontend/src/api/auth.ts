import { request } from "./client";
import type { TokenPair, User } from "@/types";

export interface LoginPayload {
  phoneNumber: string;
  password: string;
}

/** POST /auth/login/ */
export function login(payload: LoginPayload): Promise<TokenPair> {
  return request<TokenPair>({
    method: "POST",
    url: "/auth/login/",
    data: payload,
  });
}

/** GET /auth/me/ */
export function fetchMe(): Promise<User> {
  return request<User>({
    method: "GET",
    url: "/auth/me/",
  });
}

/** POST /auth/refresh/ */
export function refreshTokens(refresh: string): Promise<TokenPair> {
  return request<TokenPair>({
    method: "POST",
    url: "/auth/refresh/",
    data: { refresh },
  });
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  telegramChatId?: number | null;
}

/** PATCH /auth/me/ */
export function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  return request<User>({
    method: "PATCH",
    url: "/auth/me/",
    data: payload,
  });
}

export interface Toggle2faResponse {
  detail: string;
  twoFactorEnabled: boolean;
}

/** POST /auth/2fa/enable/ */
export function enable2FA(password: string): Promise<Toggle2faResponse> {
  return request<Toggle2faResponse>({
    method: "POST",
    url: "/auth/2fa/enable/",
    data: { password },
  });
}

/** POST /auth/2fa/disable/ */
export function disable2FA(password: string): Promise<Toggle2faResponse> {
  return request<Toggle2faResponse>({
    method: "POST",
    url: "/auth/2fa/disable/",
    data: { password },
  });
}
