Role: You are an expert Senior Frontend Engineer specializing in React, TypeScript, and Game Development.

Goal: Build a client-side, progressive Blackjack Basic Strategy Trainer. The application must be a "Client Only" Single Page Application (SPA) with no backend. It must use localStorage for data persistence.

Tech Stack:

Framework: React (via Vite).

Language: TypeScript.

Package Manager: pnpm.

Styling: Tailwind CSS (Configured for a "Classic Casino" aesthetic).

Deployment: Configured for easy deployment to GitHub Pages.

Core Game Architecture
Blackjack Engine:

Implement a standard Blackjack engine.

Rules: Dealer stands on 17 (Soft 17 logic customizable, default to Stand). 6 Deck Shoe.

Actions: Hit, Stand, Double Down, Split. No Surrender.

Splitting: Player can split pairs. This creates two distinct hands. The UI must handle rendering multiple player hands side-by-side and indicating which hand is currently active.

Bankroll: User starts with $1000. Bankroll allows betting, but hitting $0 allows a manual reset.

Basic Strategy Logic:

Implement a strictly typed Basic Strategy Engine. This should take the Player's Hand (value and type) and Dealer's Upcard and return the mathematically correct move (Hit, Stand, Double, Split).

Note: Double Down is only strictly correct if allowed. If the user has insufficient funds or has already hit, the engine should suggest the next best move (usually Hit or Stand).

The Progression System (The "Curriculum")
The app must feature a tiered learning system. Users cannot advance to the next tier until they maintain a specific accuracy threshold (e.g., 90%) over a rolling window of hands (e.g., the last 20 decisions) in the current tier.

Tiers:

Level 1: Hard Totals. (No doubling logic yet, just Hit vs Stand).

Level 2: Hard Totals + Doubling. (Introduce when to Double on hard totals).

Level 3: Soft Totals. (Ace logic).

Level 4: Pairs & Splits. (Complete strategy).

Training Mode vs. Free Play:

Create a global setting toggle: Training Mode.

When ON: The "Dealer" (Deck Manager) should rig the shoe. It should prioritize dealing hands relevant to the user's current level. (e.g., If on Level 4, deal frequent pairs).

When OFF: Deal a standard random shoe.

UI & UX Requirements
1. Header / Progression Row:

Display the Tiers horizontally.

Locked tiers are greyed out.

Current tier is highlighted.

Visual Indicator: Each tier has a generic circular progress bar (SVG or CSS).

The circle fills up based on the user's "Correct Move Percentage" for that specific tier.

If accuracy drops, the circle drains.

When the circle is full (e.g., >90% accuracy), the next level unlocks.

2. Game Area (Classic Style):

Theme: Dark green felt background, gold/white accents.

Dealer: Top center. Cards hidden until valid.

Player: Bottom center.

Controls: Large, clear buttons for Hit, Stand, Double, Split. Buttons should be disabled if the action is invalid (e.g., cannot split non-pairs).

3. Feedback & Stats:

Real-time Feedback: If the user clicks a move that disagrees with Basic Strategy:

Pause the game immediately.

Show a modal/overlay explaining Why it was wrong (e.g., "Dealer shows 6, you have 12. Basic Strategy says Stand because the dealer is likely to bust").

Update the "Incorrect" stat counter.

Stats Panel (Footer):

Show cumulative stats: Hands Played, Correct Moves, Incorrect Moves, Accuracy %.

Stats must be saved to localStorage. Resetting the Bankroll does not reset these learning stats.

Technical Implementation Details
State Management: Use a robust React Context or State store (Zustand is acceptable, or complex useReducer) to handle the game phase (betting, dealing, playerTurn, dealerTurn, resolution).

Components:

Card: Should render visually nice cards (CSS or SVG assets).

Hand: Renders a set of cards.

Chip: For betting.

ProgressCircle: The visual indicator for the levels.

Code Quality:

Strict TypeScript interfaces for Card, Hand, GameState.

Modularize the StrategyEngine so it is testable.

Build:

Ensure vite.config.ts is set up with base: './' for relative paths on GitHub Pages.

Deliverables: Please generate the project structure, the core game logic (engine and strategy), and the React components to render the full game.