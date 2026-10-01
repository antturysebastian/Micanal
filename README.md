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

## 3. Probar en local
```
cp .env.example .env.local   # rellena los valores
npm install
npm run dev
```

## 4. Desplegar en Vercel
1. Sube la carpeta a GitHub.
2. En vercel.com → Add New → Project → importa el repo.
3. En Environment Variables agrega: LIVEPEER_API_KEY, LIVEPEER_STREAM_ID, NEXT_PUBLIC_CHANNEL_NAME.
4. Deploy.
