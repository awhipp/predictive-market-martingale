# Predictive Market Martingale Calculator

A variable-odds martingale scaling tool built with React and Vite, designed to manage capital and position sizing in prediction markets.

## Overview

The standard Martingale strategy involves doubling down after every loss to recoup previous losses and win a base profit unit. However, prediction markets operate with variable odds (contract prices ranging from $0.01 to $0.99), meaning a fixed 2x multiplier is inefficient and often mathematically incorrect.

This calculator dynamically adjusts your required stake based on:

1. **Target Profit**: Your baseline goal for the session.
2. **Cumulative Losses**: The sum of capital deployed in the current losing streak.
3. **Current Contract Price (Odds)**: The real-time cost of the contract (representing the probability of the event occurring).

## Primary Use Case: 50-50 Events

While this tool can be used across various probability ranges, it is primarily designed and most effective for **~50% probability events** (contract prices between $0.45 and $0.55).

### Why 50-50 Events?

1. **Optimal Risk-to-Reward Ratio**: At $0.50, the payout is 2x your stake. The required scaling is manageable.
2. **Avoiding Extreme Capital Requirements**:
   - **Chasing Favorites (Price > $0.70)**: If you lose a bet on a favorite and try to martingale the next favorite, the high cost of the contract requires a massive capital outlay just to break even.
   - **Longshots (Price < $0.30)**: While cheap, the win probability is so low that experiencing a long losing streak is statistically highly probable, which eventually breaks the bankroll.
3. **Mean Reversion**: 50-50 events (like coin tosses or evenly matched crypto 15-minute intervals) are less prone to extreme, prolonged streaks compared to low-probability longshots.

## Features

- **Session Tracker**: Automatically tallies your active losing streak and calculates session profit/loss.
- **Dynamic Stake Calculation**: Calculates exactly how much you need to stake to cover losses and hit your target profit based on real-time contract prices.
- **Risk Assessment Panel**: Provides visual warnings when entering dangerous pricing zones (e.g., chasing favorites).
- **Trade History**: A detailed log of all pending, won, and lost positions.

## Development Setup

This project uses Vite, React, and Tailwind CSS v4.

### Prerequisites

- Node.js (v18+)
- npm or pnpm

### Running Locally

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

## License

MIT
