import { describe, expect, it } from "vitest";

import { normaliseApiError, tokenBridge } from "@/api/client";
import type { ApiErrorPayload } from "@/types";

describe("tokenBridge", () => {
  it("stores and retrieves tokens", () => {
    tokenBridge.set({ access: "a", refresh: "r" });
    expect(tokenBridge.getAccess()).toBe("a");
    expect(tokenBridge.getRefresh()).toBe("r");
  });

  it("clears both tokens together", () => {
    tokenBridge.set({ access: "a", refresh: "r" });
    tokenBridge.clear();
    expect(tokenBridge.getAccess()).toBeNull();
    expect(tokenBridge.getRefresh()).toBeNull();
  });

  it("notifies subscribers when tokens change", () => {
    const events: (string | null)[] = [];
    const unsubscribe = tokenBridge.subscribe((v) => events.push(v));
    tokenBridge.set({ access: "x", refresh: "y" });
    tokenBridge.clear();
    unsubscribe();
    tokenBridge.set({ access: "z", refresh: "z" });
    expect(events).toEqual(["x", null]);
  });
});

describe("normaliseApiError", () => {
  it("passes through the backend envelope when present", () => {
    const err = {
      isAxiosError: true,
      response: {
        data: {
          error: { code: "VALIDATION_ERROR", message: "Xato", details: {} },
        },
      },
    };
    const result: ApiErrorPayload = normaliseApiError(err);
    expect(result.error.code).toBe("VALIDATION_ERROR");
    expect(result.error.message).toBe("Xato");
  });

  it("synthesises an envelope for unknown errors", () => {
    const result = normaliseApiError(new Error("boom"));
    expect(result.error.code).toBe("UNKNOWN");
    expect(result.error.message).toBe("boom");
  });
});
