import { Member } from '@prisma/client';
import React from 'react'
import ChatWelCome from './chat-welcome';
import { useChatQuery } from '@/hooks/use-chat-query';
import { Loader2 } from 'lucide-react';

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
  const queryKey = `chat:${chatId}`
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    status
  } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue
  })

  if (status === "loading") {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <Loader2  className='w-8 h-8 text-zinc-700 animate-spin my-4'/>
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>
          Loading messages...
        </p>
      </div>
    )
  }
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