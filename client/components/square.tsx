interface SquareProps {
  value: number | null;
  onSquareClick: () => void;
  isWinner?: boolean;
  disabled?: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onSquareClick, isWinner = false, disabled = false }) => {
  let content: string;
  let colorClass: string;
  let bgClass: string;

  if (value === 1) {
    content = 'O';
    colorClass = 'text-orange-400';
    bgClass = 'bg-orange-50';
  } else if (value === 0) {
    content = 'X';
    colorClass = 'text-blue-400';
    bgClass = 'bg-blue-50';
  } else {
    content = '';
    colorClass = '';
    bgClass = 'bg-white/5 hover:bg-white/10';
  }

  return (
    <button
      className={`w-24 h-24 border-2 border-white/20 ${bgClass} hover:border-white/40 rounded-xl flex items-center justify-center text-4xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg backdrop-blur-sm ${
        isWinner ? 'bg-green-500/20 border-green-400 shadow-green-400/50 shadow-xl' : ''
      } ${colorClass} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      onClick={onSquareClick}
      disabled={value !== null || disabled}
    >
      {content}
    </button>
  );
};

export default Square;
