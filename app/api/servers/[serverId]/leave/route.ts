import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
	req: Request,
	{ params }: { params: { serverId: string } }
) {
	try {
		const profile = await currentProfile();
		if (!profile) {
			return new NextResponse("unauthorized", {
				status: 401,
			});
		}

		if (!params.serverId) {
			return new NextResponse("server ID is missing", {
				status: 400,
			});
		}

		const updatedServer = await db.server.update({
			where: {
				id: params.serverId,
				profileId: {
					not: profile.id,
				},
				members: {
					some: {
						profileId: profile.id,
					},
				},
			},
			data: {
				members: {
					deleteMany: {
						profileId: profile.id,
					},
				},
			},
		});
		return NextResponse.json(updatedServer);
	} catch (error) {
		console.log(
			"❌❌❌error from api/servers/[serverId]/leave/route.ts",
			error
		);
		return new NextResponse("Internal Error", {
			status: 500,
		});
	}
}
