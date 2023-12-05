import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request) {
	try {
		const { name, imageUrl } = await req.json();
		const profile = await currentProfile();

		if (!profile) {
			return new NextResponse("unauthorized", { status: 401 });
		}

		//1. create a server
		const sever = await db.server.create({
			data: {
				profileId: profile.id,
				name,
				imageUrl,
				inviteCode: uuidv4(),
				channels: {
					create: [
            { 
              name: "general", 
              profileId: profile.id 
            }
          ],
				},
				members: {
					create: [
						{
							profileId: profile.id,
							role: MemberRole.ADMIN,
						},
					],
				},
			},
		});

		
    console.log("sever : ", sever);
    return NextResponse.json(sever);

	} catch (error) {
		console.log("Error from api/servers/POST : ", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
