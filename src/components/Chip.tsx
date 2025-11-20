interface ChipProps {
  value: number;
  onClick?: () => void;
  disabled?: boolean;
}

export default function Chip({ value, onClick, disabled = false }: ChipProps) {
  const getChipColor = (value: number): string => {
    if (value >= 100) return 'bg-black border-casino-chip-black';
    if (value >= 50) return 'bg-casino-chip-blue border-blue-800';
    if (value >= 25) return 'bg-casino-chip-green border-green-800';
    if (value >= 10) return 'bg-casino-chip-red border-red-800';
    return 'bg-casino-chip-white border-gray-300';
  };

  const getTextColor = (value: number): string => {
    if (value >= 100 || value >= 50) return 'text-white';
    return 'text-black';
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-16 h-16 rounded-full border-4 shadow-chip
        ${getChipColor(value)}
        ${getTextColor(value)}
        font-bold text-lg
        transition-transform
        ${!disabled && 'hover:scale-110 hover:shadow-glow cursor-pointer'}
        ${disabled && 'opacity-50 cursor-not-allowed'}
      `}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        ${value}
      </div>
      {/* Inner circle decoration */}
      <div className="absolute inset-2 rounded-full border-2 border-white opacity-30" />
    </button>
  );
}
