import Image from "next/image";
import type { SpotifyData } from "@/lib/activity/spotify";

type Props = { data: NonNullable<SpotifyData> };

export default function SpotifyWidget({ data }: Props) {
  return (
    <div className="min-w-0">
      {/* Track info */}
      <div className="flex items-center gap-3 min-w-0">
        <a
          href={data.songUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-none shrink-0 group/art"
        >
          <Image
            src={data.albumArt}
            alt={data.title}
            width={48}
            height={48}
            className="rounded-sm transition-opacity duration-150 group-hover/art:opacity-75"
          />
        </a>

        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-0.5">
            {data.isPlaying ? "Now playing" : "Last played"}
          </p>
          <a
            href={data.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/title"
          >
            <p className="font-display font-semibold text-sm text-[color:var(--color-fg)] truncate transition-colors duration-150 group-hover/title:text-[color:var(--color-primary-700)]">
              {data.title}
            </p>
          </a>
          <p className="font-mono text-xs text-[color:var(--color-fg-muted)] truncate">
            {data.artist}
          </p>
          {data.playlistName && (
            <p className="font-mono text-[10px] text-[color:var(--color-fg-subtle)] truncate mt-0.5">
              {data.playlistUrl ? (
                <a
                  href={data.playlistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-150 hover:text-[color:var(--color-primary-700)]"
                >
                  in: {data.playlistName}
                </a>
              ) : (
                `in: ${data.playlistName}`
              )}
            </p>
          )}
        </div>
      </div>

      {/* Vinyl record — replace /vinyl.png with your own asset when ready */}
      <div className="mt-3 flex items-center gap-3">
        <div
          className={`relative w-20 h-20 flex-none motion-reduce:transition-none ${
            data.isPlaying
              ? "animate-spin [animation-duration:3s]"
              : "opacity-30"
          }`}
        >
          <Image
            src="/vinyl.png"
            alt=""
            aria-hidden="true"
            fill
            className="object-contain"
            sizes="80px"
          />
          {/* Album art overlay in the center groove */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={data.albumArt}
                alt=""
                aria-hidden="true"
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
          </div>
        </div>

        <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">
          {data.isPlaying ? "Now spinning" : "Idle"}
        </span>
      </div>
    </div>
  );
}
