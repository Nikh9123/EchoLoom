import React from 'react'
import { redirect } from 'next/navigation';
import { ChannelType, MemberRole } from '@prisma/client';
import { Hash, Mic, ShieldAlertIcon, ShieldCheck, User, Video } from 'lucide-react';

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db';
import ServerHeader from './server-header';
import { ScrollArea } from '@/components/ui/scroll-area';
import ServerSearch from './server-search';
import { Separator } from '@/components/ui/separator';
import ServerSection from './server-section';
import ServerChannel from './server-channel';
import ServerMember from './server-member';

interface ServerSidebarProps {
  serverId: string
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className='mr-2 w-4 h-4' />,
  [ChannelType.AUDIO]: <Mic className='mr-2 w-4 h-4' />,
  [ChannelType.VIDEO]: <Video className='mr-2 w-4 h-4' />
}

const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldAlertIcon className='mr-2 w-4 h-4 text-rose-500' />,
  [MemberRole.MODERATOR]: <ShieldCheck className='mr-2 w-4 h-4 text-indigo-700' />,
  [MemberRole.GUEST]: <User className='mr-2 w-4 h-4 text-slate-500' />
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
      <ScrollArea
        className='flex px-3'>
        <div className='mt-2'>
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }
                ))
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }
                ))
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role]
                }))
              }
            ]} />
        </div>
        <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-1' />
        {/* we are rendering the the textchanels with the label "Text Channel and //textChannels?.length is now a boolean" */}
        {
          !!textChannels?.length && (
            <div className='mb-2 '>
              <ServerSection
                channelType={ChannelType.TEXT}
                role={role}
                sectionType={"channels"}
                label='Text Channels'
                server={server}
              />
              <div className='space-y-[2px]'>

                {
                  textChannels?.map((channel) => (
                    <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
                  ))
                }
              </div>

            </div>
          )
        }
        {
          !!audioChannels?.length && (
            <div className='mb-2'>
              <ServerSection
                role={role}
                label='Audio Channels'
                channelType={ChannelType.AUDIO}
                sectionType='channels'
              />
              <div className='space-y-[2px]'>

                {
                  audioChannels?.map((channel) => (
                    <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
                  ))
                }
              </div>
            </div>
          )
        }
        {
          !!videoChannels?.length && (
            <div className='mb-2'>
              <ServerSection
                role={role}
                label='Video Channels'
                channelType={ChannelType.VIDEO}
                sectionType='channels'
              />
              <div className='space-y-[2px]'>

                {
                  videoChannels?.map((channel) => (
                    <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
                  ))
                }
              </div>
            </div>
          )
        }
        {
          !!members?.length && (
            <div className='mb-2'>
              <ServerSection
                role={role}
                label='Members'
                sectionType='members'
                server={server}
              />
              <div className='space-y-[2px]'>

                {
                  members?.map((member) => (
                    <ServerMember key={member.id} member={member} server={server}/>
                  ))
                }
              </div>
            </div>
          )
        }
      </ScrollArea>
    </div>
  )
}

export default ServerSidebar
//3:10:41