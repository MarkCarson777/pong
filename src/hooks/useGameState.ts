import { useEffect } from "react";
import type { GameState } from "../types/GameState";
import { CANVAS, PADDLE, BALL } from "../constants/gameConstants";

/** useGameState is a hook that manages the game state for Pong.
 * It updates the positions of the ball and computer paddle, checks for collisions,
 * updates scores, and handles game pausing.
 * @param isPausedRef - A reference to the paused state of the game, allowing for conditional rendering of the ball.
 * @param playerYRef - A reference to the player's paddle Y position, allowing for immediate updates.
 * @param setGameState - Function to update the game state.
 */

export const useGameState = (
  isPausedRef: React.RefObject<boolean>,
  playerYRef: React.RefObject<number>,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
) => {
  useEffect(() => {
    let animationFrameId: number;

    const update = () => {
      if (!isPausedRef.current) {
        setGameState((prev) => {
          let {
            ballX,
            ballY,
            ballSpeedX,
            ballSpeedY,
            computerY,
            playerScore,
            computerScore,
          } = prev;

          // Move the ball in the x-axis by the ball's speed per frame
          ballX += ballSpeedX;
          // Move the ball in the y-axis by the ball's speed per frame
          ballY += ballSpeedY;

          // Reverse the ball's vertical direction if it hits the top or bottom
          if (ballY <= 0 || ballY >= CANVAS.HEIGHT - BALL.SIZE) {
            ballSpeedY = -ballSpeedY;
          }

          // Simple AI for the computer paddle to follow the ball
          if (computerY + PADDLE.HEIGHT / 2 < ballY) {
            computerY += 2; // Move down
          } else {
            computerY -= 2; // Move up
          }

          // Ensure the computer paddle stays within the canvas bounds
          computerY = Math.max(
            0,
            Math.min(computerY, CANVAS.HEIGHT - PADDLE.HEIGHT)
          );

          // Check for collision with the player paddle
          if (
            ballX <= PADDLE.WIDTH &&
            ballY + BALL.SIZE >= playerYRef.current &&
            ballY <= playerYRef.current + PADDLE.HEIGHT
          ) {
            // Reverse the ball's direction in the x-axis
            ballSpeedX = -ballSpeedX;
          }

          // Check for collision with the computer paddle
          if (
            ballX >= CANVAS.WIDTH - PADDLE.WIDTH - BALL.SIZE &&
            ballY + BALL.SIZE >= computerY &&
            ballY <= computerY + PADDLE.HEIGHT
          ) {
            // Reverse the ball's direction in the x-axis
            ballSpeedX = -ballSpeedX;
            // Prevent the ball from getting stuck in the paddle
            ballX = CANVAS.WIDTH - PADDLE.WIDTH - BALL.SIZE - 1;
          }

          // Check if the ball goes out of bounds
          if (ballX < 0) {
            // Player missed the ball, reset the ball position
            ballX = CANVAS.WIDTH / 2;
            ballY = CANVAS.HEIGHT / 2;
            // Increment computer score
            computerScore += 1;
            // Pause the game at the end of the round
            isPausedRef.current = true;
          } else if (ballX > CANVAS.WIDTH - BALL.SIZE) {
            // Computer missed the ball, reset the ball position
            ballX = CANVAS.WIDTH / 2;
            ballY = CANVAS.HEIGHT / 2;
            // Increment player score
            playerScore += 1;
            // Pause the game at the end of the round
            isPausedRef.current = true;
          }

          return {
            ...prev,
            ballX,
            ballY,
            ballSpeedX,
            ballSpeedY,
            computerY,
            playerScore,
            computerScore,
          };
        });
      }
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPausedRef, playerYRef, setGameState]);
};
