export interface GameState {
  /** Computer position in the y-axis */
  computerY: number;
  /** Ball position in the x-axis */
  ballX: number;
  /** Ball position in the y-axis */
  ballY: number;
  /** Ball speed in the x-axis */
  ballSpeedX: number;
  /** Ball speed in the y-axis */
  ballSpeedY: number;
  /** Player score */
  playerScore: number;
  /** Computer score */
  computerScore: number;
}
