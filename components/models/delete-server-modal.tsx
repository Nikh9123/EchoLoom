"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";


export const DeleteServerModal = () => {

  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter()

  const isModelOpen = isOpen && type === "deleteServer";

  const server = data?.server;

  const [isLoading, setIsLoading] = useState(false);

  const deleteServer = async () => {
    try {
      setIsLoading(true)
      const response = await axios.delete(`/api/servers/${server?.id}`);
      
      onClose();
      router.refresh();
      router.push(`/servers/${server?.id}`);
    }
    catch (error) {
      console.log("❌❌ error from delete-server-modal : ", error)
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden ">
        <DialogHeader className="pt-6 px-6 pb-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 text-xl font-semibold">
            Are you sure you want to Delete <br />
            <span className="font-semibold text-indigo-500"> {server?.name} ❓</span> <br />
            <span className=" text-lg font-semibold" >Your all chats will be deleted permanently ⚠️</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isLoading}
              onClick={() => onClose()}
              variant="ghost"
            >
              Cancel
            </Button>

            <Button
              disabled={isLoading}
              variant="primary"
              onClick={deleteServer}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}