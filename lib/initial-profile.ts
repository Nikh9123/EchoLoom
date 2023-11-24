import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const initialProfile = async () => {
	const user = await currentUser();

	//1. if not user then redirect to sign in
	if (!user) {
		return redirectToSignIn();
	}

	//2. find user from db
	const profile = await db.profile.findUnique({
		where: {
			userId: user.id,
		},
	});

	if (profile) {
		return profile;
	}

	
	const newProfile = await db.profile.create({
		data: {
			userId: user.id,
			name: `${user.firstName} ${user.lastName}`,
			imageUrl: user.imageUrl,
			email: user.emailAddresses[0].emailAddress,
		},
	});

  return newProfile ;
};
