import { NextRequest,NextResponse } from "next/server";
import { getSession } from "@/lib/session"; import { botRequest } from "@/lib/discord";
export async function POST(req:NextRequest){
 const session=await getSession(); if(!session)return NextResponse.json({error:"Login Discord terlebih dahulu."},{status:401});
 const {guildId,blueprint}=await req.json();
 if(!guildId||!blueprint)return NextResponse.json({error:"guildId dan blueprint wajib."},{status:400});
 const owned=session.guilds?.find((g:any)=>g.id===guildId);
 if(!owned)return NextResponse.json({error:"Server tidak ada dalam daftar server yang diotorisasi akun ini."},{status:403});
 try{
  const guild=await botRequest(`/guilds/${guildId}`);
  const existingRoles=await botRequest(`/guilds/${guildId}/roles`);
  const roleIds:Record<string,string>={};
  for(const r of blueprint.roles||[]){
   if(r.name==="@everyone")continue;
   const found=existingRoles.find((x:any)=>x.name===r.name);
   const created=found||await botRequest(`/guilds/${guildId}/roles`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:r.name,permissions:r.name==="OWNER"?"8":"0"})});
   roleIds[r.key]=created.id;
  }
  const existingChannels=await botRequest(`/guilds/${guildId}/channels`);
  const categoryIds:Record<string,string>={};
  for(const c of blueprint.categories||[]){
   const found=existingChannels.find((x:any)=>x.type===4&&x.name===c.name);
   const created=found||await botRequest(`/guilds/${guildId}/channels`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:c.name,type:4})});
   categoryIds[c.key]=created.id;
  }
  const results=[];
  for(const ch of blueprint.channels||[]){
   const found=existingChannels.find((x:any)=>x.name===ch.name&&x.type===(ch.type==="voice"?2:0));
   if(found){results.push({name:ch.name,status:"exists",id:found.id});continue}
   const created=await botRequest(`/guilds/${guildId}/channels`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:ch.name,type:ch.type==="voice"?2:0,parent_id:categoryIds[ch.category]||undefined})});
   results.push({name:ch.name,status:"created",id:created.id});
  }
  return NextResponse.json({ok:true,guild:guild.name,roles:Object.keys(roleIds).length,categories:Object.keys(categoryIds).length,channels:results});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Deployment failed"},{status:500})}
}