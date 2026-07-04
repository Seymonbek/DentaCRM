import { useEffect, useState } from "react";

/**
 * Debounce a fast-changing value (typically a search-box input). The
 * hook re-renders only when the debounced value settles, so hooks that
 * depend on it (TanStack Query) do not thrash on every keystroke.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const handle = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(handle);
  }, [value, delayMs]);
  return debounced;
}
