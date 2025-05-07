import {effect, signal, Signal} from '@angular/core';

export function debouncedSignal<T>(input: Signal<T>, timeOutMs = 0): Signal<T> {
  const debounceSignal = signal(input());
  effect(() => {
    const value = input();
    const timeout = setTimeout(() => {
      debounceSignal.set(value);
    }, timeOutMs);
    return () => {
      clearTimeout(timeout);
    };
  });
  return debounceSignal;
}
