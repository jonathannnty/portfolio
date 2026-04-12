/**
 * Coursework shown on /about. Group entries by category for the UI.
 * Add new courses by appending to the array.
 * Grades omitted intentionally.
 */

export type Course = {
  code: string;
  title: string;
  institution: string;
  term: string;
  category: "Systems" | "Theory" | "AI/ML" | "Math" | "Other";
  note?: string;
};

export const coursework: Course[] = [
  // ── Systems ────────────────────────────────────────────────────
  {
    code: "CSE 15L",
    title: "Software Tools & Techniques Lab",
    institution: "UC San Diego",
    term: "Winter 2024",
    category: "Systems",
    note: "Hands-on with Git, Bash, shell scripting, testing, and the everyday toolchain of industry software development.",
  },
  {
    code: "CSE 30",
    title: "Computer Organization & Systems Programming",
    institution: "UC San Diego",
    term: "Spring 2024",
    category: "Systems",
    note: "x86 assembly, processor design, and the memory hierarchy — builds intuition for performance and low-level debugging.",
  },
  {
    code: "CSE 100",
    title: "Advanced Data Structures",
    institution: "UC San Diego",
    term: "Fall 2024",
    category: "Systems",
    note: "C++ and STL: balanced BSTs, graphs, priority queues, and hash tables with rigorous complexity analysis.",
  },
  {
    code: "CSE 110",
    title: "Software Engineering",
    institution: "UC San Diego",
    term: "Spring 2025",
    category: "Systems",
    note: "Agile methods, specifications, testing, CI, and team-based delivery — mirrors production engineering workflows.",
  },
  {
    code: "CSE 120",
    title: "Operating Systems Principles",
    institution: "UC San Diego",
    term: "Fall 2025",
    category: "Systems",
    note: "Processes, scheduling, synchronization primitives, virtual memory, and file systems — essential for backend and infra roles.",
  },

  // ── Theory ─────────────────────────────────────────────────────
  {
    code: "CSE 20",
    title: "Discrete Mathematics",
    institution: "UC San Diego",
    term: "Spring 2024",
    category: "Theory",
    note: "Logic, proof techniques, sets, relations, and combinatorics — the mathematical backbone of algorithm reasoning.",
  },
  {
    code: "CSE 21",
    title: "Mathematics for Algorithms & Systems",
    institution: "UC San Diego",
    term: "Summer 2024",
    category: "Theory",
    note: "Counting methods, recurrences, and asymptotic analysis for reasoning about algorithm performance.",
  },
  {
    code: "CSE 101",
    title: "Design & Analysis of Algorithms",
    institution: "UC San Diego",
    term: "Winter 2025",
    category: "Theory",
    note: "Divide & conquer, dynamic programming, greedy algorithms, and graph algorithms — core technical interview material.",
  },
  {
    code: "CSE 105",
    title: "Theory of Computation",
    institution: "UC San Diego",
    term: "Spring 2025",
    category: "Theory",
    note: "Finite automata, regular expressions, context-free grammars, and decidability — formal foundations of compilers and parsers.",
  },

  // ── AI/ML ───────────────────────────────────────────────────────
  {
    code: "CSE 151A",
    title: "ML: Learning Algorithms",
    institution: "UC San Diego",
    term: "Fall 2025",
    category: "AI/ML",
    note: "Supervised and unsupervised learning: kNN, decision trees, boosting, perceptrons, and k-means from scratch.",
  },
  {
    code: "CSE 158",
    title: "Recommender Systems & Web Mining",
    institution: "UC San Diego",
    term: "Fall 2025",
    category: "AI/ML",
    note: "Practical predictive analytics and recommendation engines on real-world datasets using ML and regression techniques.",
  },
  {
    code: "CSE 150B",
    title: "AI: Search and Reasoning",
    institution: "UC San Diego",
    term: "Spring 2026",
    category: "AI/ML",
    note: "A*, adversarial search, MCTS, constraint satisfaction, and reinforcement learning. (In Progress)",
  },
  {
    code: "COGS 108",
    title: "Data Science in Practice",
    institution: "UC San Diego",
    term: "Sprign 2025",
    category: "AI/ML",
    note: "End-to-end data science in Python: wrangling, statistical analysis, visualization, and communicating findings.",
  },

  // ── Math ────────────────────────────────────────────────────────
  {
    code: "MATH 18",
    title: "Linear Algebra",
    institution: "UC San Diego",
    term: "Summer 2024",
    category: "Math",
    note: "Matrix operations, eigenvalues/vectors, and linear transformations — mathematical backbone of ML and graphics.",
  },
  {
    code: "MATH 187A",
    title: "Introduction to Cryptography",
    institution: "UC San Diego",
    term: "Winter 2026",
    category: "Math",
    note: "Classical ciphers, DES, RSA, and public-key systems — relevant to security engineering and protocol design.",
  },
  {
    code: "MATH 170A",
    title: "Intro Numerical Analysis: Linear Algebra",
    institution: "UC San Diego",
    term: "Spring 2026",
    category: "Math",
    note: "Numerical methods for solving linear systems, least squares, and eigenvalue problems computationally. (In Progress)",
  },

  // ── Other ───────────────────────────────────────────────────────
  {
    code: "CSE 193",
    title: "Introduction to CS Research",
    institution: "UC San Diego",
    term: "Fall 2024",
    category: "Other",
    note: "Defined research problems, read and reviewed technical papers, and proposed an original CS research project.",
  },
  {
    code: "COGS 127",
    title: "Data-Driven UX / Product Design",
    institution: "UC San Diego",
    term: "Spring 2026",
    category: "Other",
    note: "User research, data-informed prototyping, and usability testing — relevant for product-minded engineering roles. (In Progress)",
  },
];