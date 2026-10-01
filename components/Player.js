"use client";
import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function Player({ src }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || !src) return;

    if (Hls.isSupported()) {
      const hls = new Hls({ lowLatencyMode: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (!data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
        else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
        else hls.destroy();
      });
      return () => hls.destroy();
    }
    video.src = src; // Safari reproduce HLS de forma nativa
  }, [src]);

  return <video ref={ref} controls autoPlay muted playsInline />;
}
