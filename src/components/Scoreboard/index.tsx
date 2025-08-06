interface Props {
  playerScore: number;
  computerScore: number;
  className?: string;
}

export const Scoreboard: React.FC<Props> = ({
  playerScore,
  computerScore,
  className,
}) => {
  return (
    <div className={className}>
      <div>
        <span>Player</span>
        <p>{playerScore}</p>
      </div>
      <div>
        <label>Computer</label>
        <p>{computerScore}</p>
      </div>
    </div>
  );
};
