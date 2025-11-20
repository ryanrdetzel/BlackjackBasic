import { create } from 'zustand';
import {
  Action,
  DecisionRecord,
  GamePhase,
  GameState,
  Hand,
  Level,
  LevelConfig,
  ProgressState,
  Stats,
} from '../types';
import { createShoe, createRiggedShoe, dealCard } from '../engine/deck';
import { evaluateHand, getDealerUpcard, dealerShouldHit, canSplit, canDouble } from '../engine/handEvaluator';
import { getBasicStrategyAction, isCorrectAction } from '../engine/strategy';

interface GameStore extends GameState, ProgressState {
  // Game actions
  placeBet: (amount: number) => void;
  startHand: () => void;
  hit: () => void;
  stand: () => void;
  double: () => void;
  split: () => void;
  resetBankroll: () => void;

  // Internal methods
  moveToNextHand: () => void;
  playDealerHand: () => void;
  resolveHand: () => void;

  // Progression actions
  toggleTrainingMode: () => void;
  recordDecision: (playerAction: Action) => void;

  // Feedback
  showFeedback: boolean;
  feedbackMessage: string;
  setShowFeedback: (show: boolean) => void;

  // Utilities
  canPlayerDouble: () => boolean;
  canPlayerSplit: () => boolean;
  getCurrentHand: () => Hand;
  getDealerUpcardValue: () => number;
}

const INITIAL_BANKROLL = 1000;
const MIN_BET = 10;
const ROLLING_WINDOW_SIZE = 20;

// Initialize level configuration
const initializeLevels = (): LevelConfig[] => [
  {
    id: 1,
    name: 'Hard Totals',
    description: 'Learn when to Hit vs Stand (no doubling)',
    unlocked: true,
  },
  {
    id: 2,
    name: 'Hard Totals + Doubling',
    description: 'Master doubling on hard hands',
    unlocked: false,
  },
  {
    id: 3,
    name: 'Soft Totals',
    description: 'Handle hands with Aces',
    unlocked: false,
  },
  {
    id: 4,
    name: 'Pairs & Splits',
    description: 'Complete basic strategy',
    unlocked: false,
  },
];

// Initialize stats
const initializeStats = (): Stats => {
  const stored = localStorage.getItem('blackjack_stats');
  if (stored) {
    return JSON.parse(stored);
  }

  return {
    handsPlayed: 0,
    correctMoves: 0,
    incorrectMoves: 0,
    accuracy: 0,
    byLevel: {
      1: { correct: 0, incorrect: 0, accuracy: 0 },
      2: { correct: 0, incorrect: 0, accuracy: 0 },
      3: { correct: 0, incorrect: 0, accuracy: 0 },
      4: { correct: 0, incorrect: 0, accuracy: 0 },
    },
    recentDecisions: [],
  };
};

// Calculate accuracy from recent decisions for current level
const calculateRecentAccuracy = (recentDecisions: DecisionRecord[], level: Level): number => {
  const levelDecisions = recentDecisions.filter((d) => d.level === level);
  if (levelDecisions.length === 0) return 0;

  const correct = levelDecisions.filter((d) => d.isCorrect).length;
  return (correct / levelDecisions.length) * 100;
};

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial game state
  phase: 'betting' as GamePhase,
  shoe: createShoe(),
  dealerHand: {
    cards: [],
    bet: 0,
    isActive: false,
    isStanding: false,
    isDoubled: false,
    isBusted: false,
    isBlackjack: false,
  },
  playerHands: [],
  currentHandIndex: 0,
  bankroll: INITIAL_BANKROLL,
  currentBet: 0,

  // Initial progress state
  currentLevel: 1,
  levels: initializeLevels(),
  stats: initializeStats(),
  trainingMode: true,

  // Feedback
  showFeedback: false,
  feedbackMessage: '',

  setShowFeedback: (show) => set({ showFeedback: show }),

  placeBet: (amount) => {
    const state = get();
    if (state.phase !== 'betting') return;
    if (amount > state.bankroll) return;
    if (amount < MIN_BET) return;

    set({ currentBet: amount });
  },

  startHand: () => {
    const state = get();
    if (state.phase !== 'betting' || state.currentBet === 0) return;

    // Create or refresh shoe based on training mode
    let shoe = state.shoe;
    if (shoe.length < 52) {
      shoe = state.trainingMode ? createRiggedShoe(state.currentLevel === 4 ? 'pair' : state.currentLevel === 3 ? 'soft' : 'hard') : createShoe();
    }

    // Deal initial cards
    const { card: playerCard1, remainingShoe: shoe1 } = dealCard(shoe);
    const { card: dealerCard1, remainingShoe: shoe2 } = dealCard(shoe1);
    const { card: playerCard2, remainingShoe: shoe3 } = dealCard(shoe2);
    const { card: dealerCard2, remainingShoe: finalShoe } = dealCard(shoe3);

    const playerHand: Hand = {
      cards: [playerCard1, playerCard2],
      bet: state.currentBet,
      isActive: true,
      isStanding: false,
      isDoubled: false,
      isBusted: false,
      isBlackjack: false,
    };

    const dealerHand: Hand = {
      cards: [dealerCard1, dealerCard2],
      bet: 0,
      isActive: false,
      isStanding: false,
      isDoubled: false,
      isBusted: false,
      isBlackjack: false,
    };

    // Check for blackjacks
    const playerValue = evaluateHand(playerHand.cards);
    const dealerValue = evaluateHand(dealerHand.cards);
    playerHand.isBlackjack = playerValue.isBlackjack;
    dealerHand.isBlackjack = dealerValue.isBlackjack;

    // Deduct bet from bankroll
    const newBankroll = state.bankroll - state.currentBet;

    // If player has blackjack, skip to resolution
    if (playerHand.isBlackjack) {
      set({
        phase: 'resolution',
        shoe: finalShoe,
        dealerHand,
        playerHands: [playerHand],
        currentHandIndex: 0,
        bankroll: newBankroll,
      });
      setTimeout(() => get().resolveHand(), 1000);
      return;
    }

    set({
      phase: 'playerTurn',
      shoe: finalShoe,
      dealerHand,
      playerHands: [playerHand],
      currentHandIndex: 0,
      bankroll: newBankroll,
    });
  },

  hit: () => {
    const state = get();
    if (state.phase !== 'playerTurn') return;

    const currentHand = state.playerHands[state.currentHandIndex];
    if (!currentHand || currentHand.isStanding || currentHand.isBusted) return;

    // Record the decision
    get().recordDecision('Hit');

    const { card, remainingShoe } = dealCard(state.shoe);
    const updatedHands = [...state.playerHands];
    updatedHands[state.currentHandIndex] = {
      ...currentHand,
      cards: [...currentHand.cards, card],
    };

    // Check if busted
    const handValue = evaluateHand(updatedHands[state.currentHandIndex].cards);
    if (handValue.isBusted) {
      updatedHands[state.currentHandIndex].isBusted = true;
      updatedHands[state.currentHandIndex].isActive = false;
    }

    set({ shoe: remainingShoe, playerHands: updatedHands });

    // Move to next hand or dealer turn
    if (handValue.isBusted) {
      setTimeout(() => get().moveToNextHand(), 500);
    }
  },

  stand: () => {
    const state = get();
    if (state.phase !== 'playerTurn') return;

    const currentHand = state.playerHands[state.currentHandIndex];
    if (!currentHand || currentHand.isStanding) return;

    // Record the decision
    get().recordDecision('Stand');

    const updatedHands = [...state.playerHands];
    updatedHands[state.currentHandIndex] = {
      ...currentHand,
      isStanding: true,
      isActive: false,
    };

    set({ playerHands: updatedHands });
    setTimeout(() => get().moveToNextHand(), 500);
  },

  double: () => {
    const state = get();
    if (state.phase !== 'playerTurn') return;
    if (!get().canPlayerDouble()) return;

    const currentHand = state.playerHands[state.currentHandIndex];
    if (!currentHand) return;

    // Record the decision
    get().recordDecision('Double');

    const { card, remainingShoe } = dealCard(state.shoe);
    const updatedHands = [...state.playerHands];
    updatedHands[state.currentHandIndex] = {
      ...currentHand,
      cards: [...currentHand.cards, card],
      bet: currentHand.bet * 2,
      isDoubled: true,
      isStanding: true,
      isActive: false,
    };

    // Check if busted
    const handValue = evaluateHand(updatedHands[state.currentHandIndex].cards);
    if (handValue.isBusted) {
      updatedHands[state.currentHandIndex].isBusted = true;
    }

    // Deduct additional bet
    const newBankroll = state.bankroll - currentHand.bet;

    set({ shoe: remainingShoe, playerHands: updatedHands, bankroll: newBankroll });
    setTimeout(() => get().moveToNextHand(), 500);
  },

  split: () => {
    const state = get();
    if (state.phase !== 'playerTurn') return;
    if (!get().canPlayerSplit()) return;

    const currentHand = state.playerHands[state.currentHandIndex];
    if (!currentHand || currentHand.cards.length !== 2) return;

    // Record the decision
    get().recordDecision('Split');

    const [card1, card2] = currentHand.cards;

    // Deal new cards to each split hand
    const { card: newCard1, remainingShoe: shoe1 } = dealCard(state.shoe);
    const { card: newCard2, remainingShoe: finalShoe } = dealCard(shoe1);

    const hand1: Hand = {
      cards: [card1, newCard1],
      bet: currentHand.bet,
      isActive: true,
      isStanding: false,
      isDoubled: false,
      isBusted: false,
      isBlackjack: false,
    };

    const hand2: Hand = {
      cards: [card2, newCard2],
      bet: currentHand.bet,
      isActive: false,
      isStanding: false,
      isDoubled: false,
      isBusted: false,
      isBlackjack: false,
    };

    const updatedHands = [...state.playerHands];
    updatedHands[state.currentHandIndex] = hand1;
    updatedHands.splice(state.currentHandIndex + 1, 0, hand2);

    // Deduct additional bet
    const newBankroll = state.bankroll - currentHand.bet;

    set({ shoe: finalShoe, playerHands: updatedHands, bankroll: newBankroll });
  },

  moveToNextHand: () => {
    const state = get();
    const nextIndex = state.currentHandIndex + 1;

    if (nextIndex < state.playerHands.length) {
      const updatedHands = [...state.playerHands];
      updatedHands[nextIndex].isActive = true;
      set({ currentHandIndex: nextIndex, playerHands: updatedHands });
    } else {
      // All player hands complete, move to dealer turn
      set({ phase: 'dealerTurn' });
      setTimeout(() => get().playDealerHand(), 1000);
    }
  },

  playDealerHand: () => {
    const state = get();
    if (state.phase !== 'dealerTurn') return;

    // Check if any player hands are not busted
    const hasActivePlayerHand = state.playerHands.some((h) => !h.isBusted);

    if (!hasActivePlayerHand) {
      // All player hands busted, skip dealer play
      set({ phase: 'resolution' });
      setTimeout(() => get().resolveHand(), 1000);
      return;
    }

    // Dealer plays
    let dealerCards = [...state.dealerHand.cards];
    let shoe = state.shoe;

    while (dealerShouldHit(dealerCards)) {
      const { card, remainingShoe } = dealCard(shoe);
      dealerCards.push(card);
      shoe = remainingShoe;
    }

    const dealerValue = evaluateHand(dealerCards);
    const updatedDealerHand = {
      ...state.dealerHand,
      cards: dealerCards,
      isBusted: dealerValue.isBusted,
    };

    set({ dealerHand: updatedDealerHand, shoe, phase: 'resolution' });
    setTimeout(() => get().resolveHand(), 1000);
  },

  resolveHand: () => {
    const state = get();
    let winnings = 0;

    const dealerValue = evaluateHand(state.dealerHand.cards);

    for (const playerHand of state.playerHands) {
      const playerValue = evaluateHand(playerHand.cards);

      if (playerHand.isBlackjack && !state.dealerHand.isBlackjack) {
        // Blackjack pays 3:2
        winnings += playerHand.bet * 2.5;
      } else if (playerHand.isBusted) {
        // Player loses (already deducted)
        continue;
      } else if (dealerValue.isBusted) {
        // Dealer busts, player wins
        winnings += playerHand.bet * 2;
      } else if (playerValue.value > dealerValue.value) {
        // Player wins
        winnings += playerHand.bet * 2;
      } else if (playerValue.value === dealerValue.value) {
        // Push - return bet
        winnings += playerHand.bet;
      }
      // else player loses (already deducted)
    }

    const newBankroll = state.bankroll + winnings;

    // Update stats
    const newStats = { ...state.stats };
    newStats.handsPlayed += 1;
    localStorage.setItem('blackjack_stats', JSON.stringify(newStats));

    set({
      bankroll: newBankroll,
      stats: newStats,
      phase: 'betting',
      currentBet: 0,
      currentHandIndex: 0,
    });
  },

  recordDecision: (playerAction: Action) => {
    const state = get();
    const currentHand = state.playerHands[state.currentHandIndex];
    if (!currentHand) return;

    const dealerUpcard = getDealerUpcard(state.dealerHand);
    const handValue = evaluateHand(currentHand.cards);

    const canDoubleNow = get().canPlayerDouble();
    const canSplitNow = get().canPlayerSplit();

    const isCorrect = isCorrectAction(
      currentHand.cards,
      dealerUpcard,
      playerAction,
      canDoubleNow,
      canSplitNow,
      state.currentLevel
    );

    const correctDecision = getBasicStrategyAction(
      currentHand.cards,
      dealerUpcard,
      canDoubleNow,
      canSplitNow,
      state.currentLevel
    );

    // Create decision record
    const record: DecisionRecord = {
      playerHand: handValue,
      dealerUpcard,
      correctAction: correctDecision.action,
      playerAction,
      isCorrect,
      level: state.currentLevel,
      timestamp: Date.now(),
    };

    // Update stats
    const newStats = { ...state.stats };
    const recentDecisions = [record, ...newStats.recentDecisions].slice(0, ROLLING_WINDOW_SIZE);
    newStats.recentDecisions = recentDecisions;

    if (isCorrect) {
      newStats.correctMoves += 1;
      newStats.byLevel[state.currentLevel].correct += 1;
    } else {
      newStats.incorrectMoves += 1;
      newStats.byLevel[state.currentLevel].incorrect += 1;
    }

    // Calculate accuracy
    const totalMoves = newStats.correctMoves + newStats.incorrectMoves;
    newStats.accuracy = totalMoves > 0 ? (newStats.correctMoves / totalMoves) * 100 : 0;

    // Update level accuracy
    const levelTotal =
      newStats.byLevel[state.currentLevel].correct + newStats.byLevel[state.currentLevel].incorrect;
    newStats.byLevel[state.currentLevel].accuracy =
      levelTotal > 0
        ? (newStats.byLevel[state.currentLevel].correct / levelTotal) * 100
        : 0;

    // Check if level should unlock
    const recentAccuracy = calculateRecentAccuracy(recentDecisions, state.currentLevel);
    const shouldUnlockNext = recentAccuracy >= 90 && recentDecisions.filter(d => d.level === state.currentLevel).length >= ROLLING_WINDOW_SIZE;

    let newLevels = [...state.levels];
    if (shouldUnlockNext && state.currentLevel < 4) {
      const nextLevelIndex = state.currentLevel; // Array is 0-indexed
      if (!newLevels[nextLevelIndex].unlocked) {
        newLevels[nextLevelIndex] = { ...newLevels[nextLevelIndex], unlocked: true };
      }
    }

    localStorage.setItem('blackjack_stats', JSON.stringify(newStats));

    // Show feedback if incorrect
    if (!isCorrect) {
      set({
        showFeedback: true,
        feedbackMessage: correctDecision.reason,
        stats: newStats,
        levels: newLevels,
      });
    } else {
      set({ stats: newStats, levels: newLevels });
    }
  },

  toggleTrainingMode: () => {
    const state = get();
    const newMode = !state.trainingMode;
    set({ trainingMode: newMode });

    // Create new shoe based on mode
    const shoe = newMode
      ? createRiggedShoe(state.currentLevel === 4 ? 'pair' : state.currentLevel === 3 ? 'soft' : 'hard')
      : createShoe();
    set({ shoe });
  },

  resetBankroll: () => {
    set({ bankroll: INITIAL_BANKROLL, phase: 'betting', currentBet: 0 });
  },

  canPlayerDouble: () => {
    const state = get();
    const currentHand = state.playerHands[state.currentHandIndex];
    if (!currentHand) return false;
    return canDouble(currentHand, state.bankroll);
  },

  canPlayerSplit: () => {
    const state = get();
    const currentHand = state.playerHands[state.currentHandIndex];
    if (!currentHand) return false;
    return canSplit(currentHand, state.bankroll);
  },

  getCurrentHand: () => {
    const state = get();
    return state.playerHands[state.currentHandIndex];
  },

  getDealerUpcardValue: () => {
    const state = get();
    return getDealerUpcard(state.dealerHand);
  },
}));
