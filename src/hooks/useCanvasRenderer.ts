import { useEffect } from "react";
import type { GameState } from "../types/GameState";

// Canvas constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
// Paddle constants
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
// Ball constants
const BALL_SIZE = 12;

export const useCanvasRenderer = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  gameState: GameState,
  countdown: number | null,
  renderTrigger: number,
  playerYRef: React.RefObject<number>,
  isPausedRef: React.RefObject<boolean>
) => {
  // Draw the game state on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    // Clear the canvas
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw countdown if active
    if (countdown !== null && countdown > 0) {
      context.fillStyle = "white";
      context.font = "48px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(
        countdown.toString(),
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2
      );
    }

    // Draw the player paddle
    context.fillStyle = "white";
    context.fillRect(0, playerYRef.current, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw the computer paddle
    context.fillRect(
      CANVAS_WIDTH - PADDLE_WIDTH,
      gameState.computerY,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    );

    // Draw the ball
    if (isPausedRef.current === false || countdown === 0) {
      context.beginPath();
      context.arc(
        gameState.ballX + BALL_SIZE / 2,
        gameState.ballY + BALL_SIZE / 2,
        BALL_SIZE / 2,
        0,
        Math.PI * 2
      );
      context.fill();
    }
  }, [gameState, countdown, renderTrigger, canvasRef, playerYRef, isPausedRef]);
};
