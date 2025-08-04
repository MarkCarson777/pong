import { useState, useRef, useEffect } from "react";
import type { GameState } from "./types/GameState";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 40;

export const App: React.FC<GameState> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Initialises game state with ball at centre
  const [gameState, setGameState] = useState<GameState>({
    playerY: 0,
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT / 2,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.fillStyle = "white";
    context.fillRect(0, gameState.playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-4xl font-bold text-white mb-4">Pong</h1>
      <canvas
        ref={canvasRef}
        height={CANVAS_HEIGHT}
        width={CANVAS_WIDTH}
        className="border-2 border-white bg-black"
      />
    </div>
  );
};
