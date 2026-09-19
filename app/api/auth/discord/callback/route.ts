import { NextRequest, NextResponse } from "next/server";
import { createSession, getOAuthState, clearOAuthState } from "@/lib/session";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error)}`, req.url)
    );
  }

  if (!code || !returnedState) {
    return NextResponse.json(
      { error: "Missing Discord OAuth code or state." },
      { status: 400 }
    );
  }

  const expectedState = await getOAuthState();
  await clearOAuthState();

  if (!expectedState || expectedState !== returnedState) {
    return NextResponse.json(
      { error: "Invalid OAuth state. Please try logging in again." },
      { status: 400 }
    );
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      { error: "Discord OAuth is not configured." },
      { status: 500 }
    );
  }

  const tokenResponse = await fetch("https://discord.com/api/v10/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
    cache: "no-store",
  });

  if (!tokenResponse.ok) {
    const detail = await tokenResponse.text();
    return NextResponse.json(
      { error: "Discord token exchange failed.", detail },
      { status: 502 }
    );
  }

  const token = await tokenResponse.json();

  const [meResponse, guildsResponse] = await Promise.all([
    fetch("https://discord.com/api/v10/users/@me", {
      headers: { Authorization: `Bearer ${token.access_token}` },
      cache: "no-store",
    }),
    fetch("https://discord.com/api/v10/users/@me/guilds", {
      headers: { Authorization: `Bearer ${token.access_token}` },
      cache: "no-store",
    }),
  ]);

  if (!meResponse.ok) {
    return NextResponse.json(
      { error: "Could not read Discord user profile." },
      { status: 502 }
    );
  }

  const user = await meResponse.json();
  const guilds = guildsResponse.ok ? await guildsResponse.json() : [];

  await createSession({
    user: {
      id: user.id,
      username: user.username,
      global_name: user.global_name ?? null,
      avatar: user.avatar ?? null,
    },
    guilds: guilds.map((g: any) => ({
      id: g.id,
      name: g.name,
      icon: g.icon ?? null,
      owner: !!g.owner,
      permissions: g.permissions ?? "0",
    })),
  });

  return NextResponse.redirect(new URL("/dashboard", req.url));
}
