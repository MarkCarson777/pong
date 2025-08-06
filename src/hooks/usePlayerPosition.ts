import type { RefObject } from "react";
import { CANVAS, PADDLE } from "../constants/gameConstants";

/**
 * usePlayerPosition is a hook to handle player paddle position based on mouse movement.
 * It updates the paddle's Y position and triggers a re-render when the mouse moves.
 * @param canvasRef - A reference to the HTML canvas element where the game will be rendered.
 * @param playerYRef - Reference to the player's Y position.
 * @param setRenderTrigger - Function to trigger a re-render.
 * @returns An object containing the mouse movement handler.
 */

export const usePlayerPosition = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  playerYRef: RefObject<number>,
  setRenderTrigger: React.Dispatch<React.SetStateAction<number>>
) => {
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get the mouse position relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;

    // Ensure the paddle stays within the canvas bounds
    playerYRef.current = Math.max(
      0,
      Math.min(mouseY, CANVAS.HEIGHT - PADDLE.HEIGHT)
    );

    // Trigger a re-render to update paddle position immediately
    setRenderTrigger((prev) => prev + 1);
  };

  return { handleMouseMove };
};
