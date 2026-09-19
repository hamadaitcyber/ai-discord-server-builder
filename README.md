# AI Discord Server Builder — MVP v2

MVP ini menambahkan 3 integrasi utama:
1. Login Discord OAuth2
2. OpenAI API untuk generate blueprint
3. Deployment ke Discord menggunakan Bot API

## 1. Prasyarat

- Node.js 20+
- Discord Developer Application
- Discord Bot
- OpenAI API key

Discord OAuth2 menggunakan authorization-code flow dengan scope `identify guilds`. Discord menyediakan OAuth2 authorization endpoint dan token endpoint untuk flow ini. Bot dipasang melalui OAuth2 `bot` + `applications.commands`.

## 2. Setup Discord

Di Discord Developer Portal:
- Buat Application.
- Copy Client ID dan Client Secret.
- Buat/aktifkan Bot dan copy Bot Token.
- Tambahkan redirect URI:
  `http://localhost:3000/api/auth/discord/callback`
- Untuk test, install bot ke server Discord yang Anda kelola.
- Bot membutuhkan permission yang sesuai untuk membuat kategori/channel/role.

Untuk keamanan, jangan commit Client Secret atau Bot Token ke Git.

## 3. Setup OpenAI

Buat API key lalu isi `OPENAI_API_KEY`.
API call dijalankan server-side melalui SDK resmi `openai`; key tidak pernah dikirim ke browser.

## 4. Environment

Copy:

```bash
cp .env.example .env.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Isi:
- DISCORD_CLIENT_ID
- DISCORD_CLIENT_SECRET
- DISCORD_REDIRECT_URI
- DISCORD_BOT_TOKEN
- OPENAI_API_KEY
- OPENAI_MODEL
- SESSION_SECRET

## 5. Jalankan

```bash
npm install
npm run dev
```

Buka:
http://localhost:3000

## 6. Flow

Landing
→ Login Discord
→ Builder
→ Prompt
→ OpenAI
→ Blueprint
→ Masukkan Discord Server ID
→ Deploy

## Catatan penting deployment

Endpoint deployment sengaja hanya membuat resource yang belum ada berdasarkan nama/type, sehingga mengurangi duplikasi saat deploy ulang.

MVP ini belum melakukan:
- database persistence
- refresh/revocation token storage
- full permission overwrite editor
- rollback
- job queue
- deployment diff yang lengkap
- CSRF/state persistence OAuth yang production-grade
- rate limiting
- encryption/token persistence

Sebelum production, tambahkan database + state/nonce OAuth + rate limiting + audit logs + worker queue + permission validation.


## Public Discord Login

This version supports one shared Discord OAuth application for all website users.
Visitors do not enter their own Discord Client ID, Client Secret, bot token, or OpenAI key.

Configure these server-side environment variables:
- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `DISCORD_REDIRECT_URI`
- `SESSION_SECRET`

For local development, add this redirect URI to your Discord application:
`http://localhost:3000/api/auth/discord/callback`

The login flow generates a cryptographically random OAuth `state`, stores it in an
HTTP-only cookie, and validates it on callback before creating the user's session.
Discord authorization is still required from each user; the site cannot and should
not bypass Discord's consent screen.

For production, replace the localhost redirect URI with the HTTPS URL of your deployed
site and keep the client secret only on the server.
