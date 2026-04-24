/**
 * Professional experiences rendered by the interactive Timeline on /about.
 * Sorted newest-first by sortKey.
 *
 * To add a new experience: append an object to the `experiences` array.
 * Fields marked optional can be omitted.
 */

export type Experience = {
  /** Short, stable id used as the React key and anchor hash. */
  id: string;
  role: string;
  company: string;
  /** Free-form date range, e.g. "Jun 2024 – Present" or "Summer 2023". */
  period: string;
  /** Used for sorting; ISO yyyy-mm so "ongoing" roles sort first. */
  sortKey: string;
  location?: string;
  /** 1-2 sentence summary shown in the collapsed timeline node. */
  summary: string;
  /** Bullet list revealed when the node expands. */
  highlights: string[];
  /** Technologies used — rendered as chips. */
  stack?: string[];
  /** Optional external link (company page, project showcase, etc). */
  link?: { label: string; href: string };
  /** Optional images shown in the expanded timeline node. */
  images?: string[];
  /**
   * Optional geographic anchor used by the About-page flyover to snap this
   * experience to the nearest point on the route at ingestion time.
   */
  geo?: { lat: number; lng: number };
  /**
   * Optional per-experience display hints for the About-page flyover.
   * All fields optional; sensible defaults apply.
   *   - `slot`:      pin the card to a specific corner instead of the
   *                  default diagonal rotation.
   *   - `emphasis`:  "high" scales the marker up + widens the active
   *                  window; "low" tones it down. Defaults to "normal".
   *   - `window`:    override the default ±6% active-checkpoint window
   *                  (0..1). Useful when a role needs a longer dwell.
   */
  flyover?: {
    slot?:
      | "bottom-left"
      | "bottom-right"
      | "top-left"
      | "top-right";
    emphasis?: "low" | "normal" | "high";
    window?: number;
  };
};

export const experiences: Experience[] = [
  {
    id: "ia-dsa",
    role: "Instructional Assistant — Data Structures & OOD",
    company: "UC San Diego CSE Department",
    period: "Jan 2026 – Present",
    // current role
    sortKey: "9999-01",
    location: "La Jolla, CA",
    summary:
      "Teaching staff for Prof. Paul Cao across two quarters, supporting 400 students in Data Structures and Object-Oriented Design.",
    highlights: [
      "Assisted courses covering Data Structures & Algorithms (linked lists, deques, binary trees, hash tables) and object-oriented design with Java.",
      "Analyzed and debugged student code across 400 submissions; graded 120 exams over two quarters.",
      "Held weekly office hours and provided one-on-one debugging support to reinforce conceptual understanding.",
    ],
    stack: ["Java", "Algorithms", "Data Structures"],
    link: {
      label: "UC San Diego CSE",
      href: "https://cse.ucsd.edu",
    },
  },
  {
    id: "it-technician",
    role: "IT Technician",
    company: "UC San Diego",
    // current role
    period: "Aug 2025 – Present",
    sortKey: "2025-08",
    location: "La Jolla, CA",
    summary:
      "Tier-1 and Tier-2 technical support for 1,000+ students, faculty, and staff across network, account, and EdTech issues.",
    highlights: [
      "Resolved 1,500+ tickets via ServiceNow, using Splunk and Google Admin to investigate logs and troubleshoot authentication errors.",
      "Assisted with wireless and network-related issues (device onboarding, connectivity failures) using Cisco ISE and DNAC.",
      "Supported users across Zoom, phone, and ticketing channels for issues spanning network connectivity, account access, and campus platforms.",
    ],
    stack: ["ServiceNow", "Cisco ISE", "Cisco DNAC", "Splunk", "Google Admin"],
    link: {
      label: "IT Service Desk",
      href: "https://cse.ucsd.edu",
    },
    images: ["/images/its-group.jpg"],
  },
  {
    id: "ai-research-fellow",
    role: "AI Research Fellow",
    company: "Handshake",
    period: "Sep 2025 – Oct 2025",
    sortKey: "2025-09",
    summary:
      "Selected fellow assisting with data training and evaluation on image editing tasks for a top AI lab.",
    highlights: [
      "Assisted with data training on image editing pipelines for a leading AI research lab.",
    ],
    link: {
      label: "Handshake AI",
      href: "https://joinhandshake.com/blog/our-team/introducing-handshake-ai/",
    },
    images: ["/images/handshake-ai.png"],
  },
  {
    id: "swe-intern-aimia",
    role: "Software Development Intern",
    company: "Aimia Career Advisor Services",
    period: "Jun 2025 – Sep 2025",
    sortKey: "2025-06",
    location: "San Diego, CA",
    summary:
      "Built user-facing components, authentication flows, and a RESTful API backend for a Next.js/React career-advising platform.",
    highlights: [
      "Designed, developed, and integrated user-facing components and auth flows in a Next.js/React application with responsive UI and session management.",
      "Managed state and implemented custom React hooks (useState, useEffect, useRouter) across 15+ modules.",
      "Designed RESTful API services with Express.js, Mongoose, and JWT: defined MongoDB schema, built a backend profile endpoint, and implemented secure CRUD operations.",
    ],
    stack: ["Next.js", "React", "Express.js", "MongoDB", "Mongoose", "JWT"],
  },
  {
    id: "undergrad-researcher",
    role: "Undergraduate Researcher",
    company: "UC San Diego CSE Department",
    period: "Sep 2024 – Jun 2025",
    sortKey: "2024-09",
    location: "La Jolla, CA",
    summary:
      "10-month independent research project on audio-based human activity recognition in a 3-person undergraduate team.",
    highlights: [
      "Contributed to developing a novel audio-based system for human activity recognition, enabling efficient, scalable, and device-agnostic data collection.",
      "Collaborated in a year-long 3-person undergraduate team alongside a graduate student mentor.",
    ],
    stack: ["Python", "Signal Processing", "Machine Learning"],
    link: {
      label: "UC San Diego Early Research Scholars Program",
      href: "https://ersp.ucsd.edu/",
    },
  },
  {
    id: "marketing-specialist",
    role: "Marketing Specialist",
    company: "UC San Diego",
    period: "Jun 2024 – Jun 2025",
    sortKey: "2024-06",
    location: "La Jolla, CA",
    summary:
      "Designed marketing materials and digital assets for the Student Involvement leadership program, contributing to measurable engagement growth.",
    highlights: [
      "Designed marketing materials, newsletters, and digital assets for the Student Involvement leadership program.",
      "Collaborated with a 4-person student team to facilitate program registration, event scheduling, mailing lists, workshop support, and database management.",
      "Contributed to a 15.2% participant rate increase and 38.9% newsletter readership rate increase in Fall Quarter year-over-year.",
    ],
    stack: ["Canva", "Email Marketing", "Database Management"],
  },
  {
    id: "cse-peer-advisor",
    role: "CSE Peer Advisor",
    company: "UC San Diego Chancellor's Associates Scholars Program",
    period: "Jun 2024 – Jun 2025",
    sortKey: "2024-06",
    location: "La Jolla, CA",
    summary:
      "Guided 17 Chancellor Associates scholars in Computer Science through academic planning, professional development, and campus support services.",
    highlights: [
      "Guided 17 Chancellor Associates scholar students in CS through on-campus support services and peer counseling, achieving an 82% compliance rate with bi-quarterly meetings.",
      "Advised academic planning and professional development for low-income, first-generation students majoring in Computer Science.",
    ],
    link: {
      label: "UC San Diego Chancellor's Associates Scholars Program",
      href: "https://casp.ucsd.edu/",
    },
  },
  {
    id: "cosmos-ta",
    role: "Undergraduate Teacher Assistant (COSMOS)",
    company: "UC San Diego Jacobs School of Engineering",
    period: "Jun 2024 – Aug 2024",
    sortKey: "2024-06",
    location: "La Jolla, CA",
    summary:
      "Developed and delivered collegiate-level course content for a 30-student high school STEM cohort at UC San Diego.",
    highlights: [
      "Collaborated with a 7-person instructional team to develop collegiate-level course content for high school students.",
      "Assisted in overseeing laboratory experiments and supported lead faculty for a 30-student class.",
      "Led a team of 5 on a final project component on science communication involving Dye-Sensitized Solar Cells (DSSCs) research.",
    ],
    stack: ["Science Communication", "Curriculum Development"],
    link: {
      label: "COSMOS UCSD",
      href: "https://jacobsschool.ucsd.edu/cosmos",
    },
  },
];
