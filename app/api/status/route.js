const API = "https://livepeer.studio/api";
const headers = { "Cache-Control": "s-maxage=10, stale-while-revalidate=10" };

export async function GET() {
  const key = process.env.LIVEPEER_API_KEY;
  const id = process.env.LIVEPEER_STREAM_ID;
  if (!key || !id) return Response.json({ error: "config" }, { status: 500 });

  const auth = { Authorization: `Bearer ${key}` };
  try {
    const res = await fetch(`${API}/stream/${id}`, { headers: auth, cache: "no-store" });
    if (!res.ok) throw new Error("stream");
    const stream = await res.json();
    if (!stream.isActive) return Response.json({ live: false }, { headers });

    let url = `https://livepeer.studio/hls/${stream.playbackId}/index.m3u8`;
    let webrtc = `https://livepeercdn.studio/webrtc/${stream.playbackId}`;
    try {
      const p = await fetch(`${API}/playback/${stream.playbackId}`, { headers: auth, cache: "no-store" }).then((r) => r.json());
      const hls = p?.meta?.source?.find((s) => s.hrn?.startsWith("HLS"));
      if (hls?.url) url = hls.url;
      const rtc = p?.meta?.source?.find((s) => s.hrn?.startsWith("WebRTC"));
      if (rtc?.url) webrtc = rtc.url;
    } catch {}

    return Response.json({ live: true, url, webrtc }, { headers });
  } catch {
    return Response.json({ error: "api" }, { status: 502 });
  }
}
