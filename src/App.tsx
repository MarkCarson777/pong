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

export const App: React.FC<GameState> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Sets initial game state
  const [gameState, setGameState] = useState<GameState>({
    playerY: 0,
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT / 2,
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
