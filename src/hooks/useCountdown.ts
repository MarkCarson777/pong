import { useEffect } from "react";

/** useCountdown is a hook that manages a countdown timer.
 * It decrements the countdown value every second until it reaches zero.
 * When the countdown reaches zero, it sets the countdown to null and updates the paused state.
 * @param countdown - The current countdown value, or null if not active.
 * @param setCountdown - Function to update the countdown value.
 * @param isPausedRef - A reference to the paused state of the game, allowing for conditional rendering of the ball.
 */

export const useCountdown = (
  countdown: number | null,
  setCountdown: (value: number | null) => void,
  isPausedRef: React.RefObject<boolean>
) => {
  useEffect(() => {
    if (countdown === null) return;

    const timer = setTimeout(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else {
        setCountdown(null);
        isPausedRef.current = false;
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, setCountdown, isPausedRef]);
};
