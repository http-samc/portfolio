import { NextRequest, NextResponse } from "next/server";

export type EVENT_COLOR =
  | "cyan"
  | "green"
  | "red"
  | "pink"
  | "yellow"
  | "skyblue";
type EVENT =
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

interface GitHubActivityParams {
  user: string;
}

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<GitHubActivityParams> }
) {
  const { user } = await params;

  try {
    if (!user) {
      return new NextResponse("No user specified.", { status: 400 });
    }

    let events = await fetch(`https://api.github.com/users/${user}/events`, {
      headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
    }).then((res) => res.json());

    let event = null;
    for (let i = 0; i < events.length; i++) {
      event = events[i];
      if (event.type in EVENT_LOOKUP && event.actor.login === user) {
        break;
      }
    }

    if (!event) {
      return new NextResponse("No recognized events found.", { status: 400 });
    }

    let [action, color] = EVENT_LOOKUP[event.type as keyof typeof EVENT_LOOKUP];
    let date = new Date(event.created_at);
    let datetimestr =
      date.toLocaleDateString() + " " + date.toLocaleTimeString();
    let message = getEventTagline(event);
    if (message && message.length > 15) {
      message = message.substring(0, 15) + "...";
    }

    return NextResponse.json({
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
    } as GitHubActivityResponse);
  } catch (err) {
    return new NextResponse(err as string, { status: 400 });
  }
}
