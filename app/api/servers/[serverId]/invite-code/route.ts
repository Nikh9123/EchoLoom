import { NextResponse } from "next/server";
import {v4 as uuidv4} from "uuid"

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
	req: Request,
	{
		params,
	}: {
		params: {
			serverId: string;
		};
	}
) {
	try {
		const profile = await currentProfile();
		if (!profile) {
			return new NextResponse("unauthorized", { status: 401 });
		}

		if (!params.serverId) {
			return new NextResponse("server ID is missing", { status: 400 });
		}

    const server = await db.server.update({
      where : {
        id : params.serverId,
        profileId : profile.id
      },
      data:{
        inviteCode: uuidv4()
      }
    })

    return NextResponse.json(server);

	} catch (error) {
		console.log("Error from api/servers/serverId : ", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

//& NOTE: 
//*we don't need to mention the member role to be ADMIN because we are already checking 
//*if the profile is ADMIN or not in the server-header.tsx so only the admins can see the edit button and 
//*only admins and moderators can edit the server invite code by default admin is moderator also so we don't need to mention the role here