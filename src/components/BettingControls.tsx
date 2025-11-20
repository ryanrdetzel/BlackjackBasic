import { useGameStore } from '../store/gameStore';
import Chip from './Chip';

const CHIP_VALUES = [10, 25, 50, 100];

export default function BettingControls() {
  const { phase, bankroll, currentBet, placeBet, startHand, resetBankroll } = useGameStore();

  if (phase !== 'betting') return null;

  const canAffordChip = (value: number) => bankroll >= value;

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

      {/* Current bet display */}
      {currentBet > 0 && (
        <div className="text-center">
          <div className="text-gray-400 text-sm uppercase">Current Bet</div>
          <div className="text-white text-2xl font-bold">${currentBet}</div>
        </div>
      )}

      {/* Chip selection */}
      <div>
        <div className="text-center text-gray-400 text-sm uppercase mb-3">Select Bet</div>
        <div className="flex space-x-4">
          {CHIP_VALUES.map((value) => (
            <Chip
              key={value}
              value={value}
              onClick={() => placeBet(value)}
              disabled={!canAffordChip(value)}
            />
          ))}
        </div>
      </div>

      {/* Deal button */}
      {currentBet > 0 && (
        <button
          onClick={startHand}
          className="bg-casino-gold hover:bg-casino-gold-dark text-black font-bold py-3 px-8 rounded-lg text-xl shadow-glow transition-all transform hover:scale-105"
        >
          Deal Cards
        </button>
      )}

      {bankroll > 0 && currentBet === 0 && (
        <div className="text-gray-400 text-sm text-center">
          Place your bet to start playing
        </div>
      )}
    </div>
  );
}
