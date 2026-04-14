"use client";

import { useState, useMemo } from "react";
import { Search, LayoutGrid, List, X, ChevronDown } from "lucide-react";
import type { Project } from "@/content/projects";
import ProjectCard from "./project-card";
import InProgressProjectCard from "./in-progress-project-card";
import ProjectListItem from "./project-list-item";

type SortKey = "newest" | "oldest" | "complex";
type ViewMode = "card" | "list";
type StatusFilter = "all" | "completed" | "in-progress";

interface Props {
  projects: Project[];
  initialPersona?: string | null;
}

function initialSort(persona?: string | null): SortKey {
  if (persona === "engineer") return "complex";
  return "newest";
}

function initialStatus(persona?: string | null): StatusFilter {
  if (persona === "recruiter") return "completed";
  return "all";
}

export default function ProjectsGrid({ projects, initialPersona }: Props) {
  const [search, setSearch]               = useState("");
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  const [selectedYear, setSelectedYear]   = useState("all");
  const [status, setStatus]               = useState<StatusFilter>(() => initialStatus(initialPersona));
  const [sort, setSort]                   = useState<SortKey>(() => initialSort(initialPersona));
  const [view, setView]                   = useState<ViewMode>("card");

  /* Derived filter options */
  const allStacks = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => p.stack.forEach((s) => counts.set(s, (counts.get(s) ?? 0) + 1)));
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([s]) => s)
      .slice(0, 14);
  }, [projects]);

  const allYears = useMemo(() => {
    const years = new Set(projects.map((p) => p.sortKey.split("-")[0]));
    return [...years].sort((a, b) => b.localeCompare(a));
  }, [projects]);

  /* Filtered + sorted result */
  const filtered = useMemo(() => {
    let result = [...projects];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.stack.some((s) => s.toLowerCase().includes(q)) ||
          p.body.some((b) => b.toLowerCase().includes(q)),
      );
    }

    if (selectedStacks.length > 0) {
      result = result.filter((p) => selectedStacks.some((s) => p.stack.includes(s)));
    }

    if (selectedYear !== "all") {
      result = result.filter((p) => p.sortKey.startsWith(selectedYear));
    }

    if (status === "completed")   result = result.filter((p) => !p.inProgress);
    if (status === "in-progress") result = result.filter((p) => !!p.inProgress);

    if (sort === "newest")  result.sort((a, b) => b.sortKey.localeCompare(a.sortKey));
    if (sort === "oldest")  result.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    if (sort === "complex") result.sort((a, b) => b.stack.length - a.stack.length);

    return result;
  }, [projects, search, selectedStacks, selectedYear, status, sort]);

  const toggleStack = (s: string) =>
    setSelectedStacks((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const clearAll = () => {
    setSearch("");
    setSelectedStacks([]);
    setSelectedYear("all");
    setStatus("all");
    setSort("newest");
  };

  const hasFilters =
    !!search || selectedStacks.length > 0 || selectedYear !== "all" || status !== "all";

  const personaLabel =
    initialPersona === "recruiter" ? "Recruiter view — completed projects first"
    : initialPersona === "engineer" ? "Engineer view — sorted by stack complexity"
    : initialPersona === "designer" ? "Designer view — includes in-progress design work"
    : null;

  return (
    <div>
      {/* Persona banner */}
      {personaLabel && (
        <div className="mb-5 rounded-lg border border-[color:var(--color-primary-200)] bg-[color:var(--color-primary-50)] px-4 py-2.5 text-sm text-[color:var(--color-primary-800)]">
          {personaLabel}
        </div>
      )}

      <div className="mb-6 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-fg-subtle)]" />
          <input
            type="text"
            placeholder="Search by title, stack, or keyword…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg)] py-2 pl-9 pr-4 text-md text-[color:var(--color-fg)] placeholder:text-[color:var(--color-fg-subtle)] focus:border-[color:var(--color-primary-400)] focus:outline-none"
          />
        </div>

        {/* Stack chips */}
        <div className="flex flex-wrap gap-1.5">
          {allStacks.map((s) => (
            <button
              key={s}
              onClick={() => toggleStack(s)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                selectedStacks.includes(s)
                  ? "bg-[color:var(--color-primary-600)] text-white"
                  : "border border-[color:var(--color-border)] text-[color:var(--color-fg-muted)] hover:border-[color:var(--color-primary-400)] hover:text-[color:var(--color-primary-700)]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Controls row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status */}
            <div className="flex rounded-lg border border-[color:var(--color-border)] overflow-hidden text-sm font-medium">
              {(["all", "completed", "in-progress"] as StatusFilter[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 transition-colors ${
                    status === s
                      ? "bg-[color:var(--color-primary-100)] text-[color:var(--color-primary-800)]"
                      : "text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]"
                  }`}
                >
                  {s === "all" ? "All" : s === "completed" ? "Completed" : "In Progress"}
                </button>
              ))}
            </div>

            {/* Year */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="appearance-none rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg)] py-1.5 pl-3 pr-7 text-sm text-[color:var(--color-fg-muted)] focus:outline-none"
              >
                <option value="all">All years</option>
                {allYears.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[color:var(--color-fg-subtle)]" />
            </div>

            {hasFilters && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 text-sm text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-primary-700)]"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="appearance-none rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg)] py-1.5 pl-3 pr-7 text-sm text-[color:var(--color-fg-muted)] focus:outline-none"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="complex">Most complex</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[color:var(--color-fg-subtle)]" />
            </div>

            {/* View toggle */}
            <div className="flex overflow-hidden rounded-lg border border-[color:var(--color-border)]">
              <button
                onClick={() => setView("card")}
                aria-label="Card view"
                className={`p-1.5 transition-colors ${
                  view === "card"
                    ? "bg-[color:var(--color-primary-50)] text-[color:var(--color-primary-700)]"
                    : "text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("list")}
                aria-label="List view"
                className={`p-1.5 transition-colors ${
                  view === "list"
                    ? "bg-[color:var(--color-primary-50)] text-[color:var(--color-primary-700)]"
                    : "text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Result count */}
      <p className="mb-4 text-sm text-[color:var(--color-fg-subtle)]">
        {filtered.length} project{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-md text-[color:var(--color-fg-muted)]">
          No projects match your filters.{" "}
          <button onClick={clearAll} className="text-[color:var(--color-primary-700)] underline">
            Clear all
          </button>
        </div>
      ) : view === "card" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.slug} className="reveal">
              {p.inProgress ? <InProgressProjectCard project={p} /> : <ProjectCard project={p} />}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => (
            <div key={p.slug} className="reveal">
              <ProjectListItem project={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
