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
    <div className="w-16 h-24 bg-white border-2 border-gray-300 rounded-lg shadow-card flex flex-col items-center justify-center p-2 relative">
      {/* Rank */}
      <span className={`text-3xl font-bold ${isRed ? 'text-red-600' : 'text-black'}`}>
        {card.rank}
      </span>
      {/* Single suit */}
      <span className={`text-2xl ${isRed ? 'text-red-600' : 'text-black'}`}>
        {card.suit}
      </span>
    </div>
  );
}
