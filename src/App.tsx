import Header from './components/Header';
import GameArea from './components/GameArea';
import FeedbackModal from './components/FeedbackModal';
import HandHistory from './components/HandHistory';
import './styles/index.css';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-casino-felt-dark">
      <Header />
      <GameArea />
      <div className="w-full px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <HandHistory />
        </div>
      </div>
      <FeedbackModal />
    </div>
  );
}
