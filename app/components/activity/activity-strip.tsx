"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SpotifyWidget from "./spotify-widget";
import GitHubHeatmap from "./github-heatmap";
import type { SpotifyData } from "@/lib/activity/spotify";
import type { GitHubData } from "@/lib/activity/github";

type Props = {
  spotify: SpotifyData;
  github: GitHubData;
};

export default function ActivityStrip({ spotify, github }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-8 border-b border-[color:var(--color-border)] pb-2">
      {/* Collapsed bar — always visible */}
      <div className="flex items-center gap-3 py-2">
        <span className="font-mono text-[10px] uppercase tracking-widest opacity-50 flex-none">
          Activity
        </span>

        <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
          {spotify && (
            <span className="chip text-xs truncate max-w-[200px]">
              {spotify.title} — {spotify.artist}
            </span>
          )}
          {github && github.totalThisWeek > 0 && (
            <span className="chip text-xs flex-none whitespace-nowrap">
              {github.totalThisWeek} contributions this week
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="btn-ghost flex items-center gap-1 text-xs flex-none py-1 px-2"
          aria-expanded={open}
          aria-controls="activity-body"
          aria-label={open ? "Collapse activity section" : "Expand activity section"}
        >
          {open ? "hide" : "show"}
          <ChevronDown
            className={`h-3.5 w-3.5 motion-reduce:transition-none transition-transform duration-[250ms] ease-out ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Expandable body — CSS grid-template-rows trick, no JS height measurement */}
      <div
        id="activity-body"
        aria-hidden={!open || undefined}
        className="grid motion-reduce:transition-none"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 250ms ease-out",
        }}
      >
        <div className="overflow-hidden">
          <div className="grid sm:grid-cols-2 gap-6 pb-4 pt-2">
            {spotify ? (
              <SpotifyWidget data={spotify} />
            ) : (
              <p className="font-mono text-xs text-[color:var(--color-fg-subtle)]">
                Not listening right now.
              </p>
            )}
            {github ? (
              <GitHubHeatmap data={github} />
            ) : (
              <p className="font-mono text-xs text-[color:var(--color-fg-subtle)]">
                GitHub data unavailable.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
