import { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
  hidden?: boolean;
}

export default function Card({ card, hidden = false }: CardProps) {
  const isRed = card.suit === '♥' || card.suit === '♦';

  if (hidden) {
    return (
      <div className="w-16 h-24 bg-blue-900 border-2 border-blue-700 rounded-lg shadow-card flex items-center justify-center">
        <div className="text-4xl text-blue-700">🂠</div>
      </div>
    );
  }

  return (
    <div className="w-16 h-24 bg-white border-2 border-gray-300 rounded-lg shadow-card flex flex-col p-1.5 relative">
      {/* Top left corner */}
      <div className="flex flex-col items-center leading-none">
        <span className={`text-lg font-bold ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.rank}
        </span>
        <span className={`text-xl ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.suit}
        </span>
      </div>

      {/* Center suit */}
      <div className="flex-1 flex items-center justify-center">
        <span className={`text-3xl ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.suit}
        </span>
      </div>

      {/* Bottom right corner (rotated) */}
      <div className="flex flex-col items-center leading-none rotate-180">
        <span className={`text-lg font-bold ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.rank}
        </span>
        <span className={`text-xl ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.suit}
        </span>
      </div>
    </div>
  );
}
