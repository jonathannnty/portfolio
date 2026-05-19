import { getSpotifyData } from "@/lib/activity/spotify";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getSpotifyData();
  if (!data) return new Response(null, { status: 204 });
  return Response.json(data);
}
