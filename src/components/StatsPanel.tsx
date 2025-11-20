import { useGameStore } from '../store/gameStore';

export default function StatsPanel() {
  const { stats } = useGameStore();

  return (
    <footer className="bg-casino-felt-dark border-t-4 border-casino-gold py-4 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Hands Played */}
          <div className="text-center">
            <div className="text-gray-400 text-xs uppercase mb-1">Hands Played</div>
            <div className="text-white text-2xl font-bold">{stats.handsPlayed}</div>
          </div>

          {/* Correct Moves */}
          <div className="text-center">
            <div className="text-gray-400 text-xs uppercase mb-1">Correct</div>
            <div className="text-green-500 text-2xl font-bold">{stats.correctMoves}</div>
          </div>

          {/* Incorrect Moves */}
          <div className="text-center">
            <div className="text-gray-400 text-xs uppercase mb-1">Incorrect</div>
            <div className="text-red-500 text-2xl font-bold">{stats.incorrectMoves}</div>
          </div>

          {/* Overall Accuracy */}
          <div className="text-center">
            <div className="text-gray-400 text-xs uppercase mb-1">Accuracy</div>
            <div className="text-casino-gold text-2xl font-bold">
              {stats.accuracy.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Recent performance indicator */}
        {stats.recentDecisions.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-400">
            Last {stats.recentDecisions.length} decisions tracked for level progression
          </div>
        )}
      </div>
    </footer>
  );
}
