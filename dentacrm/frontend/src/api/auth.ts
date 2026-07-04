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
