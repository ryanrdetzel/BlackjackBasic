import { useGameStore } from '../store/gameStore';
import ProgressCircle from './ProgressCircle';

export default function Header() {
  const { levels, currentLevel, stats, trainingMode, toggleTrainingMode } = useGameStore();

  const getCurrentLevelProgress = () => {
    const levelDecisions = stats.recentDecisions.filter((d) => d.level === currentLevel);
    if (levelDecisions.length === 0) return 0;

    const correct = levelDecisions.filter((d) => d.isCorrect).length;
    return (correct / levelDecisions.length) * 100;
  };

  return (
    <header className="bg-casino-felt-dark border-b-4 border-casino-gold py-4 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top row - Title and Training Mode Toggle */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-casino-gold font-casino">
            Blackjack Basic Strategy Trainer
          </h1>

          <div className="flex items-center space-x-3">
            <span className="text-white text-sm">Training Mode</span>
            <button
              onClick={toggleTrainingMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                trainingMode ? 'bg-casino-gold' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  trainingMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Level progression */}
        <div className="flex justify-center items-center space-x-8">
          {levels.map((level, index) => {
            const isCurrentLevel = level.id === currentLevel;
            const progress = isCurrentLevel ? getCurrentLevelProgress() : level.unlocked ? 100 : 0;

            return (
              <button
                key={level.id}
                onClick={() => {
                  if (level.unlocked) {
                    useGameStore.setState({ currentLevel: level.id });
                  }
                }}
                disabled={!level.unlocked}
                className={`flex flex-col items-center space-y-2 p-3 rounded-lg transition-all ${
                  isCurrentLevel
                    ? 'bg-casino-felt ring-2 ring-casino-gold'
                    : level.unlocked
                    ? 'bg-casino-felt-dark hover:bg-casino-felt cursor-pointer'
                    : 'bg-casino-felt-dark opacity-50 cursor-not-allowed'
                }`}
              >
                <ProgressCircle
                  progress={progress}
                  active={isCurrentLevel}
                  locked={!level.unlocked}
                />

                <div className="text-center">
                  <div
                    className={`font-bold text-sm ${
                      isCurrentLevel
                        ? 'text-casino-gold'
                        : level.unlocked
                        ? 'text-white'
                        : 'text-gray-500'
                    }`}
                  >
                    Level {level.id}
                  </div>
                  <div
                    className={`text-xs ${
                      level.unlocked ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {level.name}
                  </div>
                </div>

                {index < levels.length - 1 && (
                  <div className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 text-gray-600 text-xl">
                    →
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Current level description */}
        <div className="text-center mt-4">
          <p className="text-white text-sm">
            {levels.find((l) => l.id === currentLevel)?.description}
          </p>
        </div>
      </div>
    </header>
  );
}
