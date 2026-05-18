export type SpotifyData = {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumArt: string;
  songUrl: string;
  playlistName?: string;
  playlistUrl?: string;
} | null;

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL =
  "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_URL =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";

async function getPlaylistInfo(
  token: string,
  contextUri: string
): Promise<{ playlistName: string; playlistUrl: string } | null> {
  const id = contextUri.split(":").pop();
  if (!id) return null;
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${id}?fields=name,external_urls`,
    {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return {
    playlistName: data.name as string,
    playlistUrl: data.external_urls?.spotify as string,
  };
}

async function getAccessToken(): Promise<string | null> {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!id || !secret || !refresh) return null;

  const basic = Buffer.from(`${id}:${secret}`).toString("base64");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh,
    }),
    cache: "no-store",
  });

  if (!res.ok) return null;
  const { access_token } = await res.json();
  return (access_token as string) ?? null;
}

export async function getSpotifyData(): Promise<SpotifyData> {
  try {
    const token = await getAccessToken();
    if (!token) return null;

    const authHeader = { Authorization: `Bearer ${token}` };
    const nowRes = await fetch(NOW_PLAYING_URL, {
      headers: authHeader,
      next: { revalidate: 60 },
    });

    if (nowRes.status === 200) {
      const data = await nowRes.json();
      if (data?.item && data?.currently_playing_type === "track") {
        const context =
          data.context?.type === "playlist" ? data.context : null;
        const playlist = context
          ? await getPlaylistInfo(token, context.uri as string)
          : null;
        return {
          isPlaying: data.is_playing as boolean,
          title: data.item.name as string,
          artist: (data.item.artists as { name: string }[])
            .map((a) => a.name)
            .join(", "),
          albumArt: (data.item.album.images as { url: string }[])[0]?.url ?? "",
          songUrl: data.item.external_urls.spotify as string,
          ...playlist,
        };
      }
    }

    const recentRes = await fetch(RECENTLY_PLAYED_URL, {
      headers: authHeader,
      next: { revalidate: 60 },
    });

    if (!recentRes.ok) return null;

    const recent = await recentRes.json();
    const item = recent?.items?.[0];
    const track = item?.track;
    if (!track) return null;

    const recentContext =
      item.context?.type === "playlist" ? item.context : null;
    const recentPlaylist = recentContext
      ? await getPlaylistInfo(token, recentContext.uri as string)
      : null;

    return {
      isPlaying: false,
      title: track.name as string,
      artist: (track.artists as { name: string }[]).map((a) => a.name).join(", "),
      albumArt: (track.album.images as { url: string }[])[0]?.url ?? "",
      songUrl: track.external_urls.spotify as string,
      ...recentPlaylist,
    };
  } catch {
    return null;
  }
}
