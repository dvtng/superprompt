// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T {
  let timeoutId: number | null = null;

  return ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  }) as T;
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("debounce", async () => {
    let counter = 0;

    const increment = () => {
      counter++;
    };

    const debouncedIncrement = debounce(increment, 100);

    // Call the debounced function multiple times in quick succession
    debouncedIncrement();
    debouncedIncrement();
    debouncedIncrement();
    debouncedIncrement();
    debouncedIncrement();
    debouncedIncrement();

    expect(counter).toBe(0);

    // Wait for the debounce delay to pass
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(counter).toBe(1);
        resolve();
      }, 100);
    });
  });
}
