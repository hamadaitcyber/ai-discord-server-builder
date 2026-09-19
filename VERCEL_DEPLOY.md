# Deploy ke Vercel (gratis)

## 1. Upload project ke GitHub
- Buat repository baru, misalnya `ai-discord-server-builder`.
- Upload seluruh isi folder project ini.
- Jangan upload `.env.local` atau secret API key.

## 2. Import ke Vercel
- Buka https://vercel.com/
- Login dengan GitHub.
- Add New Project -> pilih repository.
- Framework akan terdeteksi sebagai Next.js.
- Deploy.

## 3. Environment Variables
Di Vercel -> Project -> Settings -> Environment Variables, isi:

DISCORD_CLIENT_ID
DISCORD_CLIENT_SECRET
DISCORD_REDIRECT_URI
DISCORD_BOT_TOKEN
OPENAI_API_KEY
OPENAI_MODEL
SESSION_SECRET

Untuk production, `DISCORD_REDIRECT_URI` harus:
https://NAMA-PROJECT.vercel.app/api/auth/discord/callback

Jangan beri prefix NEXT_PUBLIC_ pada secret.

## 4. Discord OAuth2
Di Discord Developer Portal -> OAuth2 -> Redirects, tambahkan URL production yang sama:
https://NAMA-PROJECT.vercel.app/api/auth/discord/callback

## 5. Redeploy
Setelah Environment Variables dan Redirect URI benar, lakukan Redeploy di Vercel.

## Catatan
Vercel memberikan URL gratis `*.vercel.app`, jadi domain berbayar belum diperlukan.
