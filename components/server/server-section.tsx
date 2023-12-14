"use client"

import { ServerWithMembersWithProfiles } from '@/types';
import { ChannelType, MemberRole } from '@prisma/client';
import React from 'react'
import { ActionToolTip } from '@/components/action-tooltip';
import { Plus, Settings } from 'lucide-react';
import { useModal } from '@/hooks/use-modal-store';


interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server
}: ServerSectionProps) => {

  const { onOpen } = useModal();

  return (
    <div className='flex justify-between items-center py-2'>
      <p className='text-xs uppercase font-semibold
        text-zinc-500 dark:text-zinc-200'>
        {label}
      </p>
      {
        role !== MemberRole.GUEST && sectionType === "channels" && (
          <ActionToolTip label='Create Channel' side='top'>
            <button className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400
            dark:hover:text-zinc-300 transition
            '
              onClick={() => onOpen("createChannel", {channelType})}
            >
              <Plus className="h-4 w-4" size={16}
              />
            </button>
          </ActionToolTip>
        )
      }
      {
        role === MemberRole.ADMIN && sectionType === "members" && (
          <ActionToolTip label='Manage Members' side='top'>
            <button className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400
            dark:hover:text-zinc-300 transition
            '
              onClick={() => onOpen("members", { server })}
            >
              <Settings className="h-4 w-4" size={16}
              />
            </button>
          </ActionToolTip>
        )
      }
    </div>
  )
}

export default ServerSection