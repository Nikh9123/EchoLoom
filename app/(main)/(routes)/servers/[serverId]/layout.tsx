import { redirectToSignIn } from '@clerk/nextjs';
import React from 'react'
import { redirect } from 'next/navigation';

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db';
import ServerSidebar from '@/components/server/server-sidebar';

type Props = {}

const ServerIdLayout = async ({ children, params }: {
  children: React.ReactNode,
  params: { serverId: string };
}) => {


  console.log("params", params);
  //1. find the user profile
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  //2. find server with this id

  const server = await db.server.findFirst({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  })

  if (!server) {
    return redirect("/");
  }

  return (
    <div className='h-full'>
    <div className='hidden md:flex h-full w-60 z-20
     flex-col fixed inset-y-0'>
      <ServerSidebar serverId={params.serverId}/>
      </div>
      <main className='h-full md:pl-60'>
        {children}
      </main>
    </div>
  )
}

export default ServerIdLayout