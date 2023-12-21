"use client";
import React, { Fragment, useRef, ElementRef, use } from 'react'
import { Member, Message, Profile } from '@prisma/client';
import { Loader2, ServerCrashIcon } from 'lucide-react';
import { format } from "date-fns";

import ChatWelCome from './chat-welcome';
import { useChatQuery } from '@/hooks/use-chat-query';
<<<<<<< HEAD
import { Loader2 } from 'lucide-react';
=======
import { ChatItem } from './chat-item';
import { useChatSocket } from '@/hooks/use-chat-socket';
import { useChatScroll } from '@/hooks/use-chat-scroll';


const DATE_FORMAT = "d MMM yyyy, HH:mm"
>>>>>>> 1d64d64694c8bd6660e6308a89a3dc5249e59389

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile
  }
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
  type,
}: ChatMessagesProps) => {
<<<<<<< HEAD
  const queryKey = `chat:${chatId}`
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
=======

  
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
>>>>>>> 1d64d64694c8bd6660e6308a89a3dc5249e59389
    status
  } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
<<<<<<< HEAD
    paramValue
  })

  if (status === "loading") {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <Loader2  className='w-8 h-8 text-zinc-700 animate-spin my-4'/>
=======
    paramValue,
  });
  useChatSocket({
    queryKey,
    addKey,
    updateKey
  })

 useChatScroll({
  chatRef,
  bottomRef,
  loadMore : fetchNextPage,
  shouldLoadMore : !isFetchingNextPage && !!hasNextPage,
  count : data?.pages?.[0]?.items?.length ?? 0,

 })

  if (status === "loading") {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <Loader2 className='w-8 h-8 text-zinc-500 animate-spin my-4' />
>>>>>>> 1d64d64694c8bd6660e6308a89a3dc5249e59389
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>
          Loading messages...
        </p>
      </div>
    )
  }
<<<<<<< HEAD
=======
  if (status === "error") {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <ServerCrashIcon className='w-8 h-8 text-zinc-500 animate-spin my-4' />
        <p className='text-sm text-zinc-500 dark:text-zinc-400'>
          Something went wrong ❌🚫❌
        </p>
      </div>
    )
  }
>>>>>>> 1d64d64694c8bd6660e6308a89a3dc5249e59389
  return (
    <div
      ref={chatRef}
      className='flex-1 flex flex-col py-4 overflow-y-auto'
    >
<<<<<<< HEAD
      <div className='flex-1' />
      <ChatWelCome
        type={type}
        name={name}
      />
=======
      {!hasNextPage && <div className='flex-1' />}
      {
        !hasNextPage && <ChatWelCome
          type={type}
          name={name}
        />
      }
      {
        hasNextPage && (
          <div className='flex justify-center'>
            {isFetchingNextPage ?
              (
                <Loader2 className='h-6 w-6 text-zinc-500  animate-spin my-4' />
              ) : (
                <button
                  onClick={() => fetchNextPage()}
                  className='text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 my-4 transition'
                >
                  Load previous messages...
                </button>
              )
            }
          </div>
        )
      }
      <div className='flex flex-col-reverse mt-auto '>
        {data?.pages?.map((group, i) => (
          <Fragment
            key={i}
          >
            {group?.items?.map((message: MessageWithMemberWithProfile) => (
              <ChatItem key={message.id}
                currentMember={member}
                member={message.member}
                id={message.id}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />

>>>>>>> 1d64d64694c8bd6660e6308a89a3dc5249e59389
    </div>
  )
}

export default ChatMessages