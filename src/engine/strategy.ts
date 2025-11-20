import { Action, Card, HandType, Level, StrategyDecision } from '../types';
import { evaluateHand, getHandType } from './handEvaluator';

// Strategy lookup tables based on basic strategy for 6-deck, dealer stands on all 17s
// H = Hit, S = Stand, D = Double (if not allowed, then Hit), Ds = Double (if not allowed, then Stand)
// P = Split

type StrategyAction = 'H' | 'S' | 'D' | 'Ds' | 'P';

// Hard totals strategy (player value, dealer upcard 2-11)
const HARD_TOTALS: { [key: number]: StrategyAction[] } = {
  // Dealer upcard: 2,  3,  4,  5,  6,  7,  8,  9, 10,  A
  21: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
  20: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
  19: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
  18: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
  17: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
  16: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
  15: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
  14: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
  13: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
  12: ['H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
  11: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
  10: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'],
  9: ['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
  8: ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
  7: ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
  6: ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
  5: ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
};

// Soft totals strategy (player value with Ace, dealer upcard 2-11)
const SOFT_TOTALS: { [key: number]: StrategyAction[] } = {
  // Dealer upcard: 2,  3,  4,  5,  6,  7,  8,  9, 10,  A
  21: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // A-10 (Blackjack)
  20: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // A-9
  19: ['S', 'S', 'S', 'S', 'Ds', 'S', 'S', 'S', 'S', 'S'], // A-8
  18: ['Ds', 'Ds', 'Ds', 'Ds', 'Ds', 'S', 'S', 'H', 'H', 'H'], // A-7
  17: ['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'], // A-6
  16: ['H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'], // A-5
  15: ['H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'], // A-4
  14: ['H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'], // A-3
  13: ['H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'], // A-2
};

// Pairs strategy (pair rank, dealer upcard 2-11)
const PAIRS: { [key: string]: StrategyAction[] } = {
  // Dealer upcard: 2,  3,  4,  5,  6,  7,  8,  9, 10,  A
  'A-A': ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  '10-10': ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
  '9-9': ['P', 'P', 'P', 'P', 'P', 'S', 'P', 'P', 'S', 'S'],
  '8-8': ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  '7-7': ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'],
  '6-6': ['P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H', 'H'],
  '5-5': ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'],
  '4-4': ['H', 'H', 'H', 'P', 'P', 'H', 'H', 'H', 'H', 'H'],
  '3-3': ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'],
  '2-2': ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'],
};

/**
 * Get the dealer upcard index for strategy lookup (0-9)
 */
function getDealerIndex(dealerUpcard: number): number {
  if (dealerUpcard === 11) return 9; // Ace
  return dealerUpcard - 2; // 2-10 maps to 0-8
}

/**
 * Convert strategy action to actual action based on game state
 */
function convertStrategyAction(
  strategyAction: StrategyAction,
  canDouble: boolean,
  canSplit: boolean
): Action {
  if (strategyAction === 'H') return 'Hit';
  if (strategyAction === 'S') return 'Stand';
  if (strategyAction === 'P') return canSplit ? 'Split' : 'Hit';
  if (strategyAction === 'D') return canDouble ? 'Double' : 'Hit';
  if (strategyAction === 'Ds') return canDouble ? 'Double' : 'Stand';
  return 'Hit';
}

/**
 * Get explanation for why an action is correct
 */
function getActionReason(
  handType: HandType,
  playerValue: number,
  dealerUpcard: number,
  action: Action
): string {
  const dealerCard = dealerUpcard === 11 ? 'Ace' : dealerUpcard.toString();

  if (handType === 'pair') {
    if (action === 'Split') {
      if (playerValue === 22) return `Always split Aces. You get two chances at 21.`;
      if (playerValue === 16) return `Always split 8s. Starting with 16 is weak, but 8 is a good starting point.`;
      if (dealerUpcard >= 2 && dealerUpcard <= 6) {
        return `Split against dealer's weak upcard (${dealerCard}). Dealer likely to bust.`;
      }
      return `Splitting gives you better odds than playing as a single hand.`;
    }
  }

  if (handType === 'soft') {
    if (action === 'Double') {
      return `Soft ${playerValue} vs ${dealerCard}: Double to maximize value. You can't bust on the next card.`;
    }
    if (action === 'Hit') {
      return `Soft ${playerValue} vs ${dealerCard}: Hit to improve your hand. You can't bust with a soft total.`;
    }
    if (action === 'Stand') {
      return `Soft ${playerValue} vs ${dealerCard}: Stand. Your hand is strong enough.`;
    }
  }

  // Hard totals
  if (action === 'Stand') {
    if (dealerUpcard >= 2 && dealerUpcard <= 6) {
      return `You have ${playerValue} vs dealer's ${dealerCard}. Stand and let the dealer bust.`;
    }
    if (playerValue >= 17) {
      return `You have ${playerValue}. Standing is safest - hitting risks busting.`;
    }
    return `Stand with ${playerValue} against dealer's ${dealerCard}.`;
  }

  if (action === 'Hit') {
    if (playerValue <= 11) {
      return `You have ${playerValue}. You can't bust, so always hit.`;
    }
    if (dealerUpcard >= 7) {
      return `Dealer shows ${dealerCard} (strong). You need to improve your ${playerValue}.`;
    }
    return `Hit to improve your ${playerValue} against dealer's ${dealerCard}.`;
  }

  if (action === 'Double') {
    if (playerValue === 11) {
      return `Always double on 11. Great chance to hit 21, and dealer is at a disadvantage.`;
    }
    if (playerValue === 10 && dealerUpcard <= 9) {
      return `Double on 10 vs ${dealerCard}. High probability of hitting 20.`;
    }
    return `Double on ${playerValue} vs ${dealerCard} to maximize value in a favorable situation.`;
  }

  return `Basic strategy says ${action} in this situation.`;
}

/**
 * Get the correct action according to Basic Strategy
 */
export function getBasicStrategyAction(
  playerCards: Card[],
  dealerUpcard: number,
  canDoubleDown: boolean,
  canSplitHand: boolean,
  currentLevel: Level
): StrategyDecision {
  const handValue = evaluateHand(playerCards);
  const handType = getHandType(playerCards);
  const dealerIndex = getDealerIndex(dealerUpcard);

  let strategyAction: StrategyAction = 'H';

  // Level restrictions
  if (currentLevel === 1) {
    // Level 1: Only hard totals, no doubling
    if (handType === 'hard') {
      strategyAction = HARD_TOTALS[handValue.value]?.[dealerIndex] || 'H';
      // Override any double to hit for level 1
      if (strategyAction === 'D' || strategyAction === 'Ds') {
        strategyAction = 'H';
      }
    } else {
      strategyAction = 'H'; // Not at this level yet
    }
  } else if (currentLevel === 2) {
    // Level 2: Hard totals with doubling
    if (handType === 'hard') {
      strategyAction = HARD_TOTALS[handValue.value]?.[dealerIndex] || 'H';
    } else {
      strategyAction = 'H'; // Not at this level yet
    }
  } else if (currentLevel === 3) {
    // Level 3: Hard totals + Soft totals (with doubling)
    if (handType === 'soft') {
      strategyAction = SOFT_TOTALS[handValue.value]?.[dealerIndex] || 'H';
    } else if (handType === 'hard') {
      strategyAction = HARD_TOTALS[handValue.value]?.[dealerIndex] || 'H';
    } else {
      // Treat pairs as hard totals for level 3
      strategyAction = HARD_TOTALS[handValue.value]?.[dealerIndex] || 'H';
    }
  } else if (currentLevel === 4) {
    // Level 4: Complete strategy including pairs
    if (handType === 'pair') {
      const pairKey = `${playerCards[0].rank}-${playerCards[1].rank}`;
      // Normalize face cards
      const normalizedKey =
        ['J', 'Q', 'K'].includes(playerCards[0].rank) ? '10-10' : pairKey;
      strategyAction = PAIRS[normalizedKey]?.[dealerIndex] || 'H';
    } else if (handType === 'soft') {
      strategyAction = SOFT_TOTALS[handValue.value]?.[dealerIndex] || 'H';
    } else {
      strategyAction = HARD_TOTALS[handValue.value]?.[dealerIndex] || 'H';
    }
  }

  const action = convertStrategyAction(strategyAction, canDoubleDown, canSplitHand);
  const reason = getActionReason(handType, handValue.value, dealerUpcard, action);

  return { action, reason };
}

/**
 * Check if a player's action matches basic strategy
 */
export function isCorrectAction(
  playerCards: Card[],
  dealerUpcard: number,
  playerAction: Action,
  canDoubleDown: boolean,
  canSplitHand: boolean,
  currentLevel: Level
): boolean {
  const correctDecision = getBasicStrategyAction(
    playerCards,
    dealerUpcard,
    canDoubleDown,
    canSplitHand,
    currentLevel
  );
  return correctDecision.action === playerAction;
}
