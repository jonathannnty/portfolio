/**
 * Projects rendered on /projects and /projects/[slug].
 *
 * To add a project: append to the `projects` array with a unique `slug`.
 * `body` is an array of paragraph strings so you can write longer writeups
 * without needing MDX.
 */

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "pullQuote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt: string };

export type ProjectSubsection = {
  heading?: string;
  content: ContentBlock[];
};

export type ProjectSection = {
  heading: string;
  subsections: ProjectSubsection[];
};

export type Project = {
  slug: string;
  title: string;
  /** One-sentence hook shown on cards. */
  tagline: string;
  /** Year or date range shown as metadata. */
  period: string;
  /** Sort key — ISO yyyy-mm so newest projects surface first. */
  sortKey: string;
  /** Short tags shown on the card (languages, frameworks). */
  stack: string[];
  /** Optional links — repo, live demo, writeup. */
  links?: { label: string; href: string }[];
  /** Full writeup, one paragraph per array entry. */
  body: string[];
  /** Whether to show this on the home page "featured work" strip. */
  featured?: boolean;
  /** Thumbnail image path shown on project cards (relative to /public). */
  thumbnail?: string;
  /** Gallery images shown on the detail page (relative to /public). */
  images?: string[];
  /** Full-bleed background image for the project page hero area (relative to /public). */
  heroImage?: string;
  /** Structured write-up sections. When present, replaces the flat body array. */
  sections?: ProjectSection[];
  /** When true the card shows an "In Progress" overlay and blocks navigation. */
  inProgress?: boolean;
};

export const projects: Project[] = [
  {
    slug: "idle-sidebar-source-control",
    title: "IDLE Sidebar with Source Control Integration",
    tagline:
      "Split-view diff visualization for Python's IDLE editor with git integration and line-by-line highlighting.",
    period: "March 2026",
    sortKey: "2026-03",
    stack: ["Python", "Git", "Tkinter", "Testing", "UI/UX", "GitHub Copilot"],
    body: [
      "For a team project in computational linguistics, we built a source-control sidebar feature for Python's IDLE integrated development environment. The goal was to give Python developers native diff visibility and version control context without leaving the editor.",
      "I specialized in the diff visualization layer, implementing line-by-line syntax highlighting for added/removed/modified code, plus a gutter UI with contextual markers (±). This required tight integration with IDLE's split-view architecture and careful handling of viewport synchronization to keep line numbers aligned across panes.",
      "I also owned test coverage for the split-view diff behavior, ensuring marker accuracy, synchronization correctness, and edge cases around empty diffs and large files. My commits concentrated on user-facing clarity — making it obvious what changed and why — while the core git engine and sidebar scaffolding were handled by teammates.",
      "The project followed a branch-heavy workflow with parallel feature streams that converged in the final integration phase. The work shipped as a functional prototype ready for demo.",
    ],
    links: [
      {
        label: "GitHub Repository",
        href: "https://github.com/jontan3/group-project-team-super-cool-heh",
      },
    ],
    thumbnail: "/images/IDLE-thumbnail.png",
    heroImage: "/images/IDLE-thumbnail.png",
  },
  {
    slug: "cogs127-case-study",
    title: "Get It Done, For The Rest Of Us",
    tagline:
      "Extending San Diego's civic reporting app to the students who walk past the potholes every morning.",
    period: "June 2026",
    sortKey: "2026-04",
    stack: ["UX Research", "User Interviews", "Figma", "Prototyping"],
    links: [
      // {
      //   label: "GitHub Repository",
      //   href: "https://github.com/jonathannnty/portfolio.git",
      // },
    ],
    body: [],
    thumbnail: "/images/get-it-done-thumbnail.png",
    heroImage: "/images/get-it-done-thumbnail.png",
    images: ["/images/kid-walking.jpg", "/images/kid-walking2.png"],
    sections: [
      {
        heading: "Overview",
        subsections: [
          {
            heading: "The pitch",
            content: [
              {
                type: "paragraph",
                text: "San Diego has an app called Get It Done. You take a photo of a pothole, broken streetlight, or pile of illegal dumping, the city receives the report, and someone eventually fixes it. Since 2016, it has received around 3.5 million service requests.",
              },
              {
                type: "paragraph",
                text: "The app also requires anyone aged 13 to 17 to have an adult agree to its terms of service before they can use it. That seemed like a strange decision to me, because the group most likely to notice a broken bus stop on the way to school is the same group that has to ask a parent for permission before reporting it.",
              },
              {
                type: "paragraph",
                text: "Our team thought that was worth looking into.",
              },
            ],
          },
          {
            heading: "Team",
            content: [
              {
                type: "paragraph",
                text: "Ashley Padilla, Jonathan Ty, Julie Nguyen, Ruth Mazariego Lemus. COGS 127, Spring 2026.",
              },
            ],
          },
          {
            heading: "Why this project",
            content: [
              {
                type: "paragraph",
                text: "I didn't pick this project because I had strong feelings about civic technology. I picked it because I've lived in San Diego long enough to walk past the same pothole on the same block for two years, and at some point I just stopped noticing it. I think most people who live here have a version of that story. The broken thing stops registering after a while, and you start to assume the street has always looked that way.",
              },
              {
                type: "paragraph",
                text: "When we started looking into Get It Done, the demographic gap was interesting to me. There are roughly 205,000 residents aged 10 to 14 in San Diego County, and the app's terms more or less tell them to come back when they're older. At the same time, the Mid City CAN Youth Council recently helped secure $4.25 million to renovate a park in City Heights by showing up to council meetings in person. So it isn't that teenagers can't have an impact. The issue is that the digital infrastructure for it doesn't include them.",
              },
            ],
          },
          {
            heading: "The problem we wanted to address",
            content: [
              {
                type: "paragraph",
                text: "Middle and high school students in San Diego see city maintenance issues constantly. They notice them on the walk to school, on the bus, and at the parks they hang out at. But almost none of them report what they see. Sometimes it's because they don't know how, sometimes it's because they don't believe anything will come of it, and sometimes it's because the app doesn't feel like it was made with them in mind.",
              },
            ],
          },
          {
            heading: "What the app already does well",
            content: [
              {
                type: "paragraph",
                text: "The current version of Get It Done, available on iOS and Android, works. You can submit a photo, drop a pin, choose a category, and track your request. It added a Spanish version in 2021, which felt like a meaningful step toward reaching more of the city. The core product is solid. The reach is the issue.",
              },
            ],
          },
        ],
      },
      {
        heading: "User Research",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "Our team interviewed six high school students, most of them at Sweetwater High School. They were seniors or close to it, and all of them lived in neighborhoods where the broken streetlight problem was a real thing rather than a hypothetical one. I personally ran two of these interviews, with Carlie and Kriselda.",
              },
              {
                type: "paragraph",
                text: "Going into the interviews, I expected to hear that teenagers wanted to report things and just didn't know how. That ended up being part of the story, but not the whole story.",
              },
              {
                type: "image",
                src: "/images/kid-walking.jpg",
                alt: "A kid scooting down a park path in San Diego",
              },
            ],
          },
          {
            heading: "What I actually heard",
            content: [
              {
                type: "paragraph",
                text: "None of the six interviewees had heard of Get It Done before we showed it to them. I expected that.",
              },
              {
                type: "paragraph",
                text: "What I didn't expect was how much they noticed. Every single person I talked to could list off problems in their neighborhood without thinking about it. Carlie went through graffiti on murals, homeless encampments, partial broken street signs, and dysfunctional streetlights in maybe ten seconds. Kriselda talked about potholes on her drive home and litter \"all over the place.\" These weren't kids who were unaware of their surroundings. They were paying attention.",
              },
              {
                type: "paragraph",
                text: "What they didn't do was report any of it. The reasons were different from person to person, but they pointed in a similar direction. Carlie said the issues had been around long enough that they'd become normalized, and that she only really felt the need to report something if it was dramatic or in-your-face. Kriselda actually wanted to report things, but she didn't know who to contact for which kind of issue, and she also mentioned a quieter thing that I've kept thinking about. She said she was sometimes hesitant to report things because she didn't know what the consequences might be of \"bringing up issues to people in power.\" That isn't a UI problem. That's a trust problem, and it's harder to design around.",
              },
            ],
          },
          {
            heading: "The part I didn't expect",
            content: [
              {
                type: "paragraph",
                text: "I went into the interviews assuming the design problem was mostly discoverability. The thinking was something like: show kids the app, the app is fine, they'll use it.",
              },
              {
                type: "paragraph",
                text: "By the third or fourth interview I had to let that go. The students who didn't know about the app still wouldn't use it after we explained what it did. A couple of them said pretty directly that teenagers don't really care about issues in their neighborhood, which I found interesting because the same students had just spent five minutes describing those exact issues to me. So they cared. They just didn't believe reporting would do anything.",
              },
              {
                type: "paragraph",
                text: "That reframed the problem for me. It isn't a discoverability problem, and it isn't even really a usability problem. The app is usable. Carlie told me she thought it was \"perfect\" the way it was, and that the only issue was that no one had told her about it. The deeper problem is that nothing in the current experience helps a teenager believe their report is going to matter. The submission goes into a void, and even if something does eventually get fixed, the connection between the report and the fix isn't visible enough to build any trust.",
              },
              {
                type: "paragraph",
                text: "A few of the students brought up ideas on their own, without us asking. Gael said it should feel more like TikTok. Daniel wanted a feed. Sol wanted to be able to clearly see what was finished, not just what had been reported. Three different students, three different framings, but I think they were all pointing at the same thing. Make the impact visible.",
              },
            ],
          },
          {
            heading: "Something Kriselda said",
            content: [
              {
                type: "paragraph",
                text: "I asked Kriselda why she didn't report anything, and she gave a couple of answers, but then she said:",
              },
              {
                type: "pullQuote",
                text: "\"If they're not being reassured, what's the point of reporting anything?\"",
              },
              {
                type: "paragraph",
                text: "That line basically reframed the project for me. The problem isn't that the submission form is too hard to find. The problem is that the kid walking past the broken thing every day on the way to school never gets to see it get fixed, and never gets to feel like their report had anything to do with it.",
              },
            ],
          },
          {
            heading: "What this turned into",
            content: [
              {
                type: "paragraph",
                text: "A few things from the interviews ended up shaping the prototypes our team built:",
              },
              {
                type: "list",
                items: [
                  "An upvote system, so a student doesn't feel like they're wasting their time reporting something that has already been reported ten times. It also gives the city a clearer signal about which issues the community keeps surfacing.",
                  "A more visible status timeline, so a submitted report doesn't just disappear after you send it. Sol specifically asked for this. Gael did too, in a different way.",
                  "A community feed, so the app feels less like a government form. This was the TikTok comparison, but we wanted to be careful with it — we didn't want to turn civic engagement into something that feels like a game.",
                ],
              },
              {
                type: "paragraph",
                text: "One thing we decided not to do was add a rewards or points system. Sol pointed out that people would just lie for the rewards, and I think he was right. The goal isn't to pay students to care. The goal is to make sure that when they do care, they can see something come of it.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "portfolio-website",
    title: "Portfolio Website",
    tagline: "Next.js + anime.js portfolio built using Claude plugins.",
    period: "Ongoing",
    sortKey: "2026-04",
    stack: ["Next.js", "React", "Tailwind", "anime.js", "Claude"],
    featured: true,
    links: [
      {
        label: "GitHub Repository",
        href: "https://github.com/jonathannnty/portfolio.git",
      },
    ],
    heroImage: "/images/portfolio-website-thumbnail.png",
    body: [
      "I wanted a portfolio that felt built rather than assembled — no templates, no off-the-shelf component library. The whole design is driven by a green-centered token system in globals.css, and every accent on the site pulls from that palette.",
      "The experience timeline, hero headline, and scroll reveals are powered by anime.js v4, keeping the JavaScript footprint small while still allowing staggered, spring-y motion that would be clumsy to express in raw CSS.",
      "The contact form uses a Next.js server action that hands off to Resend — no API route, no third-party form service, no client-side secrets.",
    ],
    thumbnail: "/images/portfolio-website-thumbnail.png",
  },
  {
    slug: "audio-har-data-collection",
    title: "Audio-Based Human Activity Recognition",
    tagline:
      "Rethinking how activity data is collected: faster, more scalable, and less tedious!",
    period: "June 2025",
    sortKey: "2025-05",
    stack: ["Python", "NumPy", "Pandas", "PyTorch", "LSTM", "GitHub Copilot"],
    body: [
      "This research project came about from my group's participation in the UCSD CSE Department's Early Research Scholars Program. In a team of 4, we learned how traditional human activity recognition (HAR) datasets rely heavily on video recording and manual annotation, which is time-consuming and difficult to scale. Our project explored whether synchronized audio instructions could replace these methods, making data collection faster and more accessible for both researchers and participants.",
      "We designed a pipeline that aligned audio cues with time-series sensor data from 9-axis IMU devices, allowing activities to be labeled in real time without post-processing. I focused on building data preprocessing scripts and structuring the dataset for LSTM-based models, which ultimately achieved higher validation accuracy compared to button-based and standard baseline methods.",
      "Looking back, I think we could’ve explored more robust generalization across different environments and users. Still, this project shifted how I think about data collection, not just optimizing models, but questioning the assumptions behind how data is gathered in the first place.",
    ],
    thumbnail: "/images/pannuto-thumbnail.png",
    heroImage: "/images/pannuto-thumbnail.png",
    links: [
      {
        label: "Pannuto Group Poster",
        href: "https://docs.google.com/presentation/d/1MulUlO82lKFoAQDq7fSwZwJZZ0lp178LVbZovcwtWq4/edit?usp=sharing",
      },
      {
        label: "LinkedIn Post",
        href: "https://www.linkedin.com/posts/jonathan-ty_i-just-wrapped-up-an-incredible-year-with-activity-7335523246672330753-ucFq?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEeoZfoB3ThC295AU2C-EtteoS6JLAkSOy0",
      },
    ],
  },
  {
    slug: "pathfinder-ai-career-guidance",
    title: "Pathfinder AI: Multi-Agent Career Guidance",
    tagline:
      "4-agent career coach that turns user intake into ranked paths and actionable plans.",
    period: "March 2026",
    sortKey: "2026-03",
    stack: [
      "TypeScript",
      "React",
      "Fastify",
      "Python",
      "FastAPI",
      "uAgents",
      "Playwright",
      "Claude",
      "GitHub Copilot",
    ],
    body: [
      "For DiamondHacks 2026, in a team of 2, we built Pathfinder AI intended to be a full-stack career guidance platform using React, Fastify API, and a Python agent service.",
      "My teammate worked on a four-agent pipeline: Research, Profile Analysis, Recommendations, and Report Generation. It runs a structured intake-to-analysis flow, validates recommendation quality, and produces clear outputs for users and demo judges.",
      "I focused on reliability as much as features by adding test coverage, operator playbooks, observability endpoints, and demo contingency workflows so the product could run confidently in live hackathon settings!",
    ],
    thumbnail: "/images/pathfinder-thumbnail.png",
    heroImage: "/images/pathfinder-thumbnail.png",
    links: [
      {
        label: "GitHub Repository",
        href: "https://github.com/jonathannnty/DH-2026.git",
      },
      {
        label: "DevPost",
        href: "https://devpost.com/software/pathfinder-ai-7e3r5o",
      },
      {
        label: "Website",
        href: "https://dh-2026.vercel.app/",
      },
    ],
  },
];
