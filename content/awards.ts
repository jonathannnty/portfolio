/**
 * Awards, honors, and recognitions shown on /about.
 * Newest first.
 */

export type Award = {
  id: string;
  title: string;
  organization: string;
  date: string;
  /** Short description of what it recognizes. */
  description?: string;
  link?: { label: string; href: string };
};

export const awards: Award[] = [
  {
    id: "regents-scholar",
    title: "Regent's Scholar",
    organization: "UC San Diego",
    date: "2023",
    description:
      "UC San Diego's most prestigious undergraduate honor, awarded to the top 1% of entering students for exceptional academic achievement.",
    link: {
      label: "Regent's Scholar Program",
      href: "https://fas.ucsd.edu/types/scholarships/regents-scholarships-for-entering-freshmen.html",
    },
  },
  {
    id: "alan-turing-scholarship",
    title: "Alan Turing Memorial Scholarship",
    organization: "UC San Diego",
    date: "2023",
    description:
      "Awarded in recognition of academic excellence and contributions to the LGBTQIA+ community within the UCSD computing community.",
    link: {
      label:
        "Computer Science Undergrad Jonathan Ty Awarded Alan Turing Memorial Scholarships for Support of LGBTQIA+ Community",
      href: "https://today.ucsd.edu/story/computer-science-undergrad-jonathan-ty-awarded-alan-turing-memorial-scholarships",
    },
  },
  {
    id: "tapia-grant",
    title: "TAPIA 2024 Grant Recipient",
    organization: "CMD-IT / ACM",
    date: "2024",
    description:
      "Selected for a scholarship grant to attend the TAPIA Celebration of Diversity in Computing conference.",
    link: {
      label: "Tapia 2024 Conference | San Diego CA",
      href: "https://cmd-it.org/tapia-2024-conference-september-18-20-san-diego-ca/",
    },
  },
  {
    id: "weissbuch-scholarship",
    title: "Weissbuch Family Scholarship",
    organization: "San Diego Foundation",
    date: "2023",
    description:
      "Merit-based scholarship awarded to undergraduate students in the UC San Diego Computer Science program.",
  },
  {
    id: "marye-anne-fox-scholarship",
    title: "Marye Anne Fox and James Whitesell Scholarship",
    organization: "UC San Diego",
    date: "2023",
    description:
      "Scholarship established in honor of former UC San Diego Chancellor Marye Anne Fox, awarded for academic achievement.",
  },
];
