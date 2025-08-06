import { cn } from "@sglara/cn";

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
    <div className={cn("flex justify-between w-full", className)}>
      <div className="flex flex-col items-center">
        <span className="text-white">Player</span>
        <p className="text-white">{playerScore}</p>
      </div>
      <div className="flex flex-col items-center">
        <label className="text-white">Computer</label>
        <p className="text-white">{computerScore}</p>
      </div>
    </div>
  );
};
