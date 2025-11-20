import { Card, Rank, Suit } from '../types';

const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

/**
 * Get the numeric value of a card rank
 */
export function getCardValue(rank: Rank): number {
  if (rank === 'A') return 11; // Aces start at 11, adjusted later in hand evaluation
  if (['J', 'Q', 'K'].includes(rank)) return 10;
  return parseInt(rank, 10);
}

/**
 * Create a single deck of 52 cards
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        suit,
        rank,
        value: getCardValue(rank),
      });
    }
  }
  return deck;
}

/**
 * Create a 6-deck shoe
 */
export function createShoe(): Card[] {
  const shoe: Card[] = [];
  for (let i = 0; i < 6; i++) {
    shoe.push(...createDeck());
  }
  return shuffle(shoe);
}

/**
 * Fisher-Yates shuffle algorithm
 */
export function shuffle(cards: Card[]): Card[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Deal a card from the shoe
 */
export function dealCard(shoe: Card[]): { card: Card; remainingShoe: Card[] } {
  if (shoe.length === 0) {
    // If shoe is empty, create a new shoe
    const newShoe = createShoe();
    return {
      card: newShoe[0],
      remainingShoe: newShoe.slice(1),
    };
  }

  return {
    card: shoe[0],
    remainingShoe: shoe.slice(1),
  };
}

/**
 * Create a rigged shoe for training mode
 * Prioritizes dealing specific hand types based on the current level
 */
export function createRiggedShoe(targetHandType: 'hard' | 'soft' | 'pair'): Card[] {
  const shoe = createShoe();
  const riggedCards: Card[] = [];

  // Find and prioritize specific cards based on target hand type
  if (targetHandType === 'pair') {
    // Prioritize pairs at the top
    const pairs: Card[] = [];
    const remaining: Card[] = [];

    shoe.forEach((card) => {
      if (pairs.length < 20) {
        pairs.push(card);
      } else {
        remaining.push(card);
      }
    });

    riggedCards.push(...shuffle(pairs), ...shuffle(remaining));
  } else if (targetHandType === 'soft') {
    // Prioritize Aces and low cards for soft hands
    const aces: Card[] = [];
    const lowCards: Card[] = [];
    const remaining: Card[] = [];

    shoe.forEach((card) => {
      if (card.rank === 'A') {
        aces.push(card);
      } else if (['2', '3', '4', '5', '6', '7', '8', '9'].includes(card.rank)) {
        lowCards.push(card);
      } else {
        remaining.push(card);
      }
    });

    riggedCards.push(...shuffle(aces), ...shuffle(lowCards), ...shuffle(remaining));
  } else {
    // For hard totals, avoid aces initially
    const noAces: Card[] = [];
    const aces: Card[] = [];

    shoe.forEach((card) => {
      if (card.rank === 'A') {
        aces.push(card);
      } else {
        noAces.push(card);
      }
    });

    riggedCards.push(...shuffle(noAces), ...shuffle(aces));
  }

  return riggedCards;
}
