import { useGameStore } from '../store/gameStore';

export default function ActionButtons() {
  const { phase, hit, stand, double, split, canPlayerDouble, canPlayerSplit, getCurrentHand } =
    useGameStore();

  if (phase !== 'playerTurn') return null;

  const currentHand = getCurrentHand();
  if (!currentHand || !currentHand.isActive) return null;

  const canDouble = canPlayerDouble();
  const canSplit = canPlayerSplit();

  return (
    <div className="flex flex-wrap justify-center gap-4 p-6">
      {/* Hit */}
      <button
        onClick={hit}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition-all transform hover:scale-105 min-w-[120px]"
      >
        HIT
      </button>

      {/* Stand */}
      <button
        onClick={stand}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition-all transform hover:scale-105 min-w-[120px]"
      >
        STAND
      </button>

      {/* Double */}
      <button
        onClick={double}
        disabled={!canDouble}
        className={`
          font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition-all transform min-w-[120px]
          ${
            canDouble
              ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 cursor-pointer'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
          }
        `}
      >
        DOUBLE
      </button>

      {/* Split */}
      <button
        onClick={split}
        disabled={!canSplit}
        className={`
          font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition-all transform min-w-[120px]
          ${
            canSplit
              ? 'bg-purple-600 hover:bg-purple-700 text-white hover:scale-105 cursor-pointer'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
          }
        `}
      >
        SPLIT
      </button>
    </div>
  );
}
