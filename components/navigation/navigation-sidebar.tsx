import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react'
import { NavigationAction } from '@/components/navigation/navigation-action';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NavigationItem } from './navigation-item';
import { ModeToggle } from '@/components/mode-toggle';
import { UserButton } from '@clerk/nextjs';

type Props = {}

const NavigationSideBar = async (props: Props) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect('/');
  }
  //1. find the server where the user profile is a member
  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  })

  return (
    <div className='space-y-4 flex flex-col items-center
    h-full text-primary w-full dark:bg-[#1E1F22]
    py-3'>
      <NavigationAction />
      <Separator className='h-[2px] bg-zinc-300
      dark:bg-zinc-700 rounded-md w-10 mx-auto'/>
      <ScrollArea className='flex-1 w-full'>
        {
          servers.map(server => (
            <div key={server.id} className='text-sm mb-4'>
              {/* {
                // trim the server name if it's too long
                server.name.length > 15 ? `${server.name.substring(0, 15)}...` : server.name
              } */}
              <NavigationItem name={server.name} imageUrl={server.imageUrl} id={server.id} />
            </div>
          ))
        }
      </ScrollArea>
      <div className='pb-3 mt-auto flex items-center flex-col gap-y-4'>

        <ModeToggle />
        <UserButton
          afterSignOutUrl='/'
          appearance={
            {
              elements:{
                avatarBox:"h-[48px] w-[48px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center ",
              }
            }
          }
        />
      </div>
    </div>
  )
}

export default NavigationSideBar