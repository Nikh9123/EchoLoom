import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChatHeader } from "@/components/chat/chat-header";

interface ConversationMemberIdPageProps{
params :{
  memberId : string;
  serverId : string
}
}


const ConversationMemberIdPage = async({
  params
} : ConversationMemberIdPageProps) => {
  const profile = await currentProfile();

  if(!profile){
    redirectToSignIn();
  }

  //1. find the member first(me) 
  const currentMember = await db.member.findFirst({
    where:{
      serverId : params.serverId,
      profileId : profile?.id
    },
    include:{
      profile: true
    }
  })

  if(!currentMember){
    return redirect("/");
  }

  //2. find the conversation
  const conversation = await getOrCreateConversation(currentMember.id, params.memberId);
  
  if(!conversation){
    return redirect(`/servers/${params.serverId}`)
  }

  const {memberOne, memberTwo} = conversation ;
  
  //3. find the member that is not the current member
  const otherMember = memberOne.id === currentMember?.id ? memberTwo : memberOne ;
  

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full ">
      <ChatHeader 
      imageUrl={otherMember.profile.imageUrl}
      name={otherMember.profile.name}
      type="conversation"
      serverId={params.serverId}
      />
    </div>
  )
};

export default ConversationMemberIdPage ;