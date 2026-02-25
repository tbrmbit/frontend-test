import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useDebounce } from "./useDebounce";

describe("Hook: useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("deve retornar o valor inicial imediatamente", () => {
    const { result } = renderHook(() => useDebounce("teste", 300));
    expect(result.current).toBe("teste");
  });

  it("deve atualizar o valor apenas após o delay especificado", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "inicial", delay: 300 } },
    );

    rerender({ value: "atualizado", delay: 300 });

    expect(result.current).toBe("inicial");

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe("inicial");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("atualizado");
  });
});
