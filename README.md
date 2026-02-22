# 🧮 AlgoClassroom — 60+ Interactive Algorithm Visualizations

Pure HTML, CSS, and JavaScript. No frameworks. No build tools. Just open and run.

---

## 📁 Folder Architecture

```
algo-classroom/
│
├── index.html                          ← Main homepage with all algorithm cards + live search
│
├── assets/
│   ├── css/
│   │   └── main.css                   ← Shared design system (variables, components, layout)
│   └── js/
│       ├── main.js                    ← Search, TTS utils, speed control, shared utilities
│       └── algo-base.js               ← AlgoPage class — shared play/pause/step/reset logic
│
├── components/
│   └── placeholder-template.html      ← Template for "coming soon" algorithm pages
│
├── generate-placeholders.js           ← Node.js script to auto-create all stub pages
│
└── algorithms/
    ├── sorting/                        ← 10 sorting algorithms
    │   ├── bubble-sort.html            ★ FULLY IMPLEMENTED — use as template
    │   ├── selection-sort.html
    │   ├── insertion-sort.html
    │   ├── merge-sort.html
    │   ├── quick-sort.html
    │   ├── heap-sort.html
    │   ├── counting-sort.html
    │   ├── radix-sort.html
    │   ├── shell-sort.html
    │   └── tim-sort.html
    │
    ├── searching/                      ← 7 searching algorithms
    │   ├── binary-search.html          ★ FULLY IMPLEMENTED
    │   ├── linear-search.html
    │   ├── jump-search.html
    │   ├── interpolation-search.html
    │   ├── exponential-search.html
    │   ├── ternary-search.html
    │   └── fibonacci-search.html
    │
    ├── graph/                          ← 12 graph algorithms
    │   ├── bfs.html                    ★ FULLY IMPLEMENTED
    │   ├── dfs.html
    │   ├── dijkstra.html
    │   ├── bellman-ford.html
    │   ├── floyd-warshall.html
    │   ├── kruskal.html
    │   ├── prim.html
    │   ├── topological-sort.html
    │   ├── union-find.html
    │   ├── tarjan.html
    │   ├── a-star.html
    │   └── kosaraju.html
    │
    ├── dynamic-programming/            ← 10 DP algorithms
    │   ├── fibonacci.html
    │   ├── knapsack.html
    │   ├── lcs.html
    │   ├── lis.html
    │   ├── edit-distance.html
    │   ├── coin-change.html
    │   ├── matrix-chain.html
    │   ├── subset-sum.html
    │   ├── rod-cutting.html
    │   └── longest-palindrome.html
    │
    ├── data-structures/                ← 10 data structure visualizations
    │   ├── stack.html
    │   ├── queue.html
    │   ├── linked-list.html
    │   ├── binary-search-tree.html
    │   ├── avl-tree.html
    │   ├── heap.html
    │   ├── hash-table.html
    │   ├── trie.html
    │   ├── segment-tree.html
    │   └── fenwick-tree.html
    │
    ├── string/                         ← 6 string algorithms
    │   ├── kmp.html
    │   ├── rabin-karp.html
    │   ├── z-algorithm.html
    │   ├── manacher.html
    │   ├── suffix-array.html
    │   └── aho-corasick.html
    │
    ├── math/                           ← 5 math algorithms
    │   ├── sieve-of-eratosthenes.html
    │   ├── euclidean-gcd.html
    │   ├── fast-power.html
    │   ├── prime-factorization.html
    │   └── modular-inverse.html
    │
    └── backtracking/                   ← 6 backtracking algorithms
        ├── n-queens.html
        ├── sudoku-solver.html
        ├── maze-solver.html
        ├── permutations.html
        ├── subset-generation.html
        └── graph-coloring.html
```

---

## 🚀 Getting Started

1. **Open `index.html`** in a browser — no server needed, no npm install, nothing.
2. Click any algorithm card to open its visualization page.
3. Use **▶ Play**, **⏭ Next Step**, and **⏮ Reset** to control animations.

> **Note on TTS (Text-to-Speech):** Narration uses the browser's Web Speech API. This works best in Chrome or Edge. TTS may require a local server on some systems — you can use `npx serve .` or VS Code's Live Server extension.

---

## 🏗️ How to Implement a New Algorithm Page

All 60+ pages follow the same pattern. Use `bubble-sort.html` as your template.

### Step 1 — Copy the template
```bash
cp algorithms/sorting/bubble-sort.html algorithms/sorting/my-algo.html
```

### Step 2 — Update metadata
- Change the `<title>` tag
- Update the header icon, name, category, difficulty, and complexity chips
- Write a brief description

### Step 3 — Write `buildXxxSteps(input)`
This function returns an array of step objects:
```javascript
{
  narration: "What the teacher says this step",
  phase: "compare" | "swap" | "active" | "done" | "idle",
  // Any custom fields needed for rendering
}
```

### Step 4 — Write `drawXxx(step)`
Render the current visualization state on a `<canvas>` element.
Use the CSS variables from `main.css` for colors.

### Step 5 — Wire up `AlgoPage`
```javascript
const page = new AlgoPage({
  onRenderStep(step, idx) {
    drawXxx(step);
    AlgoUtils.setStatus({ ... });
  },
  onReset() {
    // Clear canvas and reset UI
  }
});

// Set steps after building them
page.setSteps(buildXxxSteps(myData));
```

---

## 🎨 Design System

All CSS variables are in `assets/css/main.css`:

| Variable | Value | Use |
|----------|-------|-----|
| `--teal` | `#00d4aa` | Primary accent, active state |
| `--blue` | `#4da6ff` | Secondary accent |
| `--orange` | `#ff8c42` | Compare / highlight |
| `--yellow` | `#ffd166` | Target / found |
| `--green` | `#06d6a0` | Sorted / done / correct |
| `--pink` | `#ff6b9d` | Swap / mutation |
| `--text-dim` | `#445a7a` | Muted text |
| `--border` | `#1a2740` | Panel borders |

Fonts: **JetBrains Mono** (code/numbers) + **Syne** (UI text)

---

## 🔧 Shared Utilities

`window.AlgoUtils` exposes:

```javascript
AlgoUtils.delay(ms)              // Promise-based delay
AlgoUtils.speak(text, onEnd)     // TTS narration
AlgoUtils.stopSpeech()           // Cancel TTS
AlgoUtils.setStatus(fields)      // Update status bar fields by id
AlgoUtils.setProgress(curr, total)
AlgoUtils.setPhase(phase)        // Update phase badge
AlgoUtils.parseArray(str)        // Parse "1,2,3" → [1,2,3]
AlgoUtils.randomArray(len,min,max)
AlgoUtils.highlightLine(lineNum) // Highlight pseudocode line
AlgoUtils.hexToRgb(hex)          // '#ff0000' → '255,0,0'
```

`window.AlgoPage` class provides:
```javascript
page.setSteps(steps)   // Load step array
page.play()            // Auto-play with TTS
page.pause()
page.nextStep()
page.reset()
page.togglePlay()
```

---

## 📊 Algorithm Count

| Category | Count | Implemented |
|----------|-------|-------------|
| Sorting | 10 | bubble-sort ✅ |
| Searching | 7 | (binary-search stub) |
| Graph | 12 | bfs ✅ |
| Dynamic Programming | 10 | — |
| Data Structures | 10 | — |
| String | 6 | — |
| Math | 5 | — |
| Backtracking | 6 | — |
| **Total** | **66** | **2 full + 64 stubs** |

---

## 🔄 Re-generating Placeholder Pages

If you add new algorithms to `generate-placeholders.js`:
```bash
node generate-placeholders.js
# Existing pages are skipped, only new ones are created
```

---

## 📝 License

Free to use, modify, and distribute. Educational use encouraged.
