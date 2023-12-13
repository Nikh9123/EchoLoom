import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const profile = await currentProfile();

		// cextract server id
		const { searchParams } = new URL(req.url);
		const serverId = searchParams.get("serverId");

		if (!profile) {
			return new NextResponse("unauthorized", { status: 401 });
		}

		if (!serverId) {
			return new NextResponse("server ID is missing", {
				status: 400,
			});
		}

		const { name, type } = await req.json();

		if (name === "general") {
			return new NextResponse("channel name cannot be general ", {
				status: 400,
			});
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
					create: {
						profileId: profile.id,
						name,
						type,
					},
				},
			},
		});

		return NextResponse.json(updatedServer);
	} catch (error) {
		console.log("error from api/channels/route.ts ❌", error);
		return new NextResponse("internal error", {
			status: 400,
		});
	}
}
