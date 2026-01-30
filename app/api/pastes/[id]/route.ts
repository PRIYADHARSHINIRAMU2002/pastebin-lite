import { kv } from "@vercel/kv";
import { nowMs } from "@/lib/time";

type Paste = {
  content: string;
  expires_at: number | null;
  max_views: number | null;
  views: number;
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✅ FIX
  const key = `paste:${id}`;

  const paste = await kv.get<Paste>(key);

  if (!paste) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const now = nowMs(new Headers(req.headers));

  // TTL check
  if (paste.expires_at && now >= paste.expires_at) {
    await kv.del(key);
    return Response.json({ error: "Expired" }, { status: 404 });
  }

  // View limit check
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return Response.json({ error: "View limit exceeded" }, { status: 404 });
  }

  // Increment views safely
  const updatedViews = paste.views + 1;

  await kv.set(key, {
    ...paste,
    views: updatedViews,
  });

  return Response.json({
    content: paste.content,
    remaining_views:
      paste.max_views === null ? null : paste.max_views - updatedViews,
    expires_at: paste.expires_at
      ? new Date(paste.expires_at).toISOString()
      : null,
  });
}
