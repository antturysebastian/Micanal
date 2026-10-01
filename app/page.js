"use client";
import { useEffect, useState } from "react";
import Player from "../components/Player";
import Chat from "../components/Chat";

export default function Home() {
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    let stop = false;
    async function check() {
      try {
        const r = await fetch("/api/status");
        const d = await r.json();
        if (stop) return;
        if (!r.ok) setState({ status: "error", code: d.error });
        else setState((prev) => (d.live ? (prev.url === d.url ? prev : { status: "live", url: d.url, webrtc: d.webrtc }) : { status: "offline" }));
      } catch {
        if (!stop) setState({ status: "error", code: "network" });
      }
    }
    check();
    const t = setInterval(check, 10000);
    return () => { stop = true; clearInterval(t); };
  }, []);

  const live = state.status === "live";

  return (
    <main>
      <header>
        <h1>{process.env.NEXT_PUBLIC_CHANNEL_NAME || "Mi canal"}</h1>
        <span className={`badge ${live ? "on" : ""}`}>
          <span className="dot" />
          {live ? "En vivo" : "Fuera de línea"}
        </span>
      </header>

      <div className="layout">
      <div className="stage">
        {live ? (
          <Player src={state.url} webrtc={state.webrtc} />
        ) : (
          <div className="empty">
            <strong>
              {state.status === "loading" && "Buscando la transmisión…"}
              {state.status === "offline" && "No hay transmisión ahora"}
              {state.status === "error" && "No se pudo comprobar el estado"}
            </strong>
            <span>
              {state.status === "offline" && "Esta página se actualiza sola: cuando empieces en OBS, el video aparece aquí."}
              {state.status === "error" && (state.code === "config" ? "Faltan las variables LIVEPEER_API_KEY y LIVEPEER_STREAM_ID en Vercel." : "Reintentando automáticamente.")}
            </span>
          </div>
        )}
      </div>
      <aside className="chat">
        <Chat />
      </aside>
      </div>
    </main>
  );
}
