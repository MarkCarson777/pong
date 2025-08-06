import { useEffect } from "react";
import type { GameState } from "../types/GameState";
import { CANVAS, PADDLE, BALL } from "../constants/gameConstants";

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
    context.clearRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);

    // Draw countdown if active
    if (countdown !== null && countdown > 0) {
      context.fillStyle = "white";
      context.font = "48px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(
        countdown.toString(),
        CANVAS.WIDTH / 2,
        CANVAS.HEIGHT / 2
      );
    }

    // Draw the player paddle
    context.fillStyle = "white";
    context.fillRect(0, playerYRef.current, PADDLE.WIDTH, PADDLE.HEIGHT);

    // Draw the computer paddle
    context.fillRect(
      CANVAS.WIDTH - PADDLE.WIDTH,
      gameState.computerY,
      PADDLE.WIDTH,
      PADDLE.HEIGHT
    );

    // Draw the ball
    if (isPausedRef.current === false || countdown === 0) {
      context.beginPath();
      context.arc(
        gameState.ballX + BALL.SIZE / 2,
        gameState.ballY + BALL.SIZE / 2,
        BALL.SIZE / 2,
        0,
        Math.PI * 2
      );
      context.fill();
    }
  }, [gameState, countdown, renderTrigger, canvasRef, playerYRef, isPausedRef]);
};
