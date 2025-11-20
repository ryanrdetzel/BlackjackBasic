import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import Chip from './Chip';

const CHIP_VALUES = [10, 25, 50, 100];
const COUNTDOWN_SECONDS = 3;

export default function BettingControls() {
  const { phase, bankroll, lastBetAmount, placeBet, startHand, resetBankroll } = useGameStore();
  const [countdown, setCountdown] = useState<number | null>(null);

  // Start countdown when entering betting phase with a last bet amount
  useEffect(() => {
    if (phase === 'betting' && lastBetAmount > 0 && lastBetAmount <= bankroll) {
      setCountdown(COUNTDOWN_SECONDS);
    } else {
      setCountdown(null);
    }
  }, [phase, lastBetAmount, bankroll]);

  // Countdown timer
  useEffect(() => {
    if (countdown === null || countdown <= 0) return;

    const timer = setTimeout(() => {
      if (countdown === 1) {
        // Auto-deal with last bet amount
        placeBet(lastBetAmount);
        setTimeout(() => startHand(), 100);
        setCountdown(null);
      } else {
        setCountdown(countdown - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, lastBetAmount, placeBet, startHand]);

  if (phase !== 'betting') return null;

  const canAffordChip = (value: number) => bankroll >= value;

  const handleChipClick = (value: number) => {
    // Cancel countdown when user manually selects a bet
    setCountdown(null);
    placeBet(value);
    // Auto-deal after selecting bet
    setTimeout(() => startHand(), 100);
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6 bg-casino-felt rounded-lg border-2 border-casino-gold shadow-lg">
      {/* Bankroll display */}
      <div className="text-center">
        <div className="text-gray-400 text-sm uppercase">Bankroll</div>
        <div className="text-casino-gold text-3xl font-bold">${bankroll}</div>
        {bankroll === 0 && (
          <button
            onClick={resetBankroll}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded text-sm"
          >
            Reset Bankroll
          </button>
        )}
      </div>

      {/* Countdown display */}
      {countdown !== null && countdown > 0 && (
        <div className="text-center">
          <div className="text-casino-gold text-5xl font-bold animate-pulse">
            {countdown}
          </div>
          <div className="text-gray-400 text-sm mt-2">
            Auto-dealing ${lastBetAmount}...
          </div>
          <div className="text-gray-500 text-xs mt-1">
            Click any chip to cancel
          </div>
        </div>
      )}

      {/* Chip selection */}
      {(countdown === null || countdown <= 0) && (
        <div>
          <div className="text-center text-gray-400 text-sm uppercase mb-3">Select Bet</div>
          <div className="flex space-x-4">
            {CHIP_VALUES.map((value) => (
              <Chip
                key={value}
                value={value}
                onClick={() => handleChipClick(value)}
                disabled={!canAffordChip(value)}
              />
            ))}
          </div>
          {bankroll > 0 && (
            <div className="text-gray-400 text-sm text-center mt-3">
              Select a chip to bet and deal
            </div>
          )}
        </div>
      )}
    </div>
  );
}
