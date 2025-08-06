import { useState, useRef, useEffect, useCallback } from "react";
import type { GameState } from "./types/GameState";
import { Scoreboard } from "./components/Scoreboard";

// TODO: Improve computer paddle AI
// TODO: Add difficulty levels
// TODO: Centre countdown
// TODO: Health points
// TODO: Round timer
// TODO: Improve design
// TODO: Improve paddle collision detection

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

  // Handles space key press to start the countdown
  const handleSpacePress = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space" && !countdown && isPausedRef.current === true) {
        e.preventDefault();
        setCountdown(3);
      }
    },
    [countdown]
  );

  // Add event listener to trigger countdown on space key press
  useEffect(() => {
    window.addEventListener("keydown", handleSpacePress);
    return () => window.removeEventListener("keydown", handleSpacePress);
  }, [handleSpacePress]);

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
  }, [gameState, countdown, renderTrigger]);

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
          className="border-2 border-white bg-black rounded-2xl"
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
