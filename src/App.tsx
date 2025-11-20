import Header from './components/Header';
import GameArea from './components/GameArea';
import StatsPanel from './components/StatsPanel';
import FeedbackModal from './components/FeedbackModal';
import './styles/index.css';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-casino-felt-dark">
      <Header />
      <GameArea />
      <StatsPanel />
      <FeedbackModal />
    </div>
  );
}
