const API="https://discord.com/api/v10";
function env(name:string){const v=process.env[name];if(!v)throw new Error(`${name} is not configured`);return v}
export async function discordToken(code:string){
 const body=new URLSearchParams({client_id:env("DISCORD_CLIENT_ID"),client_secret:env("DISCORD_CLIENT_SECRET"),grant_type:"authorization_code",code,redirect_uri:env("DISCORD_REDIRECT_URI")});
 const r=await fetch(`${API}/oauth2/token`,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body});
 if(!r.ok)throw new Error(`Discord token exchange failed: ${r.status}`);
 return r.json();
}
export async function discordUser(accessToken:string){
 const r=await fetch(`${API}/users/@me`,{headers:{Authorization:`Bearer ${accessToken}`}});
 if(!r.ok)throw new Error("Unable to read Discord user");
 return r.json();
}
export async function discordGuilds(accessToken:string){
 const r=await fetch(`${API}/users/@me/guilds`,{headers:{Authorization:`Bearer ${accessToken}`}});
 if(!r.ok)throw new Error("Unable to read Discord servers");
 return r.json();
}
export async function botRequest(path:string,init:RequestInit={}){
 const r=await fetch(`${API}${path}`,{...init,headers:{Authorization:`Bot ${env("DISCORD_BOT_TOKEN")}`,...(init.headers||{})}});
 const text=await r.text();let data:any;try{data=text?JSON.parse(text):null}catch{data=text}
 if(!r.ok)throw new Error(`Discord API ${r.status}: ${typeof data==="string"?data:JSON.stringify(data)}`);
 return data;
}
export function botInvite(guildId?:string){
 const p=new URLSearchParams({client_id:env("DISCORD_CLIENT_ID"),scope:"bot applications.commands",permissions:"268435520"});
 if(guildId)p.set("guild_id",guildId);
 return `https://discord.com/oauth2/authorize?${p.toString()}`;
}