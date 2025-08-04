import { useState, useRef, useEffect } from "react";
import type { GameState } from "./types/GameState";

// constants for the game dimensions and paddle size
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 40;

export const App: React.FC<GameState> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // sets initial game state
  const [gameState, setGameState] = useState<GameState>({
    playerY: 0,
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT / 2,
  });

  // handles mouse movement to control the paddle
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    // get the mouse position relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;

    // ensure the paddle stays within the canvas bounds
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

    // clear the canvas
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // draw the player paddle
    context.fillStyle = "white";
    context.fillRect(0, gameState.playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
  }, [gameState.playerY]);

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
