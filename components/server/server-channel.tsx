"use client";

import React from 'react'

import { Channel, ChannelType, MemberRole, Server } from '@prisma/client';
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { ActionToolTip } from '@/components/action-tooltip';

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
          "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
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
      {/* if the channel is not a general channel and the role is not guest it then */}
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className=' ml-auto flex items-center gap-x-2'>
          <ActionToolTip label="Edit" >
            <Edit className='hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition ' />
          </ActionToolTip>
          <ActionToolTip label="delete" >
            <Trash className='hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition ' />
          </ActionToolTip>
        </div>
      )}
      {
        channel.name === "general" && (
          <Lock className='ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400' />
        )
      }
    </button>
  )
}

export default ServerChannel