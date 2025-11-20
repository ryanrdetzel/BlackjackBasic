import { useGameStore } from '../store/gameStore';

export default function FeedbackModal() {
  const { showFeedback, feedbackMessage, setShowFeedback } = useGameStore();

  if (!showFeedback) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-casino-felt border-4 border-red-600 rounded-lg p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">❌</div>
          <h2 className="text-2xl font-bold text-red-500">Incorrect Move</h2>
        </div>

        <div className="bg-casino-felt-dark p-4 rounded-lg mb-6">
          <p className="text-white text-lg leading-relaxed">{feedbackMessage}</p>
        </div>

        <button
          onClick={() => setShowFeedback(false)}
          className="w-full bg-casino-gold hover:bg-casino-gold-dark text-black font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Continue Playing
        </button>

        <p className="text-gray-400 text-xs text-center mt-4">
          Study basic strategy to improve your accuracy
        </p>
      </div>
    </div>
  );
}
