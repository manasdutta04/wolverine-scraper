import { NextResponse } from "next/server";
import {
  ACTIONS_WORKFLOW,
  GITHUB_OWNER,
  GITHUB_REPO_NAME,
} from "@/lib/nav";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  simulateFailure?: string;
};

export async function POST(req: Request) {
  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    body = {};
  }

  const simulate =
    typeof body.simulateFailure === "string" ? body.simulateFailure.trim() : "";

  const token = process.env.GITHUB_PAT || process.env.GH_PAT || "";
  if (!token) {
    return NextResponse.json(
      {
        ok: false,
        dispatched: false,
        reason: "missing_pat",
        message:
          "Set Vercel secret GITHUB_PAT (workflow scope) to dispatch from the UI. Bright Data stays in GitHub Actions only.",
        actionsUrl: ACTIONS_WORKFLOW,
      },
      { status: 503 },
    );
  }

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO_NAME}/actions/workflows/scrape.yml/dispatches`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ref: "main",
      inputs: {
        simulate_failure: simulate,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      {
        ok: false,
        dispatched: false,
        reason: "github_error",
        message: text.slice(0, 400) || `GitHub ${res.status}`,
        actionsUrl: ACTIONS_WORKFLOW,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    dispatched: true,
    simulateFailure: simulate || null,
    actionsUrl: ACTIONS_WORKFLOW,
    message: simulate
      ? `Dispatched simulate_failure=${simulate}`
      : "Dispatched full field scrape + heal + scar:export",
  });
}

export async function GET() {
  const configured = Boolean(process.env.GITHUB_PAT || process.env.GH_PAT);
  return NextResponse.json({
    configured,
    actionsUrl: ACTIONS_WORKFLOW,
  });
}
