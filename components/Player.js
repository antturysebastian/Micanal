"use client";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const I = {
  play: <polygon points="6 4 20 12 6 20 6 4" />,
  pause: <><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></>,
  vol: <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M19 5a10 10 0 0 1 0 14" /></>,
  mute: <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="22" y1="9" x2="16" y2="15" /><line x1="16" y1="9" x2="22" y2="15" /></>,
  full: <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" /></>,
};
const Icon = ({ n }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{I[n]}</svg>
);

export default function Player({ src }) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const idleRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [vol, setVol] = useState(1);
  const [levels, setLevels] = useState([]);
  const [level, setLevel] = useState(-1);
  const [menu, setMenu] = useState(false);
  const [atLive, setAtLive] = useState(true);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !src) return;
    let hls;
    if (Hls.isSupported()) {
      hls = new Hls({ lowLatencyMode: true });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(v);
      hls.on(Hls.Events.MANIFEST_PARSED, (_, d) =>
        setLevels(d.levels.map((l, i) => ({ i, h: l.height })).filter((l) => l.h).sort((a, b) => b.h - a.h))
      );
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (!data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
        else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
        else hls.destroy();
      });
    } else {
      v.src = src; // Safari reproduce HLS de forma nativa
    }
    return () => { hls?.destroy(); hlsRef.current = null; };
  }, [src]);

  const v = () => videoRef.current;
  const toggle = () => (v().paused ? v().play() : v().pause());
  const unmute = () => { v().muted = false; if (!v().volume) v().volume = 1; };
  const fullscreen = () => (document.fullscreenElement ? document.exitFullscreen() : wrapRef.current.requestFullscreen());
  const goLive = () => { const h = hlsRef.current; if (h?.liveSyncPosition) v().currentTime = h.liveSyncPosition; v().play(); };
  const pick = (i) => { if (hlsRef.current) hlsRef.current.currentLevel = i; setLevel(i); setMenu(false); };
  const wake = () => {
    setActive(true);
    clearTimeout(idleRef.current);
    idleRef.current = setTimeout(() => setActive(false), 2800);
  };
  const onTime = () => {
    const h = hlsRef.current;
    if (h?.liveSyncPosition) setAtLive(h.liveSyncPosition - v().currentTime < 12);
  };

  const show = active || !playing || menu;

  return (
    <div ref={wrapRef} className={`player ${show ? "" : "idle"}`} onMouseMove={wake} onMouseLeave={() => !menu && setActive(false)}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onVolumeChange={() => { setMuted(v().muted); setVol(v().volume); }}
        onTimeUpdate={onTime}
      />

      {muted && playing && (
        <button className="unmute" onClick={unmute}><Icon n="mute" /> Activar sonido</button>
      )}

      <div className="controls">
        <button className="cbtn" onClick={toggle} aria-label={playing ? "Pausar" : "Reproducir"}><Icon n={playing ? "pause" : "play"} /></button>
        <button className="cbtn" onClick={() => (v().muted = !v().muted)} aria-label={muted ? "Activar sonido" : "Silenciar"}><Icon n={muted || vol === 0 ? "mute" : "vol"} /></button>
        <input
          className="vol"
          type="range" min="0" max="1" step="0.05"
          value={muted ? 0 : vol}
          aria-label="Volumen"
          onChange={(e) => { const x = +e.target.value; v().volume = x; v().muted = x === 0; }}
        />
        <button className={`live ${atLive ? "on" : ""}`} onClick={goLive} title="Ir al directo">
          <i /> {atLive ? "EN DIRECTO" : "VOLVER AL DIRECTO"}
        </button>
        <span className="grow" />
        {levels.length > 0 && (
          <div className="qwrap">
            <button className="cbtn" onClick={() => setMenu((m) => !m)} aria-label="Calidad"><Icon n="gear" /></button>
            {menu && (
              <ul className="menu">
                {[{ i: -1, h: "Auto" }, ...levels].map((l) => (
                  <li key={l.i}>
                    <button className={l.i === level ? "sel" : ""} onClick={() => pick(l.i)}>{l.i === -1 ? "Auto" : `${l.h}p`}</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <button className="cbtn" onClick={fullscreen} aria-label="Pantalla completa"><Icon n="full" /></button>
      </div>
    </div>
  );
}
