# ♟️ Order & Chaos — AI Strategy Game

<div align="center">

  **A strategic 6×6 board game of pattern and disruption.**  
  *Play against an intelligent AI opponent powered by Minimax with Alpha-Beta Pruning.*

  [![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Play_Now-6366f1?style=for-the-badge)](https://order-chaos-ai-engine.vercel.app/)
  [![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/A-P-S-Bhaidav/order-chaos-ai-engine)

</div>

---

## 📋 Table of Contents

- [About the Game](#-about-the-game)
- [Features](#-features)
- [Game Rules](#-game-rules)
- [AI Algorithm](#-ai-algorithm)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)

---

## 🎮 About the Game

Order and Chaos is an asymmetric two-player strategy game played on a 6×6 grid. Unlike traditional games, each player has a fundamentally **different objective**:

- **🎯 Order** aims to create a straight line of 5 identical symbols.
- **🌀 Chaos** aims to prevent any such line from forming.

The twist? Both players can place **either** X or O on any turn — making this a deep strategic challenge.

The game is played over **two rounds**, with players swapping roles to ensure fairness.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **Intelligent AI** | Minimax algorithm with Alpha-Beta Pruning for optimal play |
| 🎨 **Premium UI** | Dark glassmorphism theme with smooth animations |
| 🔄 **Two-Round Match** | Complete match system with role swapping |
| 📊 **Tiebreaker Logic** | Move count and straight-4 comparison |
| ⚙️ **3 Difficulty Levels** | Easy, Medium, Hard (adjustable search depth) |
| 🧵 **Web Worker** | AI computation runs off-thread — no UI freezing |
| 📱 **Responsive Design** | Works on desktop, tablet, and mobile |
| 📖 **In-App Rules** | Complete rules accessible from any screen |
| ♿ **Accessible** | ARIA labels, keyboard navigation, semantic HTML |

---

## 📜 Game Rules

### Overview
Order and Chaos is played on a **6×6 grid** over **two rounds**. One player is **Order** (pattern builder) and the other is **Chaos** (pattern preventer). After Round 1, roles swap.

### Gameplay
1. **Order** always goes first in each round.
2. Players alternate turns.
3. On each turn, a player places **either X or O** in any empty cell.

### Objectives
| Role | Goal |
|------|------|
| 🎯 **Order** | Create a line of **5 identical symbols** (all X or all O) in a row, column, or diagonal |
| 🌀 **Chaos** | Fill the board **without** any 5-in-a-row forming |

### End of a Round
- **Order wins** if a straight-5 is achieved → round ends immediately.
- **Chaos wins** if the board fills completely with no straight-5.

### Second Round
- Players **swap roles** (Order ↔ Chaos).
- The board resets to empty.

### Winning the Game (After Both Rounds)

**Case 1: Round 1's Order achieved 5-in-a-row**
| Scenario | Winner |
|----------|--------|
| R2 Order also gets 5-in-a-row in **fewer moves** | R2 Order's player |
| R2 Order gets 5-in-a-row in **same moves**, more straight-4s | R2 Order's player |
| R2 Order gets 5-in-a-row in **same moves**, same straight-4s | **Draw** |
| R2 Order fails to get 5-in-a-row | R1 Order's player |

**Case 2: Round 1's Order did NOT achieve 5-in-a-row**
| Scenario | Winner |
|----------|--------|
| R2 Order achieves 5-in-a-row | R2 Order's player |
| Neither Order achieves 5-in-a-row, more straight-4s | That player |
| Neither achieves, same straight-4s | **Draw** |

### Pattern Definitions
- **Straight 5**: 5 consecutive identical symbols in a row, column, or diagonal.
- **Straight 4**: 4 consecutive identical symbols — used as a tiebreaker.

### Example Scenario
> Round 1: Player 1 (Order) wins with 5-in-a-row in 18 moves.  
> Round 2: Player 2 (now Order) gets 5-in-a-row in 20 moves.  
> **Result: Player 1 wins** (fewer moves).

---

## 🧠 AI Algorithm

### Minimax with Alpha-Beta Pruning

The AI uses the **Minimax** algorithm — a decision-making algorithm for adversarial games. It explores possible future game states and picks the move that leads to the best outcome.

**Alpha-Beta Pruning** optimizes this by cutting off branches that can't affect the final decision, reducing the search space dramatically.

```
                    MAX (Order)
                   /     |     \
              MIN (Chaos)  ...   ...
             /    \
         MAX       MAX
        / \       / \
      ...  ...  ...  ...
      
  α-β pruning eliminates branches ✂️
```

### Heuristic Evaluation Function

Since searching the entire game tree is impossible (6×6 board × 2 symbols = massive branching factor), the AI uses a **heuristic evaluation function** to score board states:

| Pattern | Score |
|---------|-------|
| 5 identical in a window | ±100,000 (win/loss) |
| 4 identical + 1 empty | ±10,000 |
| 3 identical + 2 empty | ±500 |
| 2 identical + 3 empty | ±50 |
| Mixed symbols in window | -10 (favors Chaos) |
| Center cell control | +2 bonus |

The evaluation is **asymmetric**: positive scores favor Order, negative scores favor Chaos.

### Search Depth by Difficulty

| Difficulty | Search Depth | Strength |
|------------|-------------|----------|
| 🟢 Easy | 2 levels | Casual play |
| 🟡 Medium | 3 levels | Competitive |
| 🔴 Hard | 4 levels | Very challenging |

### Move Ordering

To improve pruning efficiency, moves are ordered by:
1. **Center proximity** — center cells are strategically stronger.
2. This allows Alpha-Beta to prune more branches early.

### Web Worker

AI computation runs in a **Web Worker** (separate thread), ensuring the UI stays responsive even during deep searches.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework (bonus points!) |
| **Vite** | Build tool & dev server |
| **Vanilla CSS** | Styling (no Bootstrap/Tailwind) |
| **Web Workers** | Off-thread AI computation |
| **ES Modules** | Modern JavaScript modules |

---

## 📁 Project Structure

```
order-chaos-ai-engine/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Board.jsx          # 6×6 game grid
│   │   ├── GameOverModal.jsx  # Final results with confetti
│   │   ├── GamePage.jsx       # Main game layout
│   │   ├── HomePage.jsx       # Landing page with role/difficulty selection
│   │   ├── RoundEndModal.jsx  # Round results modal
│   │   ├── RulesModal.jsx     # Complete rules display
│   │   └── SymbolSelector.jsx # X/O toggle
│   ├── context/
│   │   └── GameContext.jsx    # React Context + useReducer state management
│   ├── engine/
│   │   ├── aiEngine.js        # Minimax + Alpha-Beta Pruning AI
│   │   ├── aiWorker.js        # Web Worker for async AI
│   │   └── gameLogic.js       # Core game rules & board logic
│   ├── App.jsx                # Root component
│   ├── index.css              # Global styles & design system
│   └── main.jsx               # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/A-P-S-Bhaidav/order-chaos-ai-engine.git

# Navigate to the project
cd order-chaos-ai-engine

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be running at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 🌐 Deployment

### Deploying to Vercel (Recommended)

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy from CLI**:
   ```bash
   vercel
   ```
   Follow the prompts. Vercel auto-detects Vite projects.

3. **Or deploy from GitHub**:
   - Go to [vercel.com](https://vercel.com)
   - Click **"Add New Project"**
   - Import your GitHub repository: `A-P-S-Bhaidav/order-chaos-ai-engine`
   - Vercel auto-detects the Vite framework
   - Click **Deploy** — done! ✅

### Deploying to Netlify (Alternative)

1. Go to [netlify.com](https://netlify.com)
2. Click **"Add new site" → "Import an existing project"**
3. Connect GitHub and select the repository
4. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **Deploy site**

### Environment

No environment variables are needed — this is a fully client-side application.

---

## 🖼️ Screenshots

### Home Screen
> Dark glassmorphism UI with role selection and difficulty picker.

### Game Board
> 6×6 interactive grid with glowing symbols, hover previews, and winning highlights.

### Game Over
> Comparison table of both rounds with confetti celebration.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <strong>Built with ❤️ using React + Vite</strong>
  <br />
  <em>AI powered by Minimax with Alpha-Beta Pruning</em>
</div>
