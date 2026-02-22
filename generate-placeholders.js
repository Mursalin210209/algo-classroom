#!/usr/bin/env node
/**
 * AlgoClassroom — generate-placeholders.js
 * 
 * Run this script once to auto-generate placeholder HTML pages
 * for all algorithm stubs listed in index.html.
 * 
 * Usage: node generate-placeholders.js
 * 
 * Then replace each placeholder with a full implementation.
 */

const fs = require('fs');
const path = require('path');

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, 'components/placeholder-template.html'),
  'utf8'
);

const ALGORITHMS = [
  // SORTING
  { file: 'algorithms/sorting/selection-sort.html',    name: 'Selection Sort',       icon: '🎯', depth: '../..', desc: 'Find the minimum element and place it at the front each pass.', topics: ['<li>How to find min in unsorted portion</li>', '<li>O(n²) comparisons even if sorted</li>', '<li>In-place, unstable sort</li>'] },
  { file: 'algorithms/sorting/insertion-sort.html',    name: 'Insertion Sort',       icon: '🃏', depth: '../..', desc: 'Build the sorted array one element at a time, inserting each into its correct position.',  topics: ['<li>Adaptive — fast on nearly sorted data</li>', '<li>Stable sort preserving relative order</li>', '<li>Used inside TimSort and ShellSort</li>'] },
  { file: 'algorithms/sorting/merge-sort.html',        name: 'Merge Sort',           icon: '🔗', depth: '../..', desc: 'Divide and conquer — split array in half, recursively sort each half, then merge.', topics: ['<li>Divide and conquer paradigm</li>', '<li>O(n log n) guaranteed time</li>', '<li>Stable sort, external sort friendly</li>'] },
  { file: 'algorithms/sorting/quick-sort.html',        name: 'Quick Sort',           icon: '⚡', depth: '../..', desc: 'Choose a pivot, partition array around it, recursively sort each side.', topics: ['<li>Pivot selection strategies (random, median)</li>', '<li>In-place partitioning</li>', '<li>Average O(n log n), worst O(n²)</li>'] },
  { file: 'algorithms/sorting/heap-sort.html',         name: 'Heap Sort',            icon: '🏔️', depth: '../..', desc: 'Build a max-heap, extract maximum repeatedly to produce sorted order.', topics: ['<li>Heapify operation</li>', '<li>In-place O(n log n) guaranteed</li>', '<li>Heap data structure internals</li>'] },
  { file: 'algorithms/sorting/counting-sort.html',     name: 'Counting Sort',        icon: '🔢', depth: '../..', desc: 'Count occurrences of each value, then reconstruct the sorted array.', topics: ['<li>Non-comparison sort</li>', '<li>O(n+k) time, beats comparison lower bound</li>', '<li>Integer values only</li>'] },
  { file: 'algorithms/sorting/radix-sort.html',        name: 'Radix Sort',           icon: '📻', depth: '../..', desc: 'Sort integers digit by digit using a stable subroutine like counting sort.', topics: ['<li>LSD vs MSD radix sort</li>', '<li>O(nk) time complexity</li>', '<li>Integer and string sorting</li>'] },
  { file: 'algorithms/sorting/shell-sort.html',        name: 'Shell Sort',           icon: '🐚', depth: '../..', desc: 'Generalized insertion sort using gap sequences to move elements far apart.', topics: ['<li>Gap sequence selection</li>', '<li>Improves over insertion sort on large arrays</li>', '<li>Hard-to-analyze complexity</li>'] },
  { file: 'algorithms/sorting/tim-sort.html',          name: 'Tim Sort',             icon: '⏱️', depth: '../..', desc: 'Hybrid merge+insertion sort — the algorithm powering Python and Java.', topics: ['<li>Run detection in real data</li>', '<li>Adaptive merge strategy</li>', '<li>Galloping mode optimization</li>'] },

  // SEARCHING
  { file: 'algorithms/searching/linear-search.html',       name: 'Linear Search',       icon: '➡️', depth: '../..', desc: 'Scan each element one by one until the target is found.', topics: ['<li>O(n) worst case</li>', '<li>Works on unsorted data</li>', '<li>Sentinel optimization trick</li>'] },
  { file: 'algorithms/searching/binary-search.html',       name: 'Binary Search',       icon: '✂️', depth: '../..', desc: 'Halve the search space each step using sorted order.', topics: ['<li>Requires sorted array</li>', '<li>O(log n) time</li>', '<li>Finding insertion point (lower/upper bound)</li>'] },
  { file: 'algorithms/searching/jump-search.html',         name: 'Jump Search',         icon: '🦘', depth: '../..', desc: 'Jump ahead √n steps then linear search in the block.', topics: ['<li>Block size of √n</li>', '<li>O(√n) time complexity</li>', '<li>Trade-off between linear and binary</li>'] },
  { file: 'algorithms/searching/interpolation-search.html',name: 'Interpolation Search',icon: '📐', depth: '../..', desc: 'Estimate position based on value — faster for uniform distributions.', topics: ['<li>O(log log n) on uniform data</li>', '<li>Formula-based position estimation</li>', '<li>Degrades to O(n) on skewed data</li>'] },
  { file: 'algorithms/searching/exponential-search.html',  name: 'Exponential Search', icon: '📈', depth: '../..', desc: 'Grow range exponentially, then binary search.', topics: ['<li>O(log n) time</li>', '<li>Useful for unbounded arrays</li>', '<li>Find range, then binary search it</li>'] },
  { file: 'algorithms/searching/ternary-search.html',      name: 'Ternary Search',      icon: '🔱', depth: '../..', desc: 'Divide range into three parts to find maximum of unimodal function.', topics: ['<li>O(log₃ n) iterations</li>', '<li>Finding minimum/maximum of unimodal functions</li>', '<li>Geometric vs arithmetic comparison</li>'] },
  { file: 'algorithms/searching/fibonacci-search.html',    name: 'Fibonacci Search',    icon: '🌀', depth: '../..', desc: 'Use Fibonacci numbers to divide search range — avoids division.', topics: ['<li>Addition-only arithmetic</li>', '<li>O(log n) time</li>', '<li>Works on sorted arrays</li>'] },

  // GRAPH
  { file: 'algorithms/graph/dfs.html',              name: 'DFS',                    icon: '🌲', depth: '../..', desc: 'Explore as deep as possible before backtracking using a stack.', topics: ['<li>Recursive and iterative implementations</li>', '<li>Cycle detection</li>', '<li>Topological ordering via DFS</li>'] },
  { file: 'algorithms/graph/dijkstra.html',         name: "Dijkstra's Algorithm",   icon: '🗺️', depth: '../..', desc: 'Find shortest paths in weighted graphs using a greedy priority queue.', topics: ['<li>Priority queue (min-heap) usage</li>', '<li>Relaxation of edges</li>', '<li>Cannot handle negative weights</li>'] },
  { file: 'algorithms/graph/bellman-ford.html',     name: 'Bellman-Ford',           icon: '⚖️', depth: '../..', desc: 'Shortest paths with negative edge weights — detects negative cycles.', topics: ['<li>Relax all edges V-1 times</li>', '<li>Negative cycle detection</li>', '<li>O(VE) vs Dijkstra\'s O(E log V)</li>'] },
  { file: 'algorithms/graph/floyd-warshall.html',   name: 'Floyd-Warshall',         icon: '🔄', depth: '../..', desc: 'All-pairs shortest paths using dynamic programming.', topics: ['<li>O(V³) DP approach</li>', '<li>All-pairs shortest paths</li>', '<li>Negative cycle detection</li>'] },
  { file: 'algorithms/graph/kruskal.html',          name: "Kruskal's MST",          icon: '🌿', depth: '../..', desc: 'Build minimum spanning tree by greedily adding cheapest non-cycle edges.', topics: ['<li>Sort edges by weight</li>', '<li>Union-Find for cycle detection</li>', '<li>O(E log E) time</li>'] },
  { file: 'algorithms/graph/prim.html',             name: "Prim's MST",             icon: '🌱', depth: '../..', desc: 'Grow MST one vertex at a time using a priority queue.', topics: ['<li>Vertex-based growth</li>', '<li>Priority queue for minimum edge</li>', '<li>Dense graph performance</li>'] },
  { file: 'algorithms/graph/topological-sort.html', name: 'Topological Sort',       icon: '📋', depth: '../..', desc: 'Linear ordering of DAG vertices respecting dependency order.', topics: ['<li>DFS-based Kahn\'s algorithm</li>', '<li>Dependency resolution</li>', '<li>Detecting cycles in directed graphs</li>'] },
  { file: 'algorithms/graph/union-find.html',       name: 'Union-Find (DSU)',       icon: '🔗', depth: '../..', desc: 'Efficient data structure for tracking connected components.', topics: ['<li>Path compression</li>', '<li>Union by rank</li>', '<li>Near O(1) amortized operations</li>'] },
  { file: 'algorithms/graph/tarjan.html',           name: "Tarjan's SCC",           icon: '🌐', depth: '../..', desc: 'Find all strongly connected components in a directed graph.', topics: ['<li>DFS with discovery/low-link times</li>', '<li>Stack-based SCC extraction</li>', '<li>Single O(V+E) DFS pass</li>'] },
  { file: 'algorithms/graph/a-star.html',           name: 'A* Search',              icon: '⭐', depth: '../..', desc: 'Heuristic pathfinding — faster than Dijkstra with a good heuristic.', topics: ['<li>f(n) = g(n) + h(n) formula</li>', '<li>Admissible heuristics</li>', '<li>Grid pathfinding visualization</li>'] },
  { file: 'algorithms/graph/kosaraju.html',         name: "Kosaraju's SCC",         icon: '🧭', depth: '../..', desc: 'Two-pass DFS algorithm for strongly connected components.', topics: ['<li>First DFS builds finish order</li>', '<li>Transpose the graph</li>', '<li>Second DFS on transposed graph</li>'] },

  // DYNAMIC PROGRAMMING
  { file: 'algorithms/dynamic-programming/fibonacci.html',        name: 'Fibonacci DP',                   icon: '🐇', depth: '../..', desc: 'Classic memoization example — top-down vs bottom-up.', topics: ['<li>Overlapping subproblems</li>', '<li>Top-down with memoization</li>', '<li>Bottom-up tabulation</li>'] },
  { file: 'algorithms/dynamic-programming/knapsack.html',         name: '0/1 Knapsack',                   icon: '🎒', depth: '../..', desc: 'Maximize value with weight constraint — include or exclude.', topics: ['<li>2D DP table construction</li>', '<li>Backtracking chosen items</li>', '<li>Space optimization to O(W)</li>'] },
  { file: 'algorithms/dynamic-programming/lcs.html',              name: 'Longest Common Subsequence',     icon: '📏', depth: '../..', desc: 'Find longest subsequence common to two strings.', topics: ['<li>2D table visualization</li>', '<li>Difference from LCS substring</li>', '<li>Reconstruction of the sequence</li>'] },
  { file: 'algorithms/dynamic-programming/lis.html',              name: 'Longest Increasing Subsequence', icon: '📈', depth: '../..', desc: 'Find the longest strictly increasing subsequence.', topics: ['<li>O(n²) DP approach</li>', '<li>O(n log n) with patience sorting</li>', '<li>LIS reconstruction</li>'] },
  { file: 'algorithms/dynamic-programming/edit-distance.html',    name: 'Edit Distance',                  icon: '✏️', depth: '../..', desc: 'Minimum operations to transform one string to another.', topics: ['<li>Insert, delete, replace operations</li>', '<li>2D DP table</li>', '<li>Alignment visualization</li>'] },
  { file: 'algorithms/dynamic-programming/coin-change.html',      name: 'Coin Change',                    icon: '🪙', depth: '../..', desc: 'Minimum coins to make an amount.', topics: ['<li>1D DP table</li>', '<li>Unbounded knapsack variant</li>', '<li>Coin change II (count ways)</li>'] },
  { file: 'algorithms/dynamic-programming/matrix-chain.html',     name: 'Matrix Chain Multiplication',    icon: '🔢', depth: '../..', desc: 'Optimal parenthesization for minimum multiplications.', topics: ['<li>Interval DP</li>', '<li>Triangular DP table</li>', '<li>Reconstruction of optimal brackets</li>'] },
  { file: 'algorithms/dynamic-programming/subset-sum.html',       name: 'Subset Sum',                     icon: '➕', depth: '../..', desc: 'Can a subset of numbers equal the target?', topics: ['<li>Boolean DP table</li>', '<li>Subset reconstruction</li>', '<li>Variant: partition equal subset</li>'] },
  { file: 'algorithms/dynamic-programming/rod-cutting.html',      name: 'Rod Cutting',                    icon: '🔪', depth: '../..', desc: 'Maximize revenue by cutting rod into profitable pieces.', topics: ['<li>Unbounded knapsack pattern</li>', '<li>Optimal cut reconstruction</li>', '<li>Top-down and bottom-up</li>'] },
  { file: 'algorithms/dynamic-programming/longest-palindrome.html', name: 'Longest Palindromic Substring', icon: '🔁', depth: '../..', desc: 'Find the longest palindromic substring in O(n²).', topics: ['<li>Expand around center</li>', '<li>2D DP table approach</li>', '<li>Compare to Manacher O(n)</li>'] },

  // DATA STRUCTURES
  { file: 'algorithms/data-structures/stack.html',         name: 'Stack',            icon: '📚', depth: '../..', desc: 'LIFO data structure — push, pop, peek with call stack simulation.', topics: ['<li>Push, pop, peek operations</li>', '<li>Call stack visualization</li>', '<li>Balanced parentheses application</li>'] },
  { file: 'algorithms/data-structures/queue.html',         name: 'Queue',            icon: '🚶', depth: '../..', desc: 'FIFO structure — enqueue, dequeue with circular buffer.', topics: ['<li>Enqueue and dequeue</li>', '<li>Circular buffer implementation</li>', '<li>BFS queue connection</li>'] },
  { file: 'algorithms/data-structures/linked-list.html',   name: 'Linked List',      icon: '🔗', depth: '../..', desc: 'Singly and doubly linked lists — insert, delete, reverse.', topics: ['<li>Pointer traversal</li>', '<li>Insert and delete at position</li>', '<li>In-place reversal algorithm</li>'] },
  { file: 'algorithms/data-structures/binary-search-tree.html', name: 'Binary Search Tree', icon: '🌳', depth: '../..', desc: 'Insert, search, delete in BST with traversal orders.', topics: ['<li>BST property and ordering</li>', '<li>In-order, pre-order, post-order</li>', '<li>Deletion cases</li>'] },
  { file: 'algorithms/data-structures/avl-tree.html',      name: 'AVL Tree',         icon: '⚖️', depth: '../..', desc: 'Self-balancing BST with rotations.', topics: ['<li>Balance factor calculation</li>', '<li>Left, right, LR, RL rotations</li>', '<li>Guaranteed O(log n) height</li>'] },
  { file: 'algorithms/data-structures/heap.html',          name: 'Heap / Priority Queue', icon: '🏔️', depth: '../..', desc: 'Max-heap and min-heap with heapify operations.', topics: ['<li>Heap property</li>', '<li>Heapify up and down</li>', '<li>Priority queue applications</li>'] },
  { file: 'algorithms/data-structures/hash-table.html',    name: 'Hash Table',       icon: '🗄️', depth: '../..', desc: 'Key-value store with collision resolution strategies.', topics: ['<li>Hash function design</li>', '<li>Chaining vs open addressing</li>', '<li>Load factor and rehashing</li>'] },
  { file: 'algorithms/data-structures/trie.html',          name: 'Trie',             icon: '🌐', depth: '../..', desc: 'Prefix tree for efficient string search and autocomplete.', topics: ['<li>Insert and search in trie</li>', '<li>Prefix matching</li>', '<li>Autocomplete implementation</li>'] },
  { file: 'algorithms/data-structures/segment-tree.html',  name: 'Segment Tree',     icon: '🌿', depth: '../..', desc: 'Range queries and point updates in O(log n).', topics: ['<li>Build, query, update</li>', '<li>Range sum / min / max</li>', '<li>Lazy propagation</li>'] },
  { file: 'algorithms/data-structures/fenwick-tree.html',  name: 'Fenwick Tree (BIT)', icon: '🌱', depth: '../..', desc: 'Binary indexed tree for prefix sums.', topics: ['<li>BIT update and prefix query</li>', '<li>Lowbit trick</li>', '<li>Range query from prefix sums</li>'] },

  // STRING
  { file: 'algorithms/string/kmp.html',          name: 'KMP Pattern Search',  icon: '🔍', depth: '../..', desc: 'Knuth-Morris-Pratt efficient string matching using failure function.', topics: ['<li>Failure function (prefix table)</li>', '<li>Linear O(n+m) matching</li>', '<li>Avoiding repeated comparisons</li>'] },
  { file: 'algorithms/string/rabin-karp.html',   name: 'Rabin-Karp',          icon: '🎲', depth: '../..', desc: 'Rolling hash-based pattern matching for multiple patterns.', topics: ['<li>Rolling hash function</li>', '<li>Collision handling</li>', '<li>Multi-pattern search</li>'] },
  { file: 'algorithms/string/z-algorithm.html',  name: 'Z-Algorithm',         icon: '🔤', depth: '../..', desc: 'Build Z-array for O(n) pattern matching.', topics: ['<li>Z-array construction</li>', '<li>Pattern matching using Z-function</li>', '<li>Z-box maintenance</li>'] },
  { file: 'algorithms/string/manacher.html',     name: "Manacher's Algorithm", icon: '🔁', depth: '../..', desc: 'Find all palindromic substrings in O(n) time.', topics: ['<li>Palindrome radius array</li>', '<li>Mirror property exploitation</li>', '<li>O(n) palindrome enumeration</li>'] },
  { file: 'algorithms/string/suffix-array.html', name: 'Suffix Array',        icon: '📑', depth: '../..', desc: 'Sorted suffix array for powerful string queries.', topics: ['<li>O(n log n) construction</li>', '<li>LCP array computation</li>', '<li>String search applications</li>'] },
  { file: 'algorithms/string/aho-corasick.html', name: 'Aho-Corasick',        icon: '🎯', depth: '../..', desc: 'Multi-pattern string matching using trie with failure links.', topics: ['<li>Trie construction</li>', '<li>Failure link BFS build</li>', '<li>Linear-time multi-pattern search</li>'] },

  // MATH
  { file: 'algorithms/math/sieve-of-eratosthenes.html', name: 'Sieve of Eratosthenes', icon: '🔑', depth: '../..', desc: 'Find all primes up to N by eliminating multiples.', topics: ['<li>O(n log log n) time</li>', '<li>Segmented sieve for large N</li>', '<li>Prime counting function</li>'] },
  { file: 'algorithms/math/euclidean-gcd.html',         name: 'Euclidean GCD',         icon: '📐', depth: '../..', desc: 'Greatest Common Divisor and Extended Euclidean Algorithm.', topics: ['<li>Recursive and iterative GCD</li>', '<li>Extended Euclidean for Bezout coefficients</li>', '<li>LCM computation</li>'] },
  { file: 'algorithms/math/fast-power.html',            name: 'Fast Power',            icon: '⚡', depth: '../..', desc: 'Compute a^n in O(log n) by repeated squaring.', topics: ['<li>Binary representation of exponent</li>', '<li>Modular exponentiation</li>', '<li>Matrix fast power</li>'] },
  { file: 'algorithms/math/prime-factorization.html',   name: 'Prime Factorization',   icon: '🧬', depth: '../..', desc: 'Decompose a number into its prime factors.', topics: ['<li>Trial division up to √n</li>', '<li>Smallest prime factor sieve</li>', '<li>Factorization applications</li>'] },
  { file: 'algorithms/math/modular-inverse.html',       name: 'Modular Inverse',       icon: '🔀', depth: '../..', desc: 'Find modular multiplicative inverse using Extended Euclidean or Fermat.', topics: ['<li>Extended Euclidean method</li>', '<li>Fermat\'s little theorem method</li>', '<li>Applications in competitive programming</li>'] },

  // BACKTRACKING
  { file: 'algorithms/backtracking/n-queens.html',          name: 'N-Queens',           icon: '♛', depth: '../..', desc: 'Place N queens on N×N board with no conflicts.', topics: ['<li>Row-by-row placement</li>', '<li>Column and diagonal conflict detection</li>', '<li>Counting all solutions</li>'] },
  { file: 'algorithms/backtracking/sudoku-solver.html',     name: 'Sudoku Solver',      icon: '🔢', depth: '../..', desc: 'Solve 9×9 Sudoku using constraint-based backtracking.', topics: ['<li>Constraint propagation</li>', '<li>Backtracking with forward checking</li>', '<li>Empty cell selection strategy</li>'] },
  { file: 'algorithms/backtracking/maze-solver.html',       name: 'Maze Solver',        icon: '🌀', depth: '../..', desc: 'Find a path through a maze using recursive backtracking.', topics: ['<li>Four-directional movement</li>', '<li>Visited cell tracking</li>', '<li>Path reconstruction</li>'] },
  { file: 'algorithms/backtracking/permutations.html',      name: 'All Permutations',   icon: '🔀', depth: '../..', desc: 'Generate all permutations using swap-based backtracking.', topics: ['<li>Swap-based recursive generation</li>', '<li>Handling duplicates</li>', '<li>Lexicographic ordering</li>'] },
  { file: 'algorithms/backtracking/subset-generation.html', name: 'Subset Generation', icon: '📦', depth: '../..', desc: 'Generate all 2^n subsets — the power set.', topics: ['<li>Include/exclude decisions</li>', '<li>Bit manipulation approach</li>', '<li>Subsets with constraints</li>'] },
  { file: 'algorithms/backtracking/graph-coloring.html',    name: 'Graph Coloring',    icon: '🎨', depth: '../..', desc: 'Color graph with k colors so no adjacent vertices match.', topics: ['<li>Greedy baseline approach</li>', '<li>Backtracking with k colors</li>', '<li>NP-completeness context</li>'] },
];

ALGORITHMS.forEach(algo => {
  // Ensure directory exists
  const dir = path.dirname(algo.file);
  fs.mkdirSync(dir, { recursive: true });

  // Skip if file already exists (don't overwrite implemented pages)
  if (fs.existsSync(algo.file)) {
    console.log(`  SKIP (exists): ${algo.file}`);
    return;
  }

  const topics = algo.topics.join('\n        ');
  const html = TEMPLATE
    .replace(/ALGO_NAME/g, algo.name)
    .replace(/ALGO_ICON/g, algo.icon)
    .replace('ALGO_DESCRIPTION', algo.desc)
    .replace('ALGO_TOPICS', topics)
    .replace(/RELATIVE_PATH/g, algo.depth);

  fs.writeFileSync(algo.file, html, 'utf8');
  console.log(`  Created: ${algo.file}`);
});

console.log('\n✅ Done! All placeholder pages created.');
console.log('   Replace each with a full implementation like bubble-sort.html and bfs.html\n');
