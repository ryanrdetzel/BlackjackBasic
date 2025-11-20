import { Hand as HandType } from '../types';
import { evaluateHand } from '../engine/handEvaluator';
import Card from './Card';

interface HandProps {
  hand: HandType;
  isDealer?: boolean;
  hideSecondCard?: boolean;
  label?: string;
}

export default function Hand({ hand, isDealer = false, hideSecondCard = false, label }: HandProps) {
  const handValue = evaluateHand(hand.cards);

  // For dealer, don't show value if second card is hidden
  const showValue = !(isDealer && hideSecondCard);

  return (
    <div className="flex flex-col items-center space-y-2">
      {label && (
        <div className="text-casino-gold font-bold text-sm">
          {label}
        </div>
      )}

      {/* Cards */}
      <div className="flex space-x-2">
        {hand.cards.map((card, index) => (
          <div
            key={index}
            className="transform transition-transform hover:scale-105"
          >
            <Card card={card} hidden={hideSecondCard && index === 1} />
          </div>
        ))}
      </div>

      {/* Hand value */}
      {showValue && (
        <div className="text-white text-lg font-semibold">
          {handValue.isBusted && <span className="text-red-500">BUST! </span>}
          {handValue.isBlackjack && <span className="text-casino-gold">BLACKJACK! </span>}
          {!handValue.isBusted && !handValue.isBlackjack && (
            <>
              {handValue.isSoft && 'Soft '}
              {handValue.value}
            </>
          )}
        </div>
      )}

      {/* Bet indicator for player hands */}
      {!isDealer && hand.bet > 0 && (
        <div className="text-casino-gold text-sm">
          ${hand.bet}
          {hand.isDoubled && ' (Doubled)'}
        </div>
      )}

      {/* Active indicator */}
      {hand.isActive && !isDealer && (
        <div className="text-casino-gold-light text-xs animate-pulse">
          ▼ Your Turn ▼
        </div>
      )}
    </div>
  );
}
