import { useCallback, useEffect, useRef, useState } from 'react';

const VISIBLE_MS = 5000;

/**
 * Holds a single snackbar message that hides itself after 5 seconds.
 * Showing a new one replaces the current one and restarts the timer.
 */
export function useSnackbar() {
  const [snackbar, setSnackbar] = useState(null);
  const timer = useRef();

  const dismiss = useCallback(() => {
    clearTimeout(timer.current);
    setSnackbar(null);
  }, []);

  const show = useCallback((next) => {
    clearTimeout(timer.current);
    setSnackbar(next);
    timer.current = setTimeout(() => setSnackbar(null), VISIBLE_MS);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return { snackbar, show, dismiss };
}
