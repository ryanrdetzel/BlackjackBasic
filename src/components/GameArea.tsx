import { useGameStore } from '../store/gameStore';
import Hand from './Hand';
import ActionButtons from './ActionButtons';
import BettingControls from './BettingControls';

export default function GameArea() {
  const { phase, dealerHand, playerHands } = useGameStore();

  const showDealerSecondCard = phase === 'resolution' || phase === 'dealerTurn';

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 py-4 px-4 overflow-auto">
      {/* Dealer Area */}
      <div className="w-full max-w-4xl min-h-0">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-casino-gold text-2xl font-bold">Dealer</h2>
          {dealerHand.cards.length > 0 && (
            <Hand hand={dealerHand} isDealer={true} hideSecondCard={!showDealerSecondCard} />
          )}
        </div>
      </div>

      {/* Center Area - Betting or Actions */}
      <div className="w-full max-w-4xl flex justify-center items-center min-h-0">
        {phase === 'betting' ? (
          <BettingControls />
        ) : phase === 'playerTurn' ? (
          <ActionButtons />
        ) : phase === 'dealerTurn' ? (
          <div className="text-casino-gold text-xl font-bold animate-pulse">
            Dealer Playing...
          </div>
        ) : phase === 'resolution' ? (
          <div className="text-casino-gold text-xl font-bold">
            Hand Complete
          </div>
        ) : null}
      </div>

      {/* Player Area */}
      <div className="w-full max-w-4xl min-h-0">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-casino-gold text-2xl font-bold">Player</h2>
          {playerHands.length > 0 && (
            <div className="flex flex-wrap justify-center gap-8">
              {playerHands.map((hand, index) => (
                <Hand
                  key={index}
                  hand={hand}
                  label={playerHands.length > 1 ? `Hand ${index + 1}` : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
