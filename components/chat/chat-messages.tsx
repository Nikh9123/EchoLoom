import { Member } from '@prisma/client';
import React from 'react'
import ChatWelCome from './chat-welcome';

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type
}: ChatMessagesProps) => {
  return (
    <div
      className='flex-1 flex flex-col py-4 overflow-y-auto'
    >
      <div className='flex-1' />
      <ChatWelCome
      type={type}
      name={name}
      />
    </div>
  )
}

export default ChatMessages