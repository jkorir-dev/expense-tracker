# Global Expense Tracker

A simple web application built to help international freelancers, cross-border shoppers, and travelers keep track of spending across different foreign currencies without having to do manual conversions.

The Problem It Solves
When you buy items from international shops or travel between countries, it is very easy to lose track of what you actually spent because every receipt uses a different currency. This app unifies your spending. You can log an expense in any currency and the app instantly converts its value into your chosen Home Currency using live, accurate exchange rates.

Key Features
- Live Currency Sync: Fetches real-time exchange rates using a free REST API.
- Immutable State Tracking: Uses JavaScript spread operators to update values cleanly without overwriting older data.
- Smart Filter System: Instantly filters your expense list by categories like Food, Transport, Shopping, or Entertainment.
- Strict Date Constraints: Limits the date picker to past dates to prevent logging future expenses by accident.
- Resilient Offline Fallback: Automatically falls back to a backup rate system if the network fails so the app never breaks.

Tech Stack
- API: Open ExchangeRate-API
- Modules: Native ES Modules (api, state, utils, ui, main)
- Code Quality: ESLint
- Testing: Jest with Babel

How to Run and Test Locally

1. Installation Setup
Clone the GitHub repository to your computer and install the local packages:
git clone https://github.com
cd expense-tracker
npm install

2. Run the Unit Tests
Verify all currency conversions, totals, and category filters are passing perfectly inside Jest:
npm test

3. Run the Code Linter Check
Scan your code files for formatting or syntax issues:
npm run lint

Future Improvements
- Persistent Storage: Connect localStorage so logged expenses are saved even when you refresh the browser page.
- Visual Charts: Add a chart showing a visual breakdown of your expenses by category.
