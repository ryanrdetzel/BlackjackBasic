import { useGameStore } from '../store/gameStore';
import Hand from './Hand';
import ActionButtons from './ActionButtons';
import BettingControls from './BettingControls';

export default function GameArea() {
  const { phase, dealerHand, playerHands, lastOutcome, lastBetAmount } = useGameStore();

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
          <div className="flex flex-col items-center space-y-2 p-6 bg-casino-felt rounded-lg border-2 border-casino-gold shadow-lg">
            {lastOutcome.type === 'blackjack' ? (
              <>
                <div className="text-casino-gold text-4xl font-bold animate-pulse">
                  BLACKJACK!
                </div>
                <div className="text-green-400 text-3xl font-bold">
                  +${lastOutcome.amount.toFixed(2)}
                </div>
                {playerHands.some(h => h.isDoubled) && (
                  <div className="text-gray-300 text-sm">
                    (Doubled from ${lastBetAmount})
                  </div>
                )}
              </>
            ) : lastOutcome.type === 'win' ? (
              <>
                <div className="text-green-400 text-4xl font-bold">
                  YOU WIN!
                </div>
                <div className="text-green-400 text-3xl font-bold">
                  +${lastOutcome.amount.toFixed(2)}
                </div>
                {playerHands.some(h => h.isDoubled) && (
                  <div className="text-gray-300 text-sm">
                    (Doubled from ${lastBetAmount})
                  </div>
                )}
              </>
            ) : lastOutcome.type === 'lose' ? (
              <>
                <div className="text-red-500 text-4xl font-bold">
                  YOU LOSE
                </div>
                <div className="text-red-500 text-3xl font-bold">
                  ${lastOutcome.amount.toFixed(2)}
                </div>
                {playerHands.some(h => h.isDoubled) && (
                  <div className="text-gray-300 text-sm">
                    (Doubled from ${lastBetAmount})
                  </div>
                )}
              </>
            ) : lastOutcome.type === 'push' ? (
              <>
                <div className="text-gray-300 text-4xl font-bold">
                  PUSH
                </div>
                <div className="text-gray-300 text-2xl">
                  Bet Returned
                </div>
                {playerHands.some(h => h.isDoubled) && (
                  <div className="text-gray-300 text-sm">
                    (Doubled from ${lastBetAmount})
                  </div>
                )}
              </>
            ) : (
              <div className="text-casino-gold text-xl font-bold">
                Hand Complete
              </div>
            )}
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
