"use client";
import axios from "axios";
import qs from "query-string";
import {useRouter } from "next/navigation";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"


import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";


export const DeleteChannelModal = () => {

  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModelOpen = isOpen && type === "deleteChannel";

  const {server, channel} = data ;
  const [isLoading, setIsLoading] = useState(false);
  
  const deleteChannel = async () => {
    try {
      setIsLoading(true)

      const url = qs.stringifyUrl({
        url : `/api/channels/${channel?.id}`,
        query:{
          serverId : server?.id 
        }
      })

      const response = await axios.delete(url);
      
      onClose();
      router.refresh();
      router.push(`/servers/${server?.id}`);
    }
    catch (error) {
      console.log("❌❌ error from delete-channel-modal : ", error)
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
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 text-xl font-semibold">
            Are you sure you want to Delete <br />
            <span className="font-semibold text-indigo-500">#{channel?.name} ❓</span> <br />
            <span className=" text-lg font-semibold" >This channel chats will be deleted permanently ⚠️</span>
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
              onClick={deleteChannel}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

