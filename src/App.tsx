import { useState, useRef, useEffect, useCallback } from "react";
import type { GameState } from "./types/GameState";
import { Scoreboard } from "./components/Scoreboard";
import { useCanvasRenderer } from "./hooks/useCanvasRenderer";
import { useKeyboardControls } from "./hooks/useKeyboardControls";

// TODO: Improve computer paddle AI
// TODO: Add difficulty levels
// TODO: Centre countdown
// TODO: Health points
// TODO: Round timer
// TODO: Improve design

// Canvas constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
// Paddle constants
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
// Ball constants
const BALL_SIZE = 12;
const BALL_SPEED = 7;

export const App: React.FC = () => {
  // Ref to the canvas element
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Ref to track the player's paddle position in the y-axis
  const playerYRef = useRef<number>(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  // Ref to track if the game is paused
  const isPausedRef = useRef<boolean>(true);
  // Sets initial game state
  const [gameState, setGameState] = useState<GameState>({
    computerY: 0,
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT / 2,
    ballSpeedX: BALL_SPEED,
    ballSpeedY: BALL_SPEED,
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

  // Handles mouse movement to control the paddle
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get the mouse position relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    // Ensure the paddle stays within the canvas bounds
    playerYRef.current = Math.max(
      0,
      Math.min(mouseY, CANVAS_HEIGHT - PADDLE_HEIGHT)
    );

    // Trigger a re-render to update paddle position immediately
    setRenderTrigger((prev) => prev + 1);
  };

  // Countdown
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
  }, [countdown]);

  useCanvasRenderer(
    canvasRef,
    gameState,
    countdown,
    renderTrigger,
    playerYRef,
    isPausedRef
  );

  // Game loop to update the game state
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
          if (ballY <= 0 || ballY >= CANVAS_HEIGHT - BALL_SIZE) {
            ballSpeedY = -ballSpeedY;
          }

          // Simple AI for the computer paddle to follow the ball
          if (computerY + PADDLE_HEIGHT / 2 < ballY) {
            computerY += 2; // Move down
          } else {
            computerY -= 2; // Move up
          }

          // Ensure the computer paddle stays within the canvas bounds
          computerY = Math.max(
            0,
            Math.min(computerY, CANVAS_HEIGHT - PADDLE_HEIGHT)
          );

          // Check for collision with the player paddle
          if (
            ballX <= PADDLE_WIDTH &&
            ballY + BALL_SIZE >= playerYRef.current &&
            ballY <= playerYRef.current + PADDLE_HEIGHT
          ) {
            // Reverse the ball's direction in the x-axis
            ballSpeedX = -ballSpeedX;
          }

          // Check for collision with the computer paddle
          if (
            ballX >= CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
            ballY + BALL_SIZE >= computerY &&
            ballY <= computerY + PADDLE_HEIGHT
          ) {
            // Reverse the ball's direction in the x-axis
            ballSpeedX = -ballSpeedX;
            // Prevent the ball from getting stuck in the paddle
            ballX = CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE - 1;
          }

          // Check if the ball goes out of bounds
          if (ballX < 0) {
            // Player missed the ball, reset the ball position
            ballX = CANVAS_WIDTH / 2;
            ballY = CANVAS_HEIGHT / 2;
            // Increment computer score
            computerScore += 1;
            // Pause the game at the end of the round
            isPausedRef.current = true;
          } else if (ballX > CANVAS_WIDTH - BALL_SIZE) {
            // Computer missed the ball, reset the ball position
            ballX = CANVAS_WIDTH / 2;
            ballY = CANVAS_HEIGHT / 2;
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
          height={CANVAS_HEIGHT}
          width={CANVAS_WIDTH}
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
