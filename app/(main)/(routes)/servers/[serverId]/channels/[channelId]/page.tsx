import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";

import { ChatHeader } from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  }
}

// load current channel and curren member

const ChannelIdPage = async ({
  params
}: ChannelIdPageProps
) => {

  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  //fetch channel and member
  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    }
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    }
  })

  if (!channel || !member) {
    return redirect('/');
  }

  return (
    <div
      className="bg-white dark:bg-[#313338] flex flex-col h-full"
    >
      <ChatHeader type="channel" name={channel.name} serverId={channel.serverId} />

      <ChatMessages
        type="channel"
        name={channel.name}
        chatId={channel.id}
        member={member}
        apiUrl="/api/messages"
        socketUrl="/api/socket/messages"
        socketQuery={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
        paramKey="channelId"
        paramValue="channel.id"
      />

      <ChatInput
        name={channel.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
      />

    </div>
  )
}

export default ChannelIdPage;
//8:29:00