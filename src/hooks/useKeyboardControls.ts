import { useCallback, useEffect } from "react";

// TODO: Improve to handle other keys for different controls

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
