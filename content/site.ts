/**
 * Site-wide configuration — the single source of truth for identity metadata.
 * Edit this file to change your name, tagline, socials, and contact address
 * everywhere at once.
 */

export type SocialLink = {
  label: string;
  href: string;
  handle: string;
};

export const site = {
  name: "Jonathan Ty",
  role: "Aspiring Software Engineer",
  tagline:
    "Striving to create web experiences that can be scalable and help people!",
  location: "San Diego, California",
  email: "jonathanty42@gmail.com",

  bio: [
    `As an Instructional Assistant in the UC San Diego Computer Science and Engineering 
    Department, I contribute to teaching Data Structures and Object-Oriented Design courses 
    led by Professor Paul Cao. My responsibilities include analyzing and debugging student code, 
    grading exams, and aiding in the delivery of coursework focused on Java programming and 
    algorithms. Concurrently, I serve as an IT Technician at UC San Diego, where I support a 
    diverse user base by troubleshooting technical issues, resolving tickets via ServiceNow, 
    and improving network reliability using tools such as Cisco ISE and DNAC.`,
    `I am currently pursuing a Bachelor of Science in Computer Science with a minor in Cognitive 
    Science and Business Economics at UC San Diego, where I am recognized as a Regent's Scholar 
    and Alan Turing Memorial Scholar. My professional focus aligns with leveraging technical 
    expertise in algorithm analysis and IT systems to create impactful solutions.`,
  ],

  socials: {
    github: {
      label: "GitHub",
      href: "https://github.com/jonathannnty",
      handle: "@jonathannnty",
    },
    linkedin: {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/jonathan-ty/",
      handle: "jonathan-ty",
    },
    strava: {
      label: "Strava",
      href: "https://www.strava.com/athletes/jonathanty",
      handle: "Jonathan Ty's Strava",
    },
    spotify: {
      label: "Spotify",
      href: "https://open.spotify.com/user/koshgh1r4l0hsu7w7lww2lt30?si=53def52cc28e4684",
      handle: "Spotify profile",
    },
    email: {
      label: "Email",
      href: "mailto:jonathanty42@gmail.com",
      handle: "jonathanty42@gmail.com",
    },
  } satisfies Record<string, SocialLink>,
} as const;
