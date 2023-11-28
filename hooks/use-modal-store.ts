import { create } from "zustand";

export type ModelType = "createServer";

interface ModelStore {
	type: ModelType | null;
	isOpen: boolean;
	onOpen: (type: ModelType) => void;
	onClose: () => void;
}

//this is a custom hook that will be used to open and close the modal
export const useModal = create<ModelStore>((set) => ({
	type: null,
	isOpen: false,
	onOpen: (type) => set({ isOpen: true, type }),
	onClose: () => set({ isOpen: false, type: null }),
}));
