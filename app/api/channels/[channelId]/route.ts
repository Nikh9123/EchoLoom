import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function DELETE(
	req: Request,
	{ params }: { params: { channelId: string } }
) {
	try {
		const { channelId } = params;

		const { searchParams } = new URL(req.url);

		const serverId = searchParams.get("serverId");

		const profile = await currentProfile();

		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
		if (!serverId) {
			return new NextResponse("server ID is missing", { status: 400 });
		}

		const updatedServer = await db.server.update({
			where: {
				id: serverId,
				members: {
					some: {
						profileId: profile.id,
						role: {
							in: [MemberRole.ADMIN, MemberRole.MODERATOR],
						},
					},
				},
			},
			data: {
				channels: {
					delete: {
						name: {
							not: "general",
						},
						id: channelId,
					},
				},
			},
		});

    return NextResponse.json(updatedServer);

	} catch (error) {
		console.log("error from /channels/[channelId]/route.ts DELETE: ", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { channelId: string } }
) {
	try {
		const { channelId } = params;

    const {name,type} = await req.json() ;

		const { searchParams } = new URL(req.url);

		const serverId = searchParams.get("serverId");

		const profile = await currentProfile();

		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
		if (!serverId) {
			return new NextResponse("server ID is missing", { status: 400 });
		}
    if(name === "general")
		{
			return new NextResponse("channel name can not be 'general' ", {status:400})
		}
		const updatedServer = await db.server.update({
			where: {
				id: serverId,
				members: {
					some: {
						profileId: profile.id,
						role: {
							in: [MemberRole.ADMIN, MemberRole.MODERATOR],
						},
					},
				},
			},
			data: {
				channels: {
					update:{
						where:{
							id : channelId,
							NOT:{
								name : "general"
							}
						},
						data:{
							name,
							type
						}
					}
				},
			},
		});

    return NextResponse.json(updatedServer);

	} catch (error) {
		console.log("error from /channels/[channelId]/route.ts PATCH: ", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}

