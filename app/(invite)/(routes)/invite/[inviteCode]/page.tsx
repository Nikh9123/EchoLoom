import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";

interface inviteCodeProps {
  params: {
    inviteCode: string
  }
}

const inviteCode = async ({ params }: inviteCodeProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const { inviteCode } = params;

  if (!inviteCode) {
    redirect("/");
  }

  //1. Check if the person is already in the server then fetch the server and redirect to the server page 
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: inviteCode,
      members: {
        some: {
          profileId: profile.id
        }
      }
    },
  });

  if(existingServer) {
    redirect(`/servers/${existingServer.id}`)
  }

  //2. If not then add him to server
  const server = await db.server.update({
    where:{
      inviteCode : inviteCode, //where inviteCode == inviteCode
    },
    data:{
      members:{
        create:[
          {
            profileId: profile.id,
          }
        ]
      }
    }
  });

  if(server)
  {
    return redirect(`servers/${server.id}`);
  }

  if(!server)
  {
    redirect("/");
  }

  return null
}

export default inviteCode;