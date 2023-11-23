import { PrismaClient } from "@prisma/client";

declare global {
	var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();//so what it does is that it creates a new prisma client if it doesn't exist and if it does exist it uses the existing one
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;//this is so that we can use the prisma client in development mode

