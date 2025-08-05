import { useState, useRef, useEffect } from "react";
import type { GameState } from "./types/GameState";

// TODO: Add start/restart game functionality
// TODO: Improve computer paddle AI
// TODO: Add difficulty levels
// TODO: Add starter countdown

// Canvas constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
// Paddle constants
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
// Ball constants
const BALL_SIZE = 10;
const BALL_SPEED = 7;

export const App: React.FC<GameState> = () => {
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

  // Handles mouse movement to control the paddle
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
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
  };

  const onSpacePress = (e: KeyboardEvent) => {
    if (e.code === "Space") {
      // Prevent default spacebar behavior (scrolling)
      e.preventDefault();
      // Start or resume the game
      isPausedRef.current = false;
    }
  };

  useEffect(() => {
    // Add event listener for space key press to start the game
    window.addEventListener("keydown", onSpacePress);
    // Remove event listener on cleanup
    return () => window.removeEventListener("keydown", onSpacePress);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    // Clear the canvas
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

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
    context.fillRect(gameState.ballX, gameState.ballY, BALL_SIZE, BALL_SIZE);

    // Game loop to update the game state
    const gameLoop = setInterval(() => {
      if (isPausedRef.current) return; // Skip updates if the game is paused

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
    }, 1000 / 60); // 60 FPS

    // Clean up the game loop on unmount
    return () => clearInterval(gameLoop);
  }, [gameState]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-4xl font-bold text-white mb-4">Pong</h1>
      <div className="flex items-center gap-4">
        <div>
          <p className="text-white">Player Score: {gameState.playerScore}</p>
        </div>
        <canvas
          ref={canvasRef}
          height={CANVAS_HEIGHT}
          width={CANVAS_WIDTH}
          className="border-2 border-white bg-black"
          onMouseMove={onMouseMove}
        />
        <div>
          <p className="text-white">
            Computer Score: {gameState.computerScore}
          </p>
        </div>
      </div>
    </div>
  );
};
