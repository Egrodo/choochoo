import React, { useState, useEffect } from 'react';

export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Update debounced value after delay.
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if the value changes before the delay, or if unmounted.
      return () => clearTimeout(handler);
    },
    [value, delay]
  );
  return debouncedValue;
}
