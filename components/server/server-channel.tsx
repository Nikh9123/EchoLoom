"use client";

import React from 'react'

import { Channel, ChannelType, MemberRole, Server } from '@prisma/client';
import { Hash, Mic, Video } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;

}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video
}

const ServerChannel = ({
  channel, server, role
}: ServerChannelProps
) => {
  //the channel id is in the url
  const params = useParams();
  const router = useRouter();

  const Icon = iconMap[channel.type];



  return (
    <button
      onClick={() => { }}
      className={
        cn(
          "group px-2 py-2 rounded-md flex items-center gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
          params?.channelId === channel.id &&
          "bg-zinc-700/20 dark:bg-zinc-700"
        )
      }
    >
      <Icon className='flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400' />
      <p
        className={
          cn(
            "line-clamp-1 text-sm font-semibold text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition ",
            params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
          )
        }
      >
        {channel.name}
      </p>
    </button>
  )
}

export default ServerChannel