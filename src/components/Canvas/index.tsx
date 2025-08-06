interface Props {
  className?: string;
}

export const Canvas: React.FC<Props> = ({ className }) => {
  return <div className={className}>Canvas</div>;
};
