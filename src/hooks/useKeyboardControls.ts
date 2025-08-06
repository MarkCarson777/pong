import { useCallback, useEffect } from "react";

// TODO: Improve to handle other keys for different controls

/** useKeyboardControls is a custom hook that listens for keyboard events.
 * It triggers a callback function when the spacebar is pressed.
 * @param onSpacePress - A callback function to be called when the spacebar is pressed.
 */

export const useKeyboardControls = (onSpacePress: () => void) => {
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        onSpacePress();
      }
    },
    [onSpacePress]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);
};
