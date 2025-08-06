import { useState, useRef, useCallback } from "react";
import type { GameState } from "./types/GameState";

import { Scoreboard } from "./components/Scoreboard";
import { useCanvasRenderer } from "./hooks/useCanvasRenderer";
import { useCountdown } from "./hooks/useCountdown";
import { useKeyboardControls } from "./hooks/useKeyboardControls";
import { usePlayerPosition } from "./hooks/usePlayerPosition";
import { useGameState } from "./hooks/useGameState";

import { CANVAS, PADDLE, BALL } from "./constants/gameConstants";

// TODO: Improve computer paddle AI
// TODO: Add difficulty levels
// TODO: Centre countdown
// TODO: Health points
// TODO: Round timer
// TODO: Improve design

export const App: React.FC = () => {
  /** -------------
   * Refs
   * ----------- */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerYRef = useRef<number>(CANVAS.HEIGHT / 2 - PADDLE.HEIGHT / 2);
  const isPausedRef = useRef<boolean>(true);

  /** -------------
   * State
   * ----------- */
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

  /** -------------
   * Keyboard Controls
   * ----------- */
  const handleSpacePress = useCallback(() => {
    if (!countdown && isPausedRef.current === true) {
      setCountdown(3);
    }
  }, [countdown]);

  useKeyboardControls(handleSpacePress);

  /** -------------
   * Custom Hooks
   * ----------- */
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

  useGameState(isPausedRef, playerYRef, setGameState);

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
