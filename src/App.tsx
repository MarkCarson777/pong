import { useRef } from "react";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
}
