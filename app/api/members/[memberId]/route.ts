import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
	req: Request,
	{
		params,
	}: {
		params: { memberId: string };
	}
) {
	try {
		console.log("💫💫req", req);
		console.log("😡😡", params);
		const profile = await currentProfile();

		//new URL has a searchParams property contains all the query params
		const { searchParams } = new URL(req.url);

		const { role } = await req.json();

		const serverId = searchParams.get("serverId");

		//update the role of the member

		if (!profile) {
			return new NextResponse("unauthorized", { status: 401 });
		}
		if (!serverId) {
			return new NextResponse("Server ID is missing", { status: 400 });
		}
		if (!params.memberId) {
			return new NextResponse("Member ID is missing ", { status: 400 });
		}

		//update the upcoming role and
		const updatedServer = await db.server.update({
			where: {
				id: serverId,
				profileId: profile.id,
			},
			data: {
				members: {
					update: {
						where: {
							id: params.memberId,
							profileId: {
								not: profile.id, //admin can't change their role
							},
						},
						data: {
							role: role,
						},
					},
				},
			},
			include: {
				members: {
					include: {
						profile: true,
					},
					orderBy: {
						role: "asc",
					},
				},
			},
		});
		console.log("server", updatedServer);
		return NextResponse.json(updatedServer);
	} catch (error) {
		console.log("error from api/member/[memberId]", error);
		return new NextResponse("internal error", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{
		params,
	}: {
		params: {
			memberId: string;
		};
	}
) {
	try {
    
		const profile = await currentProfile();
		if (!profile) {
			return new NextResponse("unauthorized", { status: 401 });
		}

		const { searchParams } = new URL(req.url);

		const serverId = searchParams.get("serverId");

		if (!serverId) {
			return new NextResponse("Server ID is missing", { status: 400 });
		}
		if (!params.memberId) {
			return new NextResponse("memberId ID is missing", { status: 400 });
		}

		const updatedServer = await db.server.update({
			where: {
				id: serverId,
				profileId: profile.id,
			},
			data: {
				members: {
					deleteMany: {
						id: params.memberId,
						profileId: {
							not: profile.id,
						},
					},
				},
			},
			include: {
				members: {
					include: {
						profile: true,
					},
					orderBy: {
						role: "asc",
					},
				},
			},
		});
    return NextResponse.json(updatedServer)
	} catch (error) {
		console.log("error from api/member/[memberId]", error);
	}
}
