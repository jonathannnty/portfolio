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
  | { type: "image"; src: string; alt: string }
  | { type: "imageCarousel"; images: { src: string; alt: string }[]; variant?: "phone" | "wide" }
  | { type: "codeBlock"; language: string; code: string };

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
    thumbnail: "/images/idle/thumbnail.png",
    heroImage: "/images/idle/thumbnail.png",
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
    thumbnail: "/images/cogs127/thumbnail.png",
    heroImage: "/images/cogs127/thumbnail.png",
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
                type: "list",
                items: [
                  "Ashley Padilla",
                  "Jonathan Ty",
                  "Julie Nguyen",
                  "Ruth Mazariego Lemus",
                ],
              },
              {
                type: "paragraph",
                text: "COGS 127, Spring 2026.",
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
        heading: "Problem Statement",
        subsections: [
          {
            content: [
              {
                type: "pullQuote",
                text: "Middle and high school students in San Diego walk past potholes, broken streetlights, and illegal dumping every day — and almost none of them report what they see. It isn't that they don't care. Most have simply decided that nothing would come of it.",
              },
              {
                type: "paragraph",
                text: "This wasn't obvious going into the research. The assumption I started with was that teenagers didn't know how to report problems, or that the process was too inconvenient. What the interviews revealed was different: the students we talked to were observant, aware of their surroundings, and in several cases genuinely bothered by what they saw. The barrier wasn't the form. It was the belief that a sixteen-year-old's report wouldn't lead anywhere — and in the absence of any evidence to the contrary, that belief was completely rational.",
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
                text: "What I didn't expect was how much they noticed. Every single person I talked to could list off problems in their neighborhood without thinking about it. Carlie went through graffiti on murals, homeless encampments, broken street signs, and dysfunctional streetlights in maybe ten seconds. Kriselda talked about potholes on her drive home and litter \"all over the place.\" These weren't kids who were unaware of their surroundings. They were paying attention.",
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
      {
        heading: "User Testing",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "We tested with two high school freshmen from Escondido in separate remote sessions, both conducted after the initial round of prototypes was complete. Each session followed the same format: we walked through two versions of the designs side by side and asked participants to compare them directly. The sessions were moderated, which gave us room to ask follow-up questions, but it also meant the quality of what we learned depended heavily on how comfortable each participant was talking through what they were seeing.",
              },
            ],
          },
          {
            heading: "The sessions",
            content: [
              {
                type: "paragraph",
                text: "The first participant was a freshman who had reviewed Figma prototypes before, which showed — she moved through the designs without needing much prompting. She gravitated toward the simpler of the two interfaces and said our proposed changes were minimal, suggesting that further simplification might make the app feel more welcoming to someone encountering it for the first time. She also brought up the idea of a like or upvote feature without being asked.",
              },
              {
                type: "paragraph",
                text: "The second participant had more difficulty with the format. Because the prototypes were static screens rather than interactive flows, he had trouble envisioning how the app would actually work. He also preferred the simpler interface, but his most useful piece of feedback was that he couldn't easily tell which screens were the redesign and which were the original. The differences weren't apparent to him.",
              },
            ],
          },
          {
            heading: "What I took from this",
            content: [
              {
                type: "paragraph",
                text: "The upvote suggestion caught my attention. Both participants arrived at a version of it independently — one explicitly named it, the other described wanting to see more engagement. We had already planned to build an upvote feature before these sessions, but hearing it come up unprompted was its own kind of confirmation. The students weren't just tolerating the idea of a civic app; they were imagining how to make it feel more like something they'd actually use.",
              },
              {
                type: "paragraph",
                text: "The harder finding was the confusion about which screens were ours. If a participant can't identify the redesign, the redesign hasn't done its job. That isn't a criticism of the participants — it's a signal that the changes we made weren't differentiated enough to communicate their purpose. A subtle layout adjustment doesn't convey that something meaningfully new is being offered.",
              },
              {
                type: "pullQuote",
                text: "\"If they're not being reassured, what's the point of reporting anything?\" — Kriselda (prior interview)",
              },
              {
                type: "paragraph",
                text: "Kriselda's line from the earlier interviews kept coming back to me during these sessions. The two test participants weren't asking for reassurance directly, but the gap they were identifying — designs that look nearly identical to the original, features that don't feel meaningfully different — points at the same thing. If a student opens the redesigned app and doesn't feel like anything has changed, we haven't addressed the problem.",
              },
            ],
          },
          {
            heading: "Point of view",
            content: [
              {
                type: "paragraph",
                text: "High school students in San Diego notice city maintenance problems and are willing to report them — but only if reporting feels like it leads to something. The current design of Get It Done doesn't make that connection visible. Our redesign needs to do more than clean up the layout; it needs to give students a reason to believe their report matters, and it needs to make that reason immediately apparent the first time they open the app.",
              },
              {
                type: "paragraph",
                text: "Based on the testing, the next iteration will keep the clean, simple base that both participants responded to, but introduce changes that are distinct enough to register — primarily around the community feed, engagement mechanisms, and status visibility. We also plan to test with interactive prototypes rather than static screens, so participants can actually feel the experience rather than infer it.",
              },
            ],
          },
        ],
      },
      {
        heading: "Before & After",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "These comparisons show the two screens that changed most directly as a result of user testing. Both changes were driven by the same finding: the original designs were too close to the existing app to feel like a meaningful improvement. The goal with each revision was to make the purpose of the change immediately legible — not just a different layout, but a different experience.",
              },
            ],
          },
          {
            heading: "Reports feed",
            content: [
              {
                type: "image",
                src: "/images/cogs127/1.png",
                alt: "Before and after comparison of the reports feed screen, showing a shift from a dense text list to an image-forward card layout with engagement tools",
              },
              {
                type: "paragraph",
                text: "The original reports view is a dense text list. Each report is readable, but nothing visual anchors your attention, and there's no mechanism to signal that other residents care about the same issues. The revised version introduces image-forward cards sorted by relevance, detailed timestamps, and engagement tools — a like button and comment count — directly on each card. The reasoning connects back to what Gael said in the initial interviews: the app needs to feel less like a government form. The card format is how every social platform a teenager already uses presents information. Making the feed feel familiar makes it easier to get started.",
              },
              {
                type: "paragraph",
                text: "The engagement layer does more than the visual work. When a student can see that a pothole near her school has been upvoted forty times, she has evidence that other people noticed it too. That social proof is part of what makes reporting feel worth doing — and it gives the city a clearer signal about which issues the community keeps surfacing.",
              },
            ],
          },
          {
            heading: "Track progress",
            content: [
              {
                type: "image",
                src: "/images/cogs127/2.png",
                alt: "Before and after comparison of the track progress screen, showing a shift from an undifferentiated list to a status-organized view with past and closed report categories",
              },
              {
                type: "paragraph",
                text: "The original track progress screen is another undifferentiated list. Past and closed reports sit together with no visual distinction, and the cards carry more text than they need to. The revised version organizes reports into two explicit categories — Past Reports and Closed Reports — with cleaner cards that show ticket numbers and smaller thumbnails. The reduction in image size isn't just aesthetic; it makes the view more scannable, which matters when a student is checking back on something they reported weeks ago.",
              },
              {
                type: "paragraph",
                text: "The category split is the more important change. Sol asked for this during the initial interviews — he specifically wanted to see what was finished, not just what had been reported. Separating closed reports into their own section makes the outcome of reporting visible in a way the original view doesn't. That's the feedback loop the app currently lacks: you submit something, and eventually it disappears into the same list it always lived in. The revised view makes resolution a distinct state, which is the first step toward making the act of reporting feel like it has a payoff.",
              },
            ],
          },
        ],
      },
      {
        heading: "High-Fidelity Prototypes",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "These screens extend Get It Done's existing mobile app with three features that came directly out of the interviews: a community feed, an upvote layer on the submission flow, and a status timeline. The goal wasn't to redesign the app. It was to answer the specific thing Kriselda asked — if they're not being reassured, what's the point of reporting anything?",
              },
              {
                type: "imageCarousel",
                images: [
                  {
                    src: "/images/cogs127/PhoneFrame-1.png",
                    alt: "Community feed screen showing nearby issues with upvote counts",
                  },
                  {
                    src: "/images/cogs127/PhoneFrame-2.png",
                    alt: "Report submission screen with upvote option for existing issues",
                  },
                  {
                    src: "/images/cogs127/PhoneFrame-3.png",
                    alt: "Status timeline screen showing a report's progress from submitted to resolved",
                  },
                  {
                    src: "/images/cogs127/PhoneFrame-4.png",
                    alt: "Issue detail screen with community upvote count and nearby activity",
                  },
                  {
                    src: "/images/cogs127/PhoneFrame-5.png",
                    alt: "Profile screen showing a student's submitted reports and current statuses",
                  },
                  {
                    src: "/images/cogs127/PhoneFrame.png",
                    alt: "Home screen with nearby issues surfaced on a map",
                  },
                ],
              },
            ],
          },
          {
            heading: "Making the loop visible",
            content: [
              {
                type: "paragraph",
                text: "The community feed was the feature most of the interviewees described without being asked. Gael said it should feel more like TikTok. Daniel wanted a feed. Sol wanted to see what was finished. They were all pointing at the same thing: the current app submits to a void. You take a photo, you send it, and nothing connects your report to the broader community or to the eventual outcome.",
              },
              {
                type: "paragraph",
                text: "The feed is designed to surface nearby issues, show how many people have reported the same thing, and update as the city responds. The intent is to give a student a reason to open the app even when they aren't reporting something — and to let them see, over time, that reports actually lead to fixes. That visibility is the reassurance Kriselda was asking for.",
              },
            ],
          },
          {
            heading: "Upvotes as social proof",
            content: [
              {
                type: "paragraph",
                text: "Adding upvotes changed the job of the submission form. In the original app, each report is discrete — you submit something and it enters a queue with no connection to anyone else who saw the same broken curb. The upvote layer means the form needs to surface whether you're submitting something new or whether a hundred people have already reported it.",
              },
              {
                type: "paragraph",
                text: "That changes the form from data entry to community verification. When Carlie sees that an issue she notices has been upvoted fifty times, she gets social proof that the problem is real and that other people care about it too. She also gets an easier way to participate: she doesn't need to take a photo and write a description if the issue already exists. She just adds her name to it.",
              },
              {
                type: "paragraph",
                text: "We chose not to add rewards or a points system. Sol pointed this out during the interviews — people would just game the rewards. The goal isn't to pay students to care. The goal is to make sure that when they do care, the effort feels worth it.",
              },
            ],
          },
          {
            heading: "Staying inside the app's voice",
            content: [
              {
                type: "paragraph",
                text: "Get It Done has a deliberate visual identity — functional, municipal, not trying to be a consumer product. The color palette, button treatments, and icon style in these screens are pulled from the existing app rather than invented from scratch. The goal was for these extensions to look like something the Get It Done team could plausibly ship, not a student redesign layered on top.",
              },
              {
                type: "paragraph",
                text: "The one deliberate departure is the status timeline, which uses a vertical step indicator that the original app doesn't have. That was a conscious choice: the existing track-your-request view is minimal to the point of being opaque. The timeline needed to communicate progress more explicitly, because the whole point of building it was to close the loop that currently leaves submitters with no feedback at all.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "cookie-jar",
    title: "Cookie Jar",
    tagline:
      "A Chrome extension that reads, categorizes, and blocks unwanted cookies — built after a judge at a designathon said she'd be our first customer.",
    period: "May 2026",
    sortKey: "2026-05",
    stack: ["JavaScript", "Chrome APIs", "Manifest V3", "HTML/CSS", "Figma"],
    featured: true,
    links: [
      {
        label: "Chrome Web Store",
        href: "https://chromewebstore.google.com/detail/cookie-jar/eimleipppddemhicjhpnnflcbmpdkjic",
      },
      {
        label: "GitHub Repository",
        href: "https://github.com/jonathannnty/cookie-jar",
      },
    ],
    body: [],
    thumbnail: "/images/cookiejar/Cookie Jar Small promo tile.png",
    heroImage: "/images/cookiejar/Cookie Jar Small promo tile.png",
    sections: [
      {
        heading: "Overview",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "Design Frontiers is a designathon run by Design CO at UCSD. Our team of four had 24 hours to design a product. We built a concept for a Chrome extension that would read, categorize, and automatically block unwanted browser cookies — the kind of thing that handles cookie consent banners for you so you stop clicking \"Reject All\" on every website you visit.",
              },
              {
                type: "paragraph",
                text: "We won second place. In the feedback session, one of the judges said she'd be the first customer when we built it. I don't think she expected anyone to take that literally.",
              },
              {
                type: "paragraph",
                text: "I was the only person on the team with programming experience. The other three had handled the research, the UI/UX, and the branding — I'd contributed to the design work too, but I was also the only one who could actually build it. So I did.",
              },
            ],
          },
          {
            heading: "Team",
            content: [
              {
                type: "list",
                items: [
                  "Renee Lau — UI/UX",
                  "Yaena Chun — UI/UX",
                  "Kiley Ku — graphic design",
                  "Jonathan Ty — UI/UX, development",
                ],
              },
              {
                type: "paragraph",
                text: "Design Frontiers, Design CO @ UC San Diego, May 2026.",
              },
            ],
          },
        ],
      },
      {
        heading: "What it does",
        subsections: [
          {
            content: [
              {
                type: "imageCarousel",
                variant: "wide",
                images: [
                  { src: "/images/cookiejar/2.png", alt: "Toggle Cookies — set your cookie preferences with session, authentication, analytics, and functional cookie controls" },
                  { src: "/images/cookiejar/4.png", alt: "Cookie Consent Banners — automatically selects \"Reject all\" on consent dialogs, with a fallback that hides Accept all and Manage preferences overlays" },
                  { src: "/images/cookiejar/3.png", alt: "Cookie Statistics — see exactly what has been blocked across your entire browsing history" },
                  { src: "/images/cookiejar/1.png", alt: "Customize Rules — fine-tune per-domain and per-cookie blocking rules" },
                ],
              },
              {
                type: "paragraph",
                text: "Cookie Jar intercepts cookies in real time and classifies them into eight categories. Four are allowed by default — things the site genuinely needs to function, like authentication, session management, and necessary functionality. Four are blocked by default: analytics, tracking, advertising, and third-party scripts that exist primarily to follow you around the web.",
              },
              {
                type: "paragraph",
                text: "The classifier runs pattern matching against cookie names and domains from 50+ frameworks and platforms. When you visit a site, a service worker intercepts cookie operations before they settle, checks the category, and allows or blocks based on your preferences. You can override any category, pause the extension for a specific domain, or toggle between a simple view and a detailed breakdown of what's being blocked.",
              },
            ],
          },
          {
            heading: "Cookie consent banners",
            content: [
              {
                type: "paragraph",
                text: "Most sites use a consent management platform — OneTrust, CookieBot, TrustArc — to show the cookie banners you see on almost every page. As of v1.1.0, Cookie Jar doesn't just hide them: it reads the consent dialog and clicks \"Reject\" or \"Decline\" for you, so you're opted out of non-essential cookies without touching a single banner. It does this entirely in your browser using DuckDuckGo's open-source autoconsent rule set (MPL-2.0), bundled with the extension — no remote code is downloaded or run, and nothing about which sites or banners you encounter is collected. When you turn auto-reject off, it falls back to the original behavior of hiding banners with a stylesheet. Getting to 100% on 31 tested sites required handling banners injected inside iframes, shadow DOM elements, and dynamically loaded scripts. A few sites needed site-specific selectors before they'd cooperate.",
              },
            ],
          },
        ],
      },
      {
        heading: "Building it",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "The extension is built on Manifest V3, Chrome's current extension format, which routes everything through a service worker rather than a persistent background page. Most of the core logic lives in three places: a cookie classifier that maps name and domain patterns to categories, a background service worker that intercepts cookie operations in real time, and a content script that handles consent banners on the page itself — auto-rejecting them through the bundled autoconsent rules, or hiding them with CSS when auto-reject is turned off.",
              },
            ],
          },
          {
            heading: "The OAuth problem",
            content: [
              {
                type: "paragraph",
                text: "The hardest bug to fix was one I introduced myself. An early version of the extension was too aggressive — it was blocking cookies during page load that OAuth providers set after authentication. So if you logged in with Google or Microsoft, the extension would delete the session cookie before the app could read it, landing you in a redirect loop.",
              },
              {
                type: "paragraph",
                text: "The fix required building an explicit passlist for OAuth callback patterns across Google, Microsoft, Apple, Okta, and Auth0, and making the cookies.onChanged listener protect parent domains as well as the callback URL itself. The timing also mattered — the window between when the OAuth callback fires and when the app reads the resulting cookie is small, and the extension had to stay out of it.",
              },
            ],
          },
        ],
      },
      {
        heading: "What I'd do differently",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "The design was made in 24 hours, which means I inherited some decisions that were made fast. The popup is clean. The full-page view got complicated as features accumulated — it tries to do too many things at once. If I were starting from scratch I'd rethink that information architecture before writing a line of code.",
              },
              {
                type: "paragraph",
                text: "It shipped. The Chrome Web Store approved it in May 2026. The honest next question is whether 'works on 31 tested sites' holds up at scale — the sites I didn't test are the interesting ones. I also want to revisit the full-page view's information architecture before the user base grows enough to make that disruptive.",
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
    heroImage: "/images/portfolio/thumbnail.png",
    body: [],
    thumbnail: "/images/portfolio/thumbnail.png",
    sections: [
      {
        heading: "Overview",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "I wanted a portfolio that felt built rather than assembled — no templates, no off-the-shelf component library, nothing that a thousand other developers also shipped this month. The whole site is designed and coded from scratch using Next.js App Router, Tailwind, and anime.js v4, with Claude Code doing a significant portion of the implementation work alongside me.",
              },
              {
                type: "paragraph",
                text: "Most of the interesting decisions weren't about what to build, but how to build it in a way that stays maintainable. Rather than writing prose in MDX files or a CMS, all project and experience content lives in TypeScript data files — strongly typed, colocated, and editable without a build step or a login.",
              },
            ],
          },
        ],
      },
      {
        heading: "Design System",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "Everything on the site flows from a single color token system defined in globals.css. The palette is built around a green center — from --color-primary-50 through --color-primary-900 — and every accent, border, and interactive state pulls from that range rather than hardcoding hex values. Switching themes or repainting the whole site means changing one place.",
              },
              {
                type: "paragraph",
                text: "Typography uses three fonts with intentional roles: Ben (a custom display TTF) handles headings and large type, Nunito Sans covers body and UI text, and JetBrains Mono is reserved for code, eyebrows, and timestamps. All three are injected as CSS variables from the root layout and mapped to Tailwind utility classes — font-display, font-sans, font-mono. Ben especially tends to fall apart at small sizes, so it's kept strictly for display use.",
              },
            ],
          },
        ],
      },
      {
        heading: "Motion & Interactions",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "All animation runs through anime.js v4, not CSS transitions or Framer Motion. The tradeoff is that anime.js requires a bit more setup, but the payoff is fine-grained control over easing, staggering, and sequence timing that CSS can't cleanly express. Scroll-triggered reveals use IntersectionObserver to fire staggered entrance animations as elements enter the viewport, keeping the initial page load fast.",
              },
              {
                type: "paragraph",
                text: "The reading progress bar at the top of long pages uses Motion's useScroll and useSpring hooks — a spring-linked animation that follows scroll position with a small amount of lag, which makes it feel physical rather than mechanical. The hero scene has falling leaves that drift across the background using CSS custom properties set per-element for position, drift distance, spin angle, and duration — each leaf is animated with different values to avoid the look of a looping sprite.",
              },
            ],
          },
        ],
      },
      {
        heading: "Content Architecture",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "Project writeups are stored in content/projects.ts as typed TypeScript objects rather than markdown files. Each project can use either a flat body array of paragraphs or a structured sections tree made up of ProjectSection and ProjectSubsection objects containing ContentBlock entries — paragraphs, pull quotes, bullet lists, inline images, and code blocks. Adding a new content type means adding one union variant to ContentBlock and one rendering case in the page component.",
              },
              {
                type: "paragraph",
                text: "Long project pages automatically get a sticky table of contents on desktop and a collapsible dropdown on mobile. The TOC tracks the active section using IntersectionObserver — each section heading gets a slug ID derived from its text, and the TOC highlights whichever one is currently closest to the top of the viewport. No external library, just about 80 lines in project-toc.tsx.",
              },
            ],
          },
          {
            heading: "Code highlighting",
            content: [
              {
                type: "paragraph",
                text: "Code blocks use Shiki for server-side syntax highlighting — it runs at render time in a Server Component and outputs pre-colored HTML, so the client gets zero additional JavaScript for syntax highlighting. The highlighter singleton lives on globalThis to survive Next.js hot-module reloads in development without spinning up a new instance on every save.",
              },
            ],
          },
        ],
      },
      {
        heading: "Backend & Infrastructure",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "The contact form is a Next.js server action — no separate API route, no third-party form service, no client-side secrets. The action validates the submission and hands it off to Resend for delivery. Error and success states are handled with useFormState on the client, which means the form stays functional even without JavaScript.",
              },
              {
                type: "paragraph",
                text: "All pages are statically generated at build time. Dynamic project and blog routes use generateStaticParams to pre-render every slug. The sitemap at /sitemap.xml is generated automatically from the projects and blog content arrays, with new entries appearing as soon as a project is added to the data file. Vercel Analytics and Speed Insights are wired in to track Core Web Vitals in production.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "audio-har-data-collection",
    title: "Audio-Based Human Activity Recognition",
    tagline:
      "Comparing annotation methods for IMU-based activity data — and finding the labeling pipeline matters more than the model.",
    period: "June 2025",
    sortKey: "2025-05",
    stack: ["Python", "PyTorch", "LSTM", "Android", "MIDI/YAML", "MoviePy"],
    body: [],
    thumbnail: "/images/audio-har/thumbnail.png",
    heroImage: "/images/audio-har/thumbnail.png",
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
    sections: [
      {
        heading: "Overview",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "UCSD’s Early Research Scholars Program placed me in Pat Pannuto’s embedded systems lab for a year. Our team worked on a problem that doesn’t get as much attention as it should: human activity recognition models need large labeled datasets to train well, and the standard methods for building those datasets are slow and hard to scale.",
              },
            ],
          },
          {
            heading: "Research question",
            content: [
              {
                type: "pullQuote",
                text: "How can Human Activity Recognition data be collected more efficiently to create large, high-quality datasets for training machine learning models?",
              },
            ],
          },
          {
            heading: "Team",
            content: [
              {
                type: "list",
                items: [
                  "Jonathan Ty",
                  "Momina Habibi",
                  "Yuan-Kai Yang",
                ],
              },
              {
                type: "paragraph",
                text: "CSE 198, Early Research Scholars Program, 2024–2025.",
              },
            ],
          },
        ],
      },
      {
        heading: "The labeling problem",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "Human activity recognition is the task of classifying what someone is doing — walking, sitting, climbing stairs — from sensor data. It shows up in fitness trackers, fall detection systems, rehabilitation monitoring. The classifier side has gotten reasonably well-developed. What hasn’t kept pace is the data side.",
              },
              {
                type: "paragraph",
                text: "The standard collection method is video-based: record participants, then manually annotate the time-series sensor data by watching the video back and marking activity boundaries. The video provides genuine ground truth, but annotation is slow — often several minutes of work per minute of recorded data. At any meaningful scale, that’s the bottleneck.",
              },
              {
                type: "paragraph",
                text: "Button-based labeling shifts that burden onto participants: they press a button in an app when they switch activities, and the timestamps become the labels. Cheaper than video, but it depends on participants pressing at exactly the right moment, which they often don’t. The label quality ceiling sets the model quality ceiling, and sloppy button data has a low ceiling.",
              },
            ],
          },
        ],
      },
      {
        heading: "Three approaches",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "We tested all three labeling methods on data from a chest-mounted 9-axis IMU sensor. The sensor logs accelerometer, gyroscope, and magnetometer readings at 100Hz. We collected data across five activities: walking, running, standing, and climbing stairs in both directions.",
              },
              {
                type: "list",
                items: [
                  "Video-based: participants recorded while performing activities, with labeling done afterward using action annotation software. Accurate but time-intensive.",
                  "Button-based: participants press a button in a custom Android app when they transition to a new activity. Timestamps from those button events become the labels.",
                  "Audio-based: participants follow a pre-generated instruction track — verbal cues synchronized to a musical beat tell them which activity to do and when. The audio timestamps become labels automatically, with no post-hoc annotation required.",
                ],
              },
            ],
          },
          {
            heading: "The hardware",
            content: [
              {
                type: "paragraph",
                text: "The TotTag, built by the Pannuto lab, is a small wearable that records 9-axis IMU data and connects to a custom Android app over Bluetooth. We taped it to each participant’s chest in a small Ziploc bag to keep placement consistent across sessions. After each recording, the app exported a ZIP file with the sensor CSV and any audio or button logs, which we uploaded to a shared drive for processing.",
              },
            ],
          },
        ],
      },
      {
        heading: "My contribution",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "My main piece was the audio synthesis pipeline. The premise: if you can generate an instruction track where verbal cues are time-locked to a musical beat, and give that track to participants during data collection, you don’t need to label anything afterward. The audio timestamps tell you exactly when each activity started.",
              },
              {
                type: "paragraph",
                text: "In practice this meant writing Python scripts that parsed a YAML configuration defining activity transitions by timestamp, extracted measure positions from a MIDI file to locate beat positions in real time, generated Google TTS audio for each verbal cue, and combined everything using MoviePy and FluidSynth into a final MP3. The hard part was synchronization drift. A 300-millisecond late cue misaligns every label in that segment, and misaligned labels corrupt the training data in ways that don’t surface until you’re looking at validation numbers wondering what went wrong.",
              },
              {
                type: "paragraph",
                text: "I also handled data preprocessing: converting action annotation outputs into timestamped CSV files in the format the ML model expected, debugging edge cases where the exported video and audio durations didn’t match, and helping restructure the overall pipeline from raw sensor exports to model-ready inputs.",
              },
            ],
          },
        ],
      },
      {
        heading: "Results",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "The audio approach achieved 81% validation accuracy on the CNN classifier — higher than both the button-based method and the standard baseline. It also had the lowest labeling time of the three, since the alignment step is mostly automated rather than manual.",
              },
              {
                type: "paragraph",
                text: "The result that actually surprised me wasn’t the accuracy number. It was the time cost gap. Manual video annotation takes substantially longer per labeled sample than audio-based alignment, and that difference compounds if you want a dataset large enough to generalize. A collection method that produces good labels automatically is worth more than a slightly better model trained on hand-labeled data.",
              },
            ],
          },
        ],
      },
      {
        heading: "Looking back",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "We tested on a small participant pool, which limits what you can actually conclude. A model trained on ten people doing activities in a quiet hallway might be picking up on how those specific ten people walk, not on walking in general. Testing in noisier settings with more variation would tell you whether the audio approach holds up or just works under controlled conditions.",
              },
              {
                type: "paragraph",
                text: "The button approach probably got worse numbers than it deserved. We didn’t invest much in the app’s timing feedback loop, and participants were pressing when it felt right rather than when it was precise. That sloppiness went straight into the labels. With more design work on that part, it might have performed better.",
              },
              {
                type: "paragraph",
                text: "The bigger thing this project changed for me has less to do with HAR specifically. Before ERSP, I thought about ML mostly in terms of model architecture and training. After spending a year trying to produce a clean labeled dataset, I think about data collection as its own design problem — one that often constrains everything downstream more than the model does.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "fast-food-voting-patterns",
    title: "Can Fast Food Predict How a State Votes?",
    tagline:
      "Linking 11 fast food franchise densities to 2024 presidential election outcomes — a logistic regression model hit 81% accuracy.",
    period: "June 2025",
    sortKey: "2025-06",
    stack: [
      "Python",
      "Pandas",
      "scikit-learn",
      "seaborn",
      "GeoPandas",
      "BeautifulSoup",
      "Jupyter",
    ],
    links: [
      {
        label: "Walkthrough Video",
        href: "https://youtu.be/4tACJF4w2ys",
      },
    ],
    body: [],
    thumbnail: "/images/cogs108/thumbnail.png",
    heroImage: "/images/cogs108/thumbnail.png",
    sections: [
      {
        heading: "Overview",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "For COGS 108 (Data Science in Practice), my team of five investigated whether the density of fast food franchises across U.S. states could predict voting outcomes in the 2024 presidential election. We collected location data for 11 major chains — from Arby's to Starbucks — normalized everything per 100,000 residents, and ran statistical tests and a logistic regression classifier against county-level election results. The model achieved 81% accuracy across 50 randomized cross-validation runs, with a p-value under 0.000001.",
              },
              {
                type: "paragraph",
                text: "The headline: it isn't fast food density overall that correlates with voting — it's which chains are where. Arby's, Wendy's, Chick-fil-A, KFC, and Domino's cluster in Republican-leaning states. Dunkin' Donuts and Starbucks skew Democratic. McDonald's and Chipotle sit in the middle and don't predict much of anything.",
              },
            ],
          },
          {
            heading: "Research question",
            content: [
              {
                type: "pullQuote",
                text: "Is there a relationship between the density of specific fast food franchises and state-level voting outcomes in the 2024 U.S. presidential election?",
              },
            ],
          },
          {
            heading: "Team",
            content: [
              {
                type: "list",
                items: [
                  "Travis Henry — ML model, web scraping, walkthrough video",
                  "Aman Dhillon — data visualization, EDA write-up",
                  "Samuel Gonzalez — t-tests, p-values, graph generation",
                  "Devin Park — visualization, EDA, written conclusion",
                  "Jonathan Ty (me) — web scraping, dataset collection and upload",
                ],
              },
            ],
          },
        ],
      },
      {
        heading: "Background",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "Fast food is deeply embedded in American culture, but its significance extends beyond convenience. Campaign finance records consistently show Republicans and Democrats spend money at very different types of restaurants — GOP candidates favor McDonald's and Chick-fil-A while Democratic candidates tend toward Panera and Chipotle. These aren't coincidences. They reflect deeper cultural and economic identities that show up in voting behavior.",
              },
              {
                type: "paragraph",
                text: "Fast food consumption isn't strictly a low-income phenomenon either. Research shows it actually peaks at middle income levels, then falls off among the highest earners — people in the top income group are 54.5% less likely to eat fast food than the lowest group. This complexity is part of why the data seemed interesting: franchise density encodes regional culture, economic patterns, and demographic identity all at once.",
              },
              {
                type: "paragraph",
                text: "We focused on eleven chains that reflect a range of political, economic, and regional identities: Starbucks, Subway, McDonald's, Taco Bell, Domino's, Chick-fil-A, Arby's, Wendy's, KFC, Dunkin' Donuts, and Chipotle. Some of these (Chick-fil-A, Chipotle) have well-documented partisan associations in campaign spending data. Others are national staples with broad reach. Together they gave us a feature space rich enough to train a classifier on 50 data points — one per state.",
              },
            ],
          },
        ],
      },
      {
        heading: "Data",
        subsections: [
          {
            heading: "12 datasets, two collection methods",
            content: [
              {
                type: "paragraph",
                text: "Getting the data required two approaches. Some chains had clean Kaggle datasets we could load directly — Wendy's, McDonald's (via a CSUN research table), Starbucks, and Subway. The rest required web scraping the chains' official location pages using Selenium and BeautifulSoup, since the data either didn't exist in structured form or was paywalled.",
              },
              {
                type: "list",
                items: [
                  "Dataset #1: 2024 County-Level Presidential Results (Kaggle, 3,088 rows) — aggregated to state level for modeling",
                  "CSV chains: Wendy's, McDonald's, Starbucks, Subway — cleaned and grouped by 2-letter state abbreviation",
                  "Scraped chains: Taco Bell, Domino's, KFC, Dunkin' Donuts, Chipotle, Arby's — parsed from each chain's official location pages",
                  "Population data: pulled from the TotalPop field in the election dataset for per-capita normalization",
                ],
              },
              {
                type: "paragraph",
                text: "My contribution was building and running the web scraping pipeline for the six chains without accessible datasets. Each chain's site had a different structure — dropdowns, paginated tables, flat lists — which meant writing custom parsing logic for each one rather than a single reusable scraper.",
              },
            ],
          },
          {
            heading: "Loading and cleaning the election data",
            content: [
              {
                type: "codeBlock",
                language: "Python",
                code: `county_stats = pd.read_csv("2024_US_County_Level_Presidential_Results.csv")
county_stats = county_stats.dropna(
    subset=['state_name', 'votes_gop', 'votes_dem', 'total_votes']
)

# Aggregate from county level to state level
state_totals = county_stats.groupby('state_name').agg({
    'votes_gop': 'sum',
    'votes_dem': 'sum',
    'total_votes': 'sum'
}).reset_index()

state_totals['pct_trump'] = state_totals['votes_gop'] / state_totals['total_votes']
state_totals['pct_harris'] = state_totals['votes_dem'] / state_totals['total_votes']

# Drop ME and NE — they split electoral votes and complicate binary classification
state_votepct = state_totals[~state_totals['state_name'].isin(['Maine', 'Nebraska'])]`,
              },
            ],
          },
          {
            heading: "Loading a CSV-based chain (Wendy's)",
            content: [
              {
                type: "codeBlock",
                language: "Python",
                code: `wendys_locations = pd.read_csv("wendys_restaurants.csv")

# Extract two-letter state code from the address2 column
wendys_locations['state'] = wendys_locations['address2'].str.extract(r'\\b([A-Z]{2})\\b')

valid_states = list(state_abbrev.values())  # 50 US state codes
wendys_locations = wendys_locations[wendys_locations['state'].isin(valid_states)]

wendys_locations = wendys_locations['state'].value_counts().reset_index()
wendys_locations.columns = ['state', "Wendy's"]
wendys_locations = wendys_locations.set_index('state')`,
              },
            ],
          },
        ],
      },
      {
        heading: "Exploratory Data Analysis",
        subsections: [
          {
            heading: "2024 election results",
            content: [
              {
                type: "paragraph",
                text: "Most states are not close calls. The vote share histogram shows a mostly bimodal distribution — states tend to cluster toward one candidate rather than landing near 50/50. The geographic map makes regional patterns visible: the South, Midwest, and Mountain West went Republican; the West Coast and Northeast went Democratic.",
              },
              {
                type: "image",
                src: "/images/cogs108/vote-distribution-histogram.png",
                alt: "Histogram of 2024 presidential vote share by state for Trump vs Harris",
              },
              {
                type: "image",
                src: "/images/cogs108/election-results-map.png",
                alt: "US choropleth map of 2024 presidential election results by state",
              },
            ],
          },
          {
            heading: "Fast food totals by state",
            content: [
              {
                type: "paragraph",
                text: "Raw location counts predictably track population — California, Texas, and Florida lead by a wide margin. But raw counts tell us nothing about relative density. A state with 2,000 restaurants and 40 million people is very different from one with 400 restaurants and 500,000 residents.",
              },
              {
                type: "image",
                src: "/images/cogs108/fast-food-total-by-state.png",
                alt: "Bar chart of total fast food restaurant counts by state",
              },
            ],
          },
          {
            heading: "Per-capita normalization",
            content: [
              {
                type: "paragraph",
                text: "Normalizing to restaurants per 100,000 residents shifts the picture significantly. West Virginia, Mississippi, and Kentucky rank highest — the Southeast dominates. Some Northeastern states like Rhode Island and Connecticut also rank high despite small geographic size, likely due to higher urban density.",
              },
              {
                type: "codeBlock",
                language: "Python",
                code: `fast_food_df = fast_food_by_state.rename_axis('State').reset_index(name='restaurant_count')
merged_df = pd.merge(fast_food_df, state_votepct[['State', 'TotalPop']], on='State')

merged_df['restaurants_per_100k'] = (
    merged_df['restaurant_count'] / merged_df['TotalPop']
) * 100_000

merged_df = merged_df.sort_values('restaurants_per_100k', ascending=False)`,
              },
              {
                type: "image",
                src: "/images/cogs108/fast-food-per-capita-bar.png",
                alt: "Bar chart of fast food restaurants per 100,000 residents by state",
              },
              {
                type: "image",
                src: "/images/cogs108/fast-food-per-capita-map.png",
                alt: "US choropleth map of fast food density per 100,000 residents",
              },
            ],
          },
        ],
      },
      {
        heading: "Statistical Analysis",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "Before building a model, we tested whether overall fast food density differed significantly between red and blue states. It didn't. The independent samples t-test returned a t-statistic of -0.103 and a p-value of 0.919. The Pearson correlation between density and vote margin was r = 0.139 with p = 0.337. No signal. The KDE plot below confirms it — the distributions for red and blue states almost completely overlap.",
              },
              {
                type: "codeBlock",
                language: "Python",
                code: `red = merged_df[merged_df['vote_diff'] > 0]['restaurants_per_100k']
blue = merged_df[merged_df['vote_diff'] < 0]['restaurants_per_100k']

t_stat, p_val = ttest_ind(red, blue)
r, r_p = pearsonr(merged_df['restaurants_per_100k'], merged_df['vote_diff'])

# Results:
# t = -0.103, p = 0.9187  → no significant difference between red and blue states
# r =  0.139, p = 0.3366  → no significant linear correlation with vote margin`,
              },
              {
                type: "image",
                src: "/images/cogs108/red-blue-kde-density.png",
                alt: "KDE plot comparing overall fast food density per 100k in red vs blue states",
              },
              {
                type: "paragraph",
                text: "Total density doesn't predict voting. But when we looked at individual chains, the picture changed entirely.",
              },
            ],
          },
        ],
      },
      {
        heading: "Machine Learning Model",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "We built a logistic regression classifier where each state is one data point, the features are per-capita restaurant counts for all 11 chains, and the label is the 2024 winner. With only 50 states, cross-validation was essential. We ran 50 randomized 60/40 train-test splits to get a reliable accuracy estimate.",
              },
              {
                type: "codeBlock",
                language: "Python",
                code: `state_votepct['winner'] = state_votepct.apply(
    lambda row: 'red' if row['pct_trump'] > row['pct_harris'] else 'blue', axis=1
)

# Normalize each chain per 100k residents
for col in food_df.columns:
    model_df[col] = (model_df[col] / model_df['TotalPop']) * 100_000

X, y = model_df[food_df.columns], model_df['winner']

accuracies = []
for seed in range(50):
    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.4, random_state=seed)
    clf = LogisticRegression(max_iter=1000).fit(X_tr, y_tr)
    accuracies.append(clf.score(X_te, y_te))

# mean(accuracies) ≈ 0.81
# one-sample t-test vs. 0.5 → t = 28.48, p < 0.000001`,
              },
            ],
          },
          {
            heading: "Performance",
            content: [
              {
                type: "paragraph",
                text: "Mean accuracy across 50 runs: 0.81. A one-sample t-test against a 0.5 baseline (random chance) returned t = 28.48 and p < 0.000001. The model significantly and consistently outperforms chance. The confusion matrix shows it performs somewhat better at identifying Republican-leaning states than Democratic ones — likely because Republican states make up the majority of the training data.",
              },
              {
                type: "image",
                src: "/images/cogs108/confusion-matrix.png",
                alt: "Confusion matrix for the logistic regression state-level voting classifier",
              },
              {
                type: "image",
                src: "/images/cogs108/model-accuracy-histogram.png",
                alt: "Histogram of logistic regression accuracy across 50 cross-validation runs with normal distribution fit",
              },
            ],
          },
        ],
      },
      {
        heading: "Key Findings",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "Averaging the logistic regression coefficients across all 50 runs reveals which chains are actually doing the predictive work. Positive coefficients indicate association with Republican voting; negative with Democratic.",
              },
              {
                type: "image",
                src: "/images/cogs108/logistic-regression-coefficients.png",
                alt: "Horizontal bar chart of average logistic regression coefficients per fast food chain",
              },
              {
                type: "list",
                items: [
                  "Republican-associated: Arby's, Wendy's, Chick-fil-A, KFC, Domino's — all significantly higher per-capita density in red states (p < 0.05 on t-tests)",
                  "Democratic-associated: Dunkin' Donuts, Starbucks — significantly higher per-capita density in blue states",
                  "No significant association: McDonald's and Chipotle — broadly distributed across both partisan leanings",
                ],
              },
            ],
          },
          {
            heading: "Franchise-level distributions",
            content: [
              {
                type: "paragraph",
                text: "The KDE plots below show the per-capita distribution of each chain in red vs blue states. For Arby's, Wendy's, and KFC, the separation between the two distributions is visually clear. For McDonald's, the overlap is nearly total — exactly what the coefficient plot suggested.",
              },
              {
                type: "image",
                src: "/images/cogs108/franchise-t-test-kde.png",
                alt: "KDE density plots for each fast food chain comparing red vs blue state concentrations",
              },
            ],
          },
        ],
      },
      {
        heading: "Limitations",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "State-level aggregation obscures a lot. Urban and rural areas within the same state vote very differently, and they have very different fast food environments too. Texas as a single data point papers over the gap between Houston and the Panhandle. A county-level analysis would likely surface stronger and more nuanced patterns — but matching county-level restaurant counts with county-level votes was outside the scope of this project.",
              },
              {
                type: "paragraph",
                text: "The Modifiable Areal Unit Problem (MAUP) is real here: the patterns we see at the state level might look completely different at the county or ZIP code level. We're also working with 50 data points, which is enough to identify patterns but not enough to be confident about generalizability. Fast food density is shaped by income, urbanization, and regional infrastructure in ways that may fully explain the voting correlation without any direct causal relationship.",
              },
              {
                type: "paragraph",
                text: "We're identifying correlations, not causes. The finding that Arby's per-capita count predicts Republican voting probably says more about the rural South and Midwest — where Arby's happens to cluster — than it does about Arby's specifically. That said, the signal is statistically significant and consistent across methodologies. Whether it's about the chains themselves or the places those chains call home is a question worth asking.",
              },
            ],
          },
        ],
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
    body: [],
    thumbnail: "/images/pathfinder/thumbnail.png",
    heroImage: "/images/pathfinder/thumbnail.png",
    sections: [
      {
        heading: "Overview",
        subsections: [
          {
            content: [
              {
                type: "paragraph",
                text: "Pathfinder AI is a career guidance platform my teammate Sammy Hamouda and I built in 24 hours at DiamondHacks 2026. The core idea: instead of giving you a generic list of careers to research on your own, it interviews you across 12 dimensions — interests, values, skills, risk tolerance, geography, salary expectations, burnout concerns, and more — runs that intake through a multi-agent analysis pipeline, and hands you back scored career cards with concrete next steps.",
              },
              {
                type: "paragraph",
                text: "The system is split across three services: a React frontend, a Fastify API, and a Python agent service built on Fetch.ai's uAgents framework. Sammy drove the agent pipeline and core product logic. I focused almost entirely on making sure the thing would actually hold together under live demo conditions.",
              },
            ],
          },
        ],
      },
      {
        heading: "Architecture",
        subsections: [
          {
            heading: "Three-service split",
            content: [
              {
                type: "list",
                items: [
                  "Frontend: React 19 + TypeScript with TanStack Query for server state, React Router for navigation, Zod for form validation, Vite for builds",
                  "API: Fastify 5 + TypeScript with Drizzle ORM over SQLite, Server-Sent Events for streaming responses, shared Zod schemas with the frontend",
                  "Agent service: Python + Fetch.ai uAgents, coordinating four specialized agents that each evaluate a different set of career-fit dimensions",
                ],
              },
              {
                type: "paragraph",
                text: "The Fastify API streams responses back to the frontend using Server-Sent Events rather than waiting for the full agent pipeline to complete. This means users see partial results as each agent finishes rather than staring at a spinner for the full duration. The shared Zod schemas between frontend and API mean that if the API changes its response shape, the TypeScript compiler catches it on the frontend before runtime.",
              },
            ],
          },
          {
            heading: "Agent pipeline",
            content: [
              {
                type: "paragraph",
                text: "The intake conversation collects data across 12 dimensions including interests, skills, values alignment, geographic preference, timeline, risk tolerance, and burnout history. Once the intake is complete, four agents run in parallel against this data — each scoring a different cluster of career-fit factors. The results are then combined into ranked career cards with fit scores from 0 to 100, a breakdown of match reasoning, identified concerns, suggested next steps, and salary range estimates.",
              },
            ],
          },
        ],
      },
      {
        heading: "My Contribution",
        subsections: [
          {
            heading: "Reliability over features",
            content: [
              {
                type: "paragraph",
                text: "My instinct going into the hackathon was that a demo that fails halfway through is worse than a demo that does less but works every time. So while Sammy focused on building the product, I focused on the infrastructure around it.",
              },
              {
                type: "list",
                items: [
                  "29 integration tests covering happy paths, error paths, and edge cases across the API and agent service",
                  "A /ready self-test endpoint that runs a smoke check against all three services and returns structured health status — judges could hit it directly to verify the system was up before the demo",
                  "Observability headers on every response (X-Request-Id, X-Response-Time) so that when something went wrong we could correlate requests across service logs",
                  "A deterministic fallback engine that produces valid career recommendations without calling the LLM — if the API rate-limited or the agent service was slow, the demo could still run",
                  "State machine with transition guards on the intake flow, preventing the frontend from reaching broken states if the API returned unexpected data",
                  "Demo mode with deterministic timing so the streaming animation would look consistent regardless of actual agent response time",
                  "Operator playbooks documenting how to restart individual services, re-seed the database, and recover from the most likely failure modes mid-demo",
                ],
              },
            ],
          },
          {
            heading: "What I learned",
            content: [
              {
                type: "paragraph",
                text: "Building for a live hackathon demo is a different problem than building for production. In production you have logs, alerts, rollback options, and time. In a hackathon you have 24 hours and one shot in front of judges. The reliability work I did — the /ready endpoint, the fallback engine, the operator playbooks — was specifically scoped to that context. None of it would be the right architecture for a production system, but it was exactly the right investment for what we were trying to do.",
              },
              {
                type: "pullQuote",
                text: "A demo that fails halfway through is worse than a demo that does less but works every time.",
              },
            ],
          },
        ],
      },
    ],
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
