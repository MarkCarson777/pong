export interface GameState {
  /** Player position in the y-axis */
  playerY: number;
  /** Ball position in the x-axis */
  ballX: number;
  /** Ball position in the y-axis */
  ballY: number;
  /** Ball speed in the x-axis */
  ballSpeedX: number;
  /** Ball speed in the y-axis */
  ballSpeedY: number;
}
