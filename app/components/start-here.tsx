"use client";

import { useRouter } from "next/navigation";
import { Briefcase, Code2, Palette } from "lucide-react";

const personas = [
  {
    key: "recruiter",
    Icon: Briefcase,
    label: "I'm a Recruiter",
    desc: "Show me completed projects and real-world impact.",
  },
  {
    key: "engineer",
    Icon: Code2,
    label: "I'm an Engineer",
    desc: "Show me technical depth and stack complexity.",
  },
  {
    key: "designer",
    Icon: Palette,
    label: "I'm a Designer",
    desc: "Show me projects with design and UX work.",
  },
];

export default function StartHere() {
  const router = useRouter();

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {personas.map(({ key, Icon, label, desc }) => (
        <button
          key={key}
          onClick={() => router.push(`/projects?persona=${key}`)}
          className="card group flex cursor-pointer flex-col gap-3 p-5 text-left transition-colors"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[color:var(--color-primary-50)] text-[color:var(--color-primary-700)] transition-colors group-hover:bg-[color:var(--color-primary-100)]">
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <p className="font-semibold text-xl text-[color:var(--color-fg)]">
              {label}
            </p>
            <p className="mt-1 text-sm text-[color:var(--color-fg-muted)]">
              {desc}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
