export type EVENT_COLOR =
  | "cyan"
  | "green"
  | "red"
  | "pink"
  | "yellow"
  | "skyblue";
export type EVENT =
  | "PushEvent"
  | "CreateEvent"
  | "DeleteEvent"
  | "ForkEvent"
  | "IssuesEvent"
  | "PullRequestEvent"
  | "WatchEvent";

const EVENT_LOOKUP: {
  [s in EVENT]: [string, EVENT_COLOR];
} = {
  PushEvent: ["Committed", "cyan"],
  CreateEvent: ["Created", "green"],
  DeleteEvent: ["Deleted", "red"],
  ForkEvent: ["Forked", "pink"],
  IssuesEvent: ["Raised Issue", "yellow"],
  PullRequestEvent: ["Pull Request", "skyblue"],
  WatchEvent: ["Watched", "yellow"],
};

export interface GitHubActivityResponse {
  user: {
    username: string;
    avatarUrl: string;
  };
  event: {
    action: EVENT;
    color: EVENT_COLOR;
    message?: string;
    datetimestr: string;
  };
  repo: {
    url: string;
    name: string;
  };
}

const getEventTagline = (event: any): string | null => {
  let pl = event.payload;
  if (pl.commits) return pl.commits[0].message;
  if (pl.issue) return pl.issue.title;
  if (pl.pull_request) return pl.pull_request.title;
  return null;
};

export async function getGitHubActivity(user: string) {
  "use server";
  try {
    if (!user) {
      return null;
    }

    let events = await fetch(`https://api.github.com/users/${user}/events`, {
      headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
      cache: "no-store",
    }).then((res) => res.json());

    let event = null;
    for (let i = 0; i < events.length; i++) {
      event = events[i];
      if (event.type in EVENT_LOOKUP && event.actor.login === user) {
        break;
      }
    }

    if (!event) {
      return null;
    }

    let [action, color] = EVENT_LOOKUP[event.type as keyof typeof EVENT_LOOKUP];
    let date = new Date(event.created_at);
    let datetimestr =
      date.toLocaleDateString() + " " + date.toLocaleTimeString();
    let message = getEventTagline(event);
    if (message && message.length > 15) {
      message = message.substring(0, 15) + "...";
    }

    return {
      user: {
        avatarUrl: event.actor.avatar_url as string,
        username: user,
      },
      event: {
        action,
        color,
        message,
        datetimestr,
      },
      repo: {
        url: `https://github.com/${event.repo.name}`,
        name: event.repo.name.split("/")[1],
      },
    } as GitHubActivityResponse;
  } catch (err) {
    return null;
  }
}

// Types for GitHub GraphQL contribution calendar
export interface ContributionDay {
  contributionCount: number;
  date: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface GitHubContributionGraph {
  totalContributions: number;
  days: ContributionDay[];
}

/**
 * Fetches the GitHub contribution graph data for a user using the GraphQL API.
 * @param username - The GitHub username
 * @returns The contribution calendar data (total contributions and daily counts)
 */
export async function getGitHubContributionGraph(
  username: string
): Promise<GitHubContributionGraph | null> {
  const query = `
    query($userName: String!) {
      user(login: $userName) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  const variables = { userName: username };

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });

    const json = await res.json();
    const calendar: ContributionCalendar | undefined =
      json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) return null;

    // Flatten all days
    const days: ContributionDay[] = calendar.weeks.flatMap(
      (w) => w.contributionDays
    );
    return {
      totalContributions: calendar.totalContributions,
      days,
    };
  } catch (err) {
    return null;
  }
}
