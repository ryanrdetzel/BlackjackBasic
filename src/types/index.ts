// Card Types
export type Suit = '♠' | '♥' | '♦' | '♣';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number; // Numeric value (Ace = 11, Face = 10, etc.)
}

// Hand Types
export interface Hand {
  cards: Card[];
  bet: number;
  isActive: boolean;
  isStanding: boolean;
  isDoubled: boolean;
  isBusted: boolean;
  isBlackjack: boolean;
}

export interface HandValue {
  value: number;
  isSoft: boolean; // Does this hand contain a usable Ace?
  isBusted: boolean;
  isBlackjack: boolean;
}

// Game State Types
export type GamePhase = 'betting' | 'dealing' | 'playerTurn' | 'dealerTurn' | 'resolution';

export interface GameState {
  phase: GamePhase;
  shoe: Card[];
  dealerHand: Hand;
  playerHands: Hand[]; // Array to support splits
  currentHandIndex: number;
  bankroll: number;
  currentBet: number;
}

// Strategy Types
export type Action = 'Hit' | 'Stand' | 'Double' | 'Split';

export type HandType = 'hard' | 'soft' | 'pair';

export interface StrategyDecision {
  action: Action;
  reason: string;
}

// Progression & Learning Types
export type Level = 1 | 2 | 3 | 4;

export interface LevelConfig {
  id: Level;
  name: string;
  description: string;
  unlocked: boolean;
}

export interface DecisionRecord {
  playerHand: HandValue;
  dealerUpcard: number;
  correctAction: Action;
  playerAction: Action;
  isCorrect: boolean;
  level: Level;
  timestamp: number;
}

export interface Stats {
  handsPlayed: number;
  correctMoves: number;
  incorrectMoves: number;
  accuracy: number; // percentage
  byLevel: {
    [key in Level]: {
      correct: number;
      incorrect: number;
      accuracy: number;
    };
  };
  recentDecisions: DecisionRecord[]; // Rolling window (last 20)
}

export interface ProgressState {
  currentLevel: Level;
  levels: LevelConfig[];
  stats: Stats;
  trainingMode: boolean;
}
