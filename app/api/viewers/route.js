// Contador de espectadores propio: cada visitante envía un "latido" cada 15 s
// y se cuenta a quienes enviaron uno en los últimos 35 s. Requiere Redis (Upstash).
export const dynamic = "force-dynamic";

export async function POST(req) {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return Response.json({ count: null });

  let id;
  try { ({ id } = await req.json()); } catch {}
  if (typeof id !== "string" || id.length > 64) return Response.json({ count: null }, { status: 400 });

  const now = Date.now();
  try {
    const r = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["ZADD", "viewers", now, id],
        ["ZREMRANGEBYSCORE", "viewers", "-inf", now - 35000],
        ["ZCARD", "viewers"],
        ["EXPIRE", "viewers", 120],
      ]),
      cache: "no-store",
    });
    const out = await r.json();
    return Response.json({ count: out?.[2]?.result ?? null });
  } catch {
    return Response.json({ count: null });
  }
}
