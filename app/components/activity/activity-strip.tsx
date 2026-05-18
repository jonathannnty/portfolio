import SpotifyWidget from "./spotify-widget";
import GitHubHeatmap from "./github-heatmap";
import type { SpotifyData } from "@/lib/activity/spotify";
import type { GitHubData } from "@/lib/activity/github";

type Props = {
  spotify: SpotifyData;
  github: GitHubData;
};

export default function ActivityStrip({ spotify, github }: Props) {
  return (
    <div className="mb-8 border-b border-[color:var(--color-border)] pb-4">
      <div className="grid sm:grid-cols-2 gap-6 py-2">
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
  );
}
