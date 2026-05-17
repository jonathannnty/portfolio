import Image from "next/image";
import type { SpotifyData } from "@/lib/activity/spotify";

type Props = { data: NonNullable<SpotifyData> };

export default function SpotifyWidget({ data }: Props) {
  return (
    <a
      href={data.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 group/spotify min-w-0"
    >
      {data.albumArt && (
        <Image
          src={data.albumArt}
          alt={`${data.title} album art`}
          width={48}
          height={48}
          className="rounded-sm flex-none"
        />
      )}
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-0.5">
          {data.isPlaying ? "Now playing" : "Last played"}
        </p>
        <p className="font-display font-semibold text-sm text-[color:var(--color-fg)] truncate transition-colors duration-150 group-hover/spotify:text-[color:var(--color-primary-700)]">
          {data.title}
        </p>
        <p className="font-mono text-xs text-[color:var(--color-fg-muted)] truncate">
          {data.artist}
        </p>
      </div>
    </a>
  );
}
