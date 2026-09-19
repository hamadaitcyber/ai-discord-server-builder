import { NextRequest,NextResponse } from "next/server"; import { generateBlueprint } from "@/lib/openai";
export async function POST(req:NextRequest){
 const body=await req.json(); if(!body.prompt||typeof body.prompt!=="string")return NextResponse.json({error:"Prompt wajib diisi."},{status:400});
 try{return NextResponse.json({blueprint:await generateBlueprint(body.prompt)})}
 catch(e){return NextResponse.json({error:e instanceof Error?e.message:"AI generation failed"},{status:500})}
}