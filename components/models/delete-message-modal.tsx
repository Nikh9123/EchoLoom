"use client";
import axios from "axios";
import qs from "query-string";
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


export const DeleteMessageModal = () => {

  const { isOpen, onClose, type, data } = useModal();

  const isModelOpen = isOpen && type === "deleteMessage";

  const {apiUrl, query} = data ;
  const [isLoading, setIsLoading] = useState(false);
  
  const deleteChannel = async () => {
    try {
      setIsLoading(true)

      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });

      const response = await axios.delete(url);
      
      onClose();
      
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
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 text-xl font-semibold">
            Are you sure you want to Delete ❓<br />
            The message will be deleted permanently ⚠️
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

