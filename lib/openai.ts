import OpenAI from "openai";
import { Blueprint } from "./blueprint";
const client=()=>new OpenAI({apiKey:process.env.OPENAI_API_KEY});
const schema={
 type:"object",additionalProperties:false,
 properties:{
  name:{type:"string"},description:{type:"string"},
  categories:{type:"array",items:{type:"object",additionalProperties:false,properties:{key:{type:"string"},name:{type:"string"}},required:["key","name"]}},
  channels:{type:"array",items:{type:"object",additionalProperties:false,properties:{key:{type:"string"},name:{type:"string"},type:{type:"string",enum:["text","voice"]},category:{type:"string"}},required:["key","name","type","category"]}},
  roles:{type:"array",items:{type:"object",additionalProperties:false,properties:{key:{type:"string"},name:{type:"string"},permissions:{type:"array",items:{type:"string"}}},required:["key","name","permissions"]}},
  automations:{type:"array",items:{type:"object",additionalProperties:false,properties:{type:{type:"string"},enabled:{type:"boolean"}},required:["type","enabled"]}}
 },required:["name","description","categories","channels","roles","automations"]
};
export async function generateBlueprint(prompt:string):Promise<Blueprint>{
 if(!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY belum diatur.");
 const response=await client().responses.create({
  model:process.env.OPENAI_MODEL||"gpt-5.5",
  input:[
   {role:"system",content:"You are a Discord server architect. Convert the user's idea into a safe, coherent server blueprint. Use stable unique keys. Do not invent Discord IDs. Use least privilege. Never grant Administrator except to the owner role. Keep the result practical and not bloated."},
   {role:"user",content:prompt}
  ],
  text:{format:{type:"json_schema",name:"discord_blueprint",strict:true,schema}}
 } as any);
 return JSON.parse(response.output_text) as Blueprint;
}