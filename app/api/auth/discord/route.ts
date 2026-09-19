import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { setOAuthState } from "@/lib/session";

export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "Discord OAuth is not configured." },
      { status: 500 }
    );
  }

  const state = crypto.randomBytes(32).toString("hex");
  await setOAuthState(state);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: "identify guilds",
    state,
  });

  return NextResponse.redirect(
    `https://discord.com/oauth2/authorize?${params.toString()}`
  );
}
