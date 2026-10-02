# Mi stream (Next.js + Livepeer Studio + Vercel)

## 1. Crear el stream (gratis)
1. Crea una cuenta en https://livepeer.studio (plan gratuito).
2. Developers -> API Keys -> crea una API key.
3. Streams -> Create stream. Anota el **Stream ID**, la **Stream key** y la URL de ingesta RTMP.

## 2. Configurar OBS (con ajustes de baja latencia)
Ajustes -> Emisión -> Servicio: Personalizado
- Servidor: `rtmp://rtmp.livepeer.com/live`
- Clave de retransmisión: tu Stream key

Ajustes -> Salida -> Modo de salida: Avanzado -> pestaña Emisión:
- Control de tasa: CBR (por ejemplo 3000-4500 Kbps para 720p/1080p)
- Intervalo de fotogramas clave: 1 s (o 2 s si ves cortes)
- Codificador x264: Preajuste de CPU `veryfast` (o más rápido), Ajuste (tune) `zerolatency`
- Opciones de x264: `bframes=0`
- Si usas NVENC: Máx. fotogramas B = 0, Look-ahead desactivado
Sin B-frames se reduce el retraso de codificación.

## Latencia (solo HLS)
El reproductor está configurado para la latencia más baja posible con HLS (components/Player.js):
`liveSyncDurationCount: 1`, `liveMaxLatencyDurationCount: 3`, `maxLiveSyncPlaybackRate: 1.15`,
`maxBufferLength: 4`. Es un ajuste agresivo: si ves cortes o buffering, sube
`liveSyncDurationCount` a 2 (y luego a 3, el valor por defecto de hls.js).
El retraso mínimo también depende de Livepeer (duración de los segmentos) y de OBS
(keyframe de 1 s, `zerolatency`), así que no baja de unos segundos.

## 3. Chat de Twitch
El chat es el de un canal de Twitch (https://dev.twitch.tv/docs/embed/chat/).
Necesitas una cuenta/canal de Twitch y poner su nombre en `NEXT_PUBLIC_TWITCH_CHANNEL`.
Los espectadores deben iniciar sesión en Twitch dentro del recuadro para escribir.
El parámetro `parent` se calcula solo con el dominio actual (localhost, Vercel, previews).

## 4. Probar en local
```
cp .env.example .env.local   # rellena los valores
npm install
npm run dev
```

## 5. Desplegar en Vercel
1. Sube la carpeta a GitHub.
2. En vercel.com -> Add New -> Project -> importa el repo.
3. En Environment Variables agrega: LIVEPEER_API_KEY, LIVEPEER_STREAM_ID, NEXT_PUBLIC_CHANNEL_NAME, NEXT_PUBLIC_TWITCH_CHANNEL.
4. Deploy.
