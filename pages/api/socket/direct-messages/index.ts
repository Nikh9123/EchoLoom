import { NextApiRequest } from "next";

import { currentProfilePages } from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/types";
import { db } from "@/lib/db";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponseServerIo
) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		const profile = await currentProfilePages(req);

		const { content, fileUrl } = req.body;

		const { conversationId } = req.query;

		if (!profile) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		if (!conversationId) {
			return res.status(401).json({ error: "conversation id is required" });
		}
		if (!content) {
			return res.status(401).json({ error: "Content is missing" });
		}

		//1. find the conversation
		const conversation = await db.conversation.findFirst({
			where: {
				id: conversationId as string,
				OR: [
					{
						memberOne: {
							profileId: profile.id,
						},
					},
					{
						memberTwo: {
							profileId: profile.id,
						},
					},
				],
			},
			include: {
				memberOne: {
					include: {
						profile: true,
					},
				},
				memberTwo: {
					include: {
						profile: true,
					},
				},
			},
		});

		if (!conversation) {
			return res.status(404).json({ message: "conversation not found" });
		}

		//2. find the member
		const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo;
		
    if (!member) {
			return res.status(404).json({ message: "member not found" });
		}

		const message = await db.directMessage.create({
			data: {
				fileUrl,
				content,
				conversationId: conversationId as string,
				memberId: member.id,
			},
			include: {
				member: {
					include: {
						profile: true,
					},
				},
			},
		});

		//^ channelKey is the name of the channel that the client will listen to.
		const channelKey = `chat:${conversationId}:messages`;

		//^ The message is sent to the client using the io.emit() method.
		res?.socket?.server?.io?.emit(channelKey, message);

		return res.status(200).json(message);
	} catch (error) {
		console.log(
			"❌❌❌error from pages/api/socket/direct-messages/messages.ts => POST ",
			error
		);
		return res.status(500).json({ error: "Internal server error" });
	}
}
