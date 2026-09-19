export type Blueprint = {
  name:string; description:string;
  categories:{key:string;name:string}[];
  channels:{key:string;name:string;type:"text"|"voice";category:string}[];
  roles:{key:string;name:string;permissions:string[]}[];
  automations:{type:string;enabled:boolean}[];
};

export const demoBlueprint:Blueprint={
 name:"Gaming Indonesia",
 description:"Komunitas gaming profesional dengan onboarding, support, event, moderation, dan ruang komunitas.",
 categories:[
  {key:"start",name:"START HERE"},{key:"community",name:"COMMUNITY"},
  {key:"support",name:"SUPPORT"},{key:"voice",name:"VOICE"}
 ],
 channels:[
  {key:"welcome",name:"welcome",type:"text",category:"start"},
  {key:"rules",name:"rules",type:"text",category:"start"},
  {key:"verify",name:"verify",type:"text",category:"start"},
  {key:"choose_roles",name:"choose-roles",type:"text",category:"start"},
  {key:"general",name:"general",type:"text",category:"community"},
  {key:"introductions",name:"introductions",type:"text",category:"community"},
  {key:"gaming",name:"gaming",type:"text",category:"community"},
  {key:"media",name:"media",type:"text",category:"community"},
  {key:"help",name:"help",type:"text",category:"support"},
  {key:"ticket",name:"ticket",type:"text",category:"support"},
  {key:"lounge",name:"Lounge",type:"voice",category:"voice"},
  {key:"gaming_1",name:"Gaming 1",type:"voice",category:"voice"}
 ],
 roles:[
  {key:"owner",name:"OWNER",permissions:["Administrator"]},
  {key:"admin",name:"ADMIN",permissions:["ManageGuild","ManageChannels"]},
  {key:"moderator",name:"MODERATOR",permissions:["ManageMessages","ModerateMembers"]},
  {key:"support",name:"SUPPORT",permissions:["ViewChannel","SendMessages"]},
  {key:"member",name:"MEMBER",permissions:["ViewChannel","SendMessages"]},
  {key:"new_member",name:"NEW MEMBER",permissions:["ViewChannel"]}
 ],
 automations:[
  {type:"welcome",enabled:true},{type:"verification",enabled:true},
  {type:"ticket",enabled:true},{type:"moderation",enabled:true},{type:"logging",enabled:true}
 ]
};