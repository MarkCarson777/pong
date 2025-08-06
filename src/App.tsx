import { useState, useRef, useEffect, useCallback } from "react";
import type { GameState } from "./types/GameState";
import { Scoreboard } from "./components/Scoreboard";
import { useCanvasRenderer } from "./hooks/useCanvasRenderer";
import { useCountdown } from "./hooks/useCountdown";
import { useKeyboardControls } from "./hooks/useKeyboardControls";
import { usePlayerPosition } from "./hooks/usePlayerPosition";
import { CANVAS, PADDLE, BALL } from "./constants/gameConstants";

// TODO: Improve computer paddle AI
// TODO: Add difficulty levels
// TODO: Centre countdown
// TODO: Health points
// TODO: Round timer
// TODO: Improve design

export const App: React.FC = () => {
  // Ref to the canvas element
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Ref to track the player's paddle position in the y-axis
  const playerYRef = useRef<number>(CANVAS.HEIGHT / 2 - PADDLE.HEIGHT / 2);
  // Ref to track if the game is paused
  const isPausedRef = useRef<boolean>(true);
  // Sets initial game state
  const [gameState, setGameState] = useState<GameState>({
    computerY: 0,
    ballX: CANVAS.WIDTH / 2,
    ballY: CANVAS.HEIGHT / 2,
    ballSpeedX: BALL.SPEED,
    ballSpeedY: BALL.SPEED,
    playerScore: 0,
    computerScore: 0,
  });
  const [countdown, setCountdown] = useState<number | null>(null);
  const [renderTrigger, setRenderTrigger] = useState<number>(0);

  const handleSpacePress = useCallback(() => {
    if (!countdown && isPausedRef.current === true) {
      setCountdown(3);
    }
  }, [countdown]);

  useKeyboardControls(handleSpacePress);

  const { handleMouseMove } = usePlayerPosition(
    canvasRef,
    playerYRef,
    setRenderTrigger
  );

  useCountdown(countdown, setCountdown, isPausedRef);

  useCanvasRenderer(
    canvasRef,
    gameState,
    countdown,
    renderTrigger,
    playerYRef,
    isPausedRef
  );

  // Game loop
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
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-4xl font-bold text-white mb-4">Pong</h1>
      <div className="flex flex-col items-center gap-4">
        <canvas
          ref={canvasRef}
          height={CANVAS.HEIGHT}
          width={CANVAS.WIDTH}
          className="border-2 border-white bg-black"
          onMouseMove={handleMouseMove}
        />
        <Scoreboard
          playerScore={gameState.playerScore}
          computerScore={gameState.computerScore}
        />
      </div>
    </div>
  );
};
