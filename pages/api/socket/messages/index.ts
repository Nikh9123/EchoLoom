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
    
		const {serverId, channelId } = req.query;
    
		if (!profile) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		if (!serverId) {
			return res.status(401).json({ error: "Server id is required" });
		}
    
		if (!channelId) {
      return res.status(401).json({ error: "Channel id is required" });
		}
		if (!content) {
      return res.status(401).json({ error: "Content is missing" });
		}
    
		//1. find the server
		const server = await db.server.findFirst({
			where: {
				id: serverId as string,
				members: {
					some: {
						profileId: profile.id,
					},
				},
			},
			include: {
				members: true,
			},
		});

		if (!server) {
			return res.status(404).json({ message: "Server not found" });
		}

		//2. find the channel
		const channel = await db.channel.findFirst({
			where: {
				id: channelId as string,
				serverId: serverId as string,
			},
		});

		if (!channel) {
			return res.status(404).json({ message: "Channel not found" });
		}

		//3. find the member
		const member = server.members.find(
			(member) => member.profileId === profile.id
		);
		if (!member) {
			return res.status(404).json({ message: "member not found" });
		}

		const message = await db.message.create({
			data: {
				fileUrl,
				content,
				channelId: channelId as string,
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
    const channelKey = `chat:${channelId}:messages`;

    //^ The message is sent to the client using the io.emit() method.
    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message)

	} catch (error) {
		console.log(
			"❌❌❌error from pages/api/socket/messages.ts => POST ",
			error
		);
		return res.status(500).json({ error: "Internal server error" });
	}
}
