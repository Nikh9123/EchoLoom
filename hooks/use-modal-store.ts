import { ChannelType, Server, Channel } from "@prisma/client";
import { create } from "zustand";

export type ModelType =
	| "createServer"
	| "invite"
	| "editServer"
	| "members"
	| "createChannel"
	| "leaveServer"
	| "deleteServer"
	| "editChannel"
	| "deleteChannel";

interface ModalData {
	server?: Server;
	channel? : Channel
	channelType? : ChannelType ;
}

interface ModelStore {
	type: ModelType | null;
	data: ModalData;
	isOpen: boolean;
	onOpen: (type: ModelType, data?: ModalData) => void;
	onClose: () => void;
}

//this is a custom hook that will be used to open and close the modal
export const useModal = create<ModelStore>((set) => ({
	type: null,
	data: {},
	isOpen: false,
	onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
	onClose: () => set({ isOpen: false, type: null }),
}));
