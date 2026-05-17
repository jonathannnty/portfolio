import { getGitHubData } from "@/lib/activity/github";

export const revalidate = 3600;

export async function GET() {
  const data = await getGitHubData();
  if (!data) return new Response(null, { status: 204 });
  return Response.json(data);
}
