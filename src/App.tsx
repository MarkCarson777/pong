import { useState, useRef, useEffect } from "react";
import type { GameState } from "./types/GameState";

// Canvas constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
// Paddle constants
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 40;
// Ball constants
const BALL_SIZE = 10;
const BALL_SPEED = 2;

export const App: React.FC<GameState> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Sets initial game state
  const [gameState, setGameState] = useState<GameState>({
    playerY: 0,
    computerY: 0,
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT / 2,
    ballSpeedX: BALL_SPEED,
    ballSpeedY: BALL_SPEED,
  });

  // Handles mouse movement to control the paddle
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    // Get the mouse position relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;

    // Ensure the paddle stays within the canvas bounds
    const newPlayerPosition = Math.max(
      0,
      Math.min(mouseY - PADDLE_HEIGHT / 2, CANVAS_HEIGHT - PADDLE_HEIGHT)
    );

    setGameState((prevState) => ({
      ...prevState,
      playerY: newPlayerPosition,
    }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    // Clear the canvas
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw the player paddle
    context.fillStyle = "white";
    context.fillRect(0, gameState.playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw the ball
    context.fillRect(gameState.ballX, gameState.ballY, BALL_SIZE, BALL_SIZE);

    // Game loop to update the game state
    const gameLoop = setInterval(() => {
      setGameState((prev) => {
        let { ballX, ballY, ballSpeedX, ballSpeedY } = prev;

        // Move the ball in the x-axis by the ball's speed per frame
        ballX += ballSpeedX;
        // Move the ball in the y-axis by the ball's speed per frame
        ballY += ballSpeedY;

        // Reverse the ball's vertical direction if it hits the top or bottom
        if (ballY <= 0 || ballY >= CANVAS_HEIGHT - BALL_SIZE) {
          ballSpeedY = -ballSpeedY;
        }

        return {
          ...prev,
          ballX,
          ballY,
          ballSpeedX,
          ballSpeedY,
        };
      });
    }, 1000 / 60); // 60 FPS

    // Clear the canvas
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Set the fill style for the paddle and ball
    context.fillStyle = "white";

    // Draw the player paddle
    context.fillRect(0, gameState.playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw the computer paddle
    context.fillRect(
      CANVAS_WIDTH - PADDLE_WIDTH,
      gameState.computerY,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    );

    // Draw the ball
    context.fillRect(gameState.ballX, gameState.ballY, BALL_SIZE, BALL_SIZE);

    // Clean up the game loop on unmount
    return () => clearInterval(gameLoop);
  }, [gameState]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-4xl font-bold text-white mb-4">Pong</h1>
      <canvas
        ref={canvasRef}
        height={CANVAS_HEIGHT}
        width={CANVAS_WIDTH}
        className="border-2 border-white bg-black"
        onMouseMove={onMouseMove}
      />
    </div>
  );
};
