//write what to do stepwise

//1. TODO: To check whether the user is already in the conversation with some member or not
//2. TODO: If not, then create a new conversation

import { db } from "@/lib/db";

export const getOrCreateConversation = async (
	memberOneId: string,
	memberTwoId: string
) => {
	let conversation =
		(await findConversation(memberOneId, memberTwoId)) ||
		(await findConversation(memberTwoId, memberOneId));

	if (!conversation) {
		conversation = await createNewConversation(memberOneId, memberTwoId);
	}

	return conversation;
};

//1. create findConversation function
const findConversation = async (memberOneId: string, memberTwoId: string) => {
	try {
		
		return await db.conversation.findFirst({
			where: {
				AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
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
	} catch (error) {
		console.log(
			"❌❌❌ error from lib/conversation.ts => findConversation",
			error
		);
		return null;
	}
};

//2. create createNewConversation function
const createNewConversation = async (
	memberOneId: string,
	memberTwoId: string
) => {
	try {
		return await db.conversation.create({
			data: {
				memberOneId: memberOneId,
				memberTwoId: memberTwoId,
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
	} catch (error) {
		console.log(
			"❌❌❌ error from lib/conversation.ts => createNewConversation",
			error
		);
		return null;
	}
};
