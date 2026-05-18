import type { SpotifyData } from "@/lib/activity/spotify";

type Props = { data: NonNullable<SpotifyData> };

export default function SpotifyWidget({ data }: Props) {
  return (
    <div className="min-w-0">
      <a
        href={data.songUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 group/spotify min-w-0"
      >
        {/* Placeholder — swap this div for your own image asset when ready */}
        <div className="w-12 h-12 rounded-sm flex-none bg-[color:var(--color-surface-muted)] flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[color:var(--color-fg-subtle)]" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
          </svg>
        </div>

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

      {/* Record player — replace with your own animated asset when ready */}
      <div className="mt-3 flex items-center gap-2.5">
        <svg
          viewBox="0 0 56 56"
          width="36"
          height="36"
          aria-hidden="true"
          className={`flex-none ${data.isPlaying ? "animate-spin [animation-duration:3s]" : "opacity-30"}`}
        >
          <circle cx="28" cy="28" r="27" fill="#18181b" />
          <circle cx="28" cy="28" r="23" fill="none" stroke="#3f3f46" strokeWidth="1.5" />
          <circle cx="28" cy="28" r="19" fill="none" stroke="#3f3f46" strokeWidth="1.5" />
          <circle cx="28" cy="28" r="15" fill="none" stroke="#3f3f46" strokeWidth="1.5" />
          <circle cx="28" cy="28" r="10" fill="var(--color-primary-700)" />
          <circle cx="28" cy="28" r="2.5" fill="#18181b" />
        </svg>
        <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">
          {data.isPlaying ? "Now spinning" : "Idle"}
        </span>
      </div>
    </div>
  );
}
