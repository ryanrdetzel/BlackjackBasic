import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Card } from '../types';

const HandHistory = () => {
  const handHistory = useGameStore((state) => state.handHistory) || [];
  const exportHandHistoryCSV = useGameStore((state) => state.exportHandHistoryCSV);
  const clearHandHistory = useGameStore((state) => state.clearHandHistory);
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper function to format cards
  const formatCards = (cards: Card[] | undefined) => {
    if (!cards || cards.length === 0) return '-';
    return cards.map(c => `${c.rank}${c.suit}`).join(' ');
  };

  const handleDownloadCSV = () => {
    const csv = exportHandHistoryCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blackjack-history-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all hand history? This cannot be undone.')) {
      clearHandHistory();
    }
  };

  if (handHistory.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-2">Hand History</h2>
        <p className="text-gray-400">No hands played yet. Start playing to build your history!</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">
          Hand History ({handHistory.length} {handHistory.length === 1 ? 'hand' : 'hands'})
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
          >
            Download CSV
          </button>
          <button
            onClick={handleClearHistory}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          >
            Clear History
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-700 text-gray-300">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Player Initial</th>
                <th className="px-3 py-2">Dealer Up</th>
                <th className="px-3 py-2">Actions</th>
                <th className="px-3 py-2">Player Final</th>
                <th className="px-3 py-2">Value</th>
                <th className="px-3 py-2">Dealer Final</th>
                <th className="px-3 py-2">Value</th>
                <th className="px-3 py-2">Bet</th>
                <th className="px-3 py-2">Outcome</th>
                <th className="px-3 py-2">Net</th>
                <th className="px-3 py-2">Bankroll</th>
                <th className="px-3 py-2">Correct?</th>
              </tr>
            </thead>
            <tbody>
              {handHistory.map((record) => {
                const outcomeColor = {
                  win: 'text-green-400',
                  blackjack: 'text-yellow-400',
                  push: 'text-gray-400',
                  lose: 'text-red-400',
                }[record.outcome];

                const netColor = record.netAmount >= 0 ? 'text-green-400' : 'text-red-400';
                const correctColor = record.strategyCorrect ? 'text-green-400' : 'text-red-400';

                return (
                  <tr key={`${record.sessionId}-${record.handNumber}`} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="px-3 py-2 text-gray-300">{record.handNumber}</td>
                    <td className="px-3 py-2 text-gray-300 text-xs">
                      {new Date(record.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-3 py-2 text-white font-mono">
                      {formatCards(record.playerInitialCards)}
                    </td>
                    <td className="px-3 py-2 text-white font-mono">
                      {record.dealerUpcard.rank}{record.dealerUpcard.suit}
                    </td>
                    <td className="px-3 py-2 text-gray-300 text-xs">
                      {record.actions.join(', ') || 'None'}
                    </td>
                    <td className="px-3 py-2 text-white font-mono text-xs">
                      {formatCards(record.playerFinalCards)}
                    </td>
                    <td className="px-3 py-2 text-white">
                      {record.playerFinalValue}{record.playerIsSoft ? 's' : ''}
                    </td>
                    <td className="px-3 py-2 text-white font-mono text-xs">
                      {formatCards(record.dealerFinalCards)}
                    </td>
                    <td className="px-3 py-2 text-white">{record.dealerFinalValue}</td>
                    <td className="px-3 py-2 text-gray-300">${record.betAmount}</td>
                    <td className={`px-3 py-2 font-semibold ${outcomeColor}`}>
                      {record.outcome.charAt(0).toUpperCase() + record.outcome.slice(1)}
                    </td>
                    <td className={`px-3 py-2 font-semibold ${netColor}`}>
                      {record.netAmount >= 0 ? '+' : ''}${record.netAmount}
                    </td>
                    <td className="px-3 py-2 text-gray-300">${record.runningBankroll}</td>
                    <td className={`px-3 py-2 font-semibold ${correctColor}`}>
                      {record.strategyCorrect ? 'Yes' : 'No'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!isExpanded && (
        <div className="space-y-2">
          <p className="text-gray-400 text-sm">
            Last 5 hands - Click "Expand" to view full history
          </p>
          {handHistory.slice(0, 5).map((record) => {
            const outcomeColor = {
              win: 'text-green-400',
              blackjack: 'text-yellow-400',
              push: 'text-gray-400',
              lose: 'text-red-400',
            }[record.outcome];

            return (
              <div
                key={`${record.sessionId}-${record.handNumber}`}
                className="flex items-center justify-between p-2 bg-gray-750 rounded border border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 font-mono">#{record.handNumber}</span>
                  <span className="text-white font-mono">
                    {formatCards(record.playerInitialCards)}
                  </span>
                  <span className="text-gray-400 text-xs">vs</span>
                  <span className="text-white font-mono">
                    {record.dealerUpcard.rank}{record.dealerUpcard.suit}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {record.actions.join(', ') || 'None'}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-semibold ${outcomeColor}`}>
                    {record.outcome.charAt(0).toUpperCase() + record.outcome.slice(1)}
                  </span>
                  <span className={record.netAmount >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {record.netAmount >= 0 ? '+' : ''}${record.netAmount}
                  </span>
                  <span className={record.strategyCorrect ? 'text-green-400' : 'text-red-400'}>
                    {record.strategyCorrect ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HandHistory;
