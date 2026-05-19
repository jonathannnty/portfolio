"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { SpotifyData } from "@/lib/activity/spotify";

type Props = { data: NonNullable<SpotifyData> };

const POLL_MS = 30_000;

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function SpotifyWidget({ data: initialData }: Props) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/spotify");
        if (res.ok) setData(await res.json());
      } catch {
        // keep showing last known state on network errors
      }
    };

    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
  }, []);

  const timestamp = data.isPlaying
    ? "now"
    : data.playedAt
    ? formatRelativeTime(data.playedAt)
    : null;

  return (
    <div className="flex flex-col gap-2 h-full">
      <p className="font-mono text-[10px] uppercase tracking-widest opacity-50">
        Spotify Activity
      </p>
      <div className="flex-1 flex items-center gap-4 min-w-0 min-h-0">
        {/* Vinyl record */}
        <div
          className={`relative aspect-square h-full max-h-32 flex-none motion-reduce:transition-none ${
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
            sizes="128px"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-1/3 h-1/3 rounded-full overflow-hidden">
              <Image
                src={data.albumArt}
                alt=""
                aria-hidden="true"
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          </div>
        </div>

        {/* Song info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-[10px] uppercase tracking-widest opacity-50">
              {data.isPlaying ? "Now playing" : "Last played"}
            </p>
            {timestamp && (
              <p className="font-mono text-[10px] opacity-40 flex-none">
                {timestamp}
              </p>
            )}
          </div>
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
    </div>
  );
}
