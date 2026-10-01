# Mi stream (Next.js + Livepeer Studio + Vercel)

## 1. Crear el stream (gratis)
1. Crea una cuenta en https://livepeer.studio (plan gratuito).
2. Developers → API Keys → crea una API key.
3. Streams → Create stream. Anota el **Stream ID**, la **Stream key** y la URL de ingesta RTMP.

## 2. Configurar OBS
Ajustes → Emisión → Servicio: Personalizado
- Servidor: `rtmp://rtmp.livepeer.com/live`
- Clave de retransmisión: tu Stream key
Recomendado: keyframe cada 2 s, codificador x264, H.264 + AAC.

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
2. En vercel.com → Add New → Project → importa el repo.
3. En Environment Variables agrega: LIVEPEER_API_KEY, LIVEPEER_STREAM_ID, NEXT_PUBLIC_CHANNEL_NAME, NEXT_PUBLIC_TWITCH_CHANNEL.
4. Deploy.
