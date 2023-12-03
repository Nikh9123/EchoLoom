import React from 'react'
import { redirect } from 'next/navigation';
import { ChannelType } from '@prisma/client';

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db';
import ServerHeader from './server-header';

interface ServerSidebarProps {
  serverId: string
}

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {

  const profile = await currentProfile();

  if (!profile) {
    redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc"
        }
      },
      members: {
        include: {
          profile: true
        },
        orderBy: {
          role: "asc"
        }
      }
    }
  });

  //seprating channels

  const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT);
  const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);
  const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);

  //extract the members no need to show ourselve in members list
  const members = server?.members.filter((member) => member.profileId !== profile.id);

  if (!server) {
    return redirect("/");
  }

  //find our role 
  const role = server?.members.find((member) => member.profileId === profile.id)?.role;

  // console.log("jello", role);


  return (
    <div className=' flex flex-col h-full text-primary
    w-full dark:bg-[rgb(43,45,49)] bg-[#F2F3F5]'>
      <ServerHeader server={server} role={role} />
    </div>
  )
}

export default ServerSidebar
//3:10:41