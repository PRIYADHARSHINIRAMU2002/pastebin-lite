import { kv } from "@vercel/kv";
import { notFound } from "next/navigation";

type Paste = {
  content: string;
  expires_at: number | null;
  max_views: number | null;
  views: number;
};

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const paste = await kv.get<Paste>(`paste:${id}`);

  if (!paste) {
    notFound();
  }

  // Expiry check
  const now = Date.now();
  if (paste.expires_at && now > paste.expires_at) {
    notFound();
  }

  return (
    <main style={{ padding: "2rem", whiteSpace: "pre-wrap" }}>
      <pre>{paste.content}</pre>
    </main>
  );
}
