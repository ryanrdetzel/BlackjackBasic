# Blackjack Basic Strategy Trainer

A progressive, client-side Blackjack Basic Strategy training application built with React, TypeScript, and Tailwind CSS.

## Features

### 🎮 Progressive Learning System
- **4-Tier Curriculum**: Master blackjack strategy through progressive levels
  - Level 1: Hard Totals (Hit vs Stand)
  - Level 2: Hard Totals + Doubling
  - Level 3: Soft Totals (Ace logic)
  - Level 4: Pairs & Splits (Complete strategy)

### 📊 Real-Time Feedback & Analytics
- Instant feedback on incorrect moves with detailed explanations
- Comprehensive statistics tracking
- Rolling accuracy window (last 20 decisions) for level progression
- LocalStorage persistence for all stats and progress

### 🎯 Training Mode
- **Rigged Deck**: Prioritizes dealing relevant hands for your current level
- **Free Play Mode**: Standard random shoe for realistic practice

### 🎰 Classic Casino Theme
- Dark green felt background with gold accents
- Realistic card rendering
- Professional chip designs
- Smooth animations and transitions

### 💰 Bankroll Management
- Start with $1,000 virtual bankroll
- Bet management with multiple chip denominations ($10, $25, $50, $100)
- Reset option when bankroll reaches zero

### 🃏 Complete Blackjack Engine
- 6-deck shoe with proper shuffling
- Dealer stands on all 17s
- Full support for: Hit, Stand, Double Down, Split
- Proper soft hand evaluation
- Blackjack detection and payouts (3:2)

## Tech Stack

- **Framework**: React 18 with Vite
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Package Manager**: pnpm
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm 8+

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Deployment

The project is configured for easy deployment to GitHub Pages:

```bash
pnpm deploy
```

Or use the included GitHub Actions workflow that automatically deploys on push to `main`.

## Project Structure

```
src/
├── components/          # React components
│   ├── Card.tsx        # Playing card component
│   ├── Hand.tsx        # Hand display component
│   ├── ActionButtons.tsx
│   ├── BettingControls.tsx
│   ├── FeedbackModal.tsx
│   ├── GameArea.tsx
│   ├── Header.tsx
│   ├── ProgressCircle.tsx
│   └── StatsPanel.tsx
├── engine/             # Game logic
│   ├── deck.ts         # Card and shoe management
│   ├── handEvaluator.ts # Hand value calculation
│   └── strategy.ts     # Basic strategy engine
├── store/              # State management
│   └── gameStore.ts    # Zustand store
├── types/              # TypeScript definitions
│   └── index.ts
└── styles/             # Global styles
    └── index.css
```

## How It Works

### Basic Strategy Engine
The app implements mathematically optimal blackjack basic strategy for 6-deck games where dealer stands on all 17s. The strategy engine:
- Takes player hand and dealer upcard as input
- Returns the correct action (Hit, Stand, Double, Split)
- Provides detailed explanations for why an action is correct
- Adjusts recommendations based on current level restrictions

### Progression System
Players must maintain ≥90% accuracy over their last 20 decisions to unlock the next level. This ensures mastery at each stage before advancing to more complex scenarios.

### Training Mode
When enabled, the deck is "rigged" to deal hands relevant to your current level:
- Level 1-2: Prioritizes non-Ace cards for hard totals
- Level 3: Prioritizes Aces and low cards for soft hands
- Level 4: Increases frequency of pairs

## Development

### Code Quality
- Strict TypeScript with no implicit any
- Modular, testable architecture
- Separation of concerns (UI, game logic, state management)
- Type-safe strategy engine

### Future Enhancements
- Additional rule variations (dealer hits soft 17, etc.)
- Card counting training mode
- Multiplayer support
- Achievement system
- Export/import progress

## License

MIT

## Credits

Built with ❤️ using React, TypeScript, and Tailwind CSS