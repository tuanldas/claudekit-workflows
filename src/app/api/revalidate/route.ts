import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_TAGS = ["docs-mdx", "docs-tree"];

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "REVALIDATE_SECRET not configured" },
      { status: 500 },
    );
  }
  const token = req.headers.get("x-revalidate-token");
  if (token !== secret) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  let tags: string[] = DEFAULT_TAGS;
  try {
    const body = (await req.json()) as { tags?: string[] };
    if (Array.isArray(body.tags) && body.tags.length > 0) tags = body.tags;
  } catch {
    // body optional, fall through with default
  }
  // Next.js 16: revalidateTag requires 2nd profile arg
  for (const tag of tags) revalidateTag(tag, "max");
  return NextResponse.json({ ok: true, revalidated: tags });
}
