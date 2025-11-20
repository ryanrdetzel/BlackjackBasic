import { Card, Hand, HandValue, HandType } from '../types';

/**
 * Evaluate a hand and return its value, soft/hard status, and bust status
 */
export function evaluateHand(cards: Card[]): HandValue {
  let value = 0;
  let aces = 0;

  // First pass: sum all values and count aces
  for (const card of cards) {
    value += card.value;
    if (card.rank === 'A') {
      aces += 1;
    }
  }

  // Adjust for aces if busted
  let isSoft = aces > 0;
  while (value > 21 && aces > 0) {
    value -= 10; // Convert an Ace from 11 to 1
    aces -= 1;
    isSoft = aces > 0; // Still soft if we have more aces
  }

  const isBusted = value > 21;
  const isBlackjack = cards.length === 2 && value === 21;

  return {
    value,
    isSoft,
    isBusted,
    isBlackjack,
  };
}

/**
 * Determine the hand type (hard, soft, or pair)
 */
export function getHandType(cards: Card[]): HandType {
  if (cards.length === 2 && cards[0].rank === cards[1].rank) {
    return 'pair';
  }

  const hasAce = cards.some((card) => card.rank === 'A');
  const handValue = evaluateHand(cards);

  // Soft hand: has an Ace counted as 11
  if (hasAce && handValue.isSoft && !handValue.isBusted) {
    return 'soft';
  }

  return 'hard';
}

/**
 * Check if a hand can be split
 */
export function canSplit(hand: Hand, bankroll: number): boolean {
  return (
    hand.cards.length === 2 &&
    hand.cards[0].rank === hand.cards[1].rank &&
    bankroll >= hand.bet
  );
}

/**
 * Check if a hand can be doubled
 */
export function canDouble(hand: Hand, bankroll: number): boolean {
  return hand.cards.length === 2 && !hand.isDoubled && bankroll >= hand.bet;
}

/**
 * Check if dealer should hit (dealer stands on all 17s)
 */
export function dealerShouldHit(dealerHand: Card[]): boolean {
  const handValue = evaluateHand(dealerHand);
  return handValue.value < 17;
}

/**
 * Get the dealer's upcard value
 */
export function getDealerUpcard(dealerHand: Hand): number {
  if (dealerHand.cards.length === 0) return 0;
  const upcard = dealerHand.cards[0];
  // For strategy purposes, Ace is always 11
  return upcard.value;
}

/**
 * Get simplified hand value for strategy lookup (2-21)
 */
export function getStrategyHandValue(cards: Card[]): number {
  const handValue = evaluateHand(cards);
  return Math.min(handValue.value, 21);
}
