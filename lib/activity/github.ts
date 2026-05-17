export type GitHubData = {
  totalThisWeek: number;
  weeks: { days: number[] }[];
} | null;

const GRAPHQL_URL = "https://api.github.com/graphql";
const USERNAME = "jonathannnty";

const QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              contributionCount
            }
          }
        }
      }
    }
  }
`;

export async function getGitHubData(): Promise<GitHubData> {
  const token = process.env.GH_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: QUERY, variables: { login: USERNAME } }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const json = await res.json();
    const calendar =
      json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) return null;

    const weeks: { days: number[] }[] = calendar.weeks.map(
      (w: { contributionDays: { contributionCount: number }[] }) => ({
        days: w.contributionDays.map((d) => d.contributionCount),
      }),
    );

    const lastWeek = weeks[weeks.length - 1];
    const totalThisWeek = lastWeek
      ? lastWeek.days.reduce((sum, n) => sum + n, 0)
      : 0;

    return { totalThisWeek, weeks };
  } catch {
    return null;
  }
}
