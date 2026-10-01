"use client";
import { useEffect, useState } from "react";

// Chat embebido de Twitch: https://dev.twitch.tv/docs/embed/chat/
export default function Chat() {
  const channel = process.env.NEXT_PUBLIC_TWITCH_CHANNEL;
  const [src, setSrc] = useState(null);

  useEffect(() => {
    if (!channel) return;
    // Twitch exige un "parent" por cada dominio donde se muestra el embed.
    // Se toma el dominio actual (localhost, producción o previews de Vercel)
    // y se pueden sumar otros con NEXT_PUBLIC_TWITCH_PARENTS=dominio1,dominio2
    const extra = (process.env.NEXT_PUBLIC_TWITCH_PARENTS || "").split(",").map((d) => d.trim()).filter(Boolean);
    const parents = [...new Set([window.location.hostname, ...extra])];
    const qs = parents.map((p) => `parent=${encodeURIComponent(p)}`).join("&");
    const dark = "&darkpopout";
    setSrc(`https://www.twitch.tv/embed/${encodeURIComponent(channel)}/chat?${qs}${dark}`);
  }, [channel]);

  if (!channel) {
    return (
      <div className="empty">
        <strong>Chat sin configurar</strong>
        <span>Define NEXT_PUBLIC_TWITCH_CHANNEL con el nombre de tu canal de Twitch.</span>
      </div>
    );
  }
  if (!src) return null;

  return (
    <iframe
      title={`Chat de Twitch de ${channel}`}
      src={src}
      sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-modals"
    />
  );
}
