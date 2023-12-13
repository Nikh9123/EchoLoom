import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
	req: Request,
	{ params }: { params: { serverId: string } }
) {
	try {
		const profile = await currentProfile();

		if (!profile) {
			return new NextResponse("unauthorized", { status: 401 });
		}

		const { name, imageUrl } = await req.json();

		const updatedServer = await db.server.update({
			where: {
				id: params.serverId,
				profileId: profile.id,
			},
			data: {
				name,
				imageUrl,
			},
		});
		return NextResponse.json(updatedServer);
	} catch (err) {
		console.log("error from app/api/servers/[serverId]", err);
		return new NextResponse("internal error", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { serverId: string } }
) {
	try {
		const profile = await currentProfile();
		if (!profile) {
			return new NextResponse("unauthorized", { status: 401 });
		}
		const server = await db.server.delete({
			where: {
				id: params.serverId,
				profileId: profile.id,
			},
		});
		return NextResponse.json(server);
	} catch (err) {
		console.log("error from app/api/servers/[serverId]/[DELETE]", err);
		return new NextResponse("internal error", { status: 500 });
	}
}
