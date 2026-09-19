import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
const secret=()=>new TextEncoder().encode(process.env.SESSION_SECRET||"dev-only-change-me");
export type Session={id:string;username:string;avatar?:string;guilds?:any[]};
export async function setSession(s:Session){
 const token=await new SignJWT(s).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(secret());
 (await cookies()).set("db_session",token,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/"});
}
export async function getSession():Promise<Session|null>{
 const token=(await cookies()).get("db_session")?.value;if(!token)return null;
 try{const {payload}=await jwtVerify(token,secret());return payload as unknown as Session}catch{return null}
}
export async function clearSession(){(await cookies()).delete("db_session")}

export const OAUTH_STATE_COOKIE = "discord_oauth_state";

export async function setOAuthState(state: string) {
  const jar = await cookies();
  jar.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
}

export async function getOAuthState() {
  const jar = await cookies();
  return jar.get(OAUTH_STATE_COOKIE)?.value;
}

export async function clearOAuthState() {
  const jar = await cookies();
  jar.set(OAUTH_STATE_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
