import { initialProfile } from '@/lib/initial-profile'
import { db } from '@/lib/db';
import {redirect} from 'next/navigation'
import { InitialModel } from '@/components/models/initial-modal';

const SetupPage = async () => {
  const profile = await initialProfile();

  //1. find the server where the user profile is a member
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  })
  if(server)
  {
    //2. redirect to that server
    return redirect(`/servers/${server.id}`)
  }
  return (
    <InitialModel/>
  )
}

export default SetupPage