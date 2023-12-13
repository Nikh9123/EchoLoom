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


export const LeaveServerModal = () => {

  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter()

  const isModelOpen = isOpen && type === "leaveServer";

  const server = data?.server;

  const [isLoading, setIsLoading] = useState(false);

  const leaveServer = async () => {
    try {
      const response = await axios.patch(`/api/servers/${server?.id}/leave`);

      onClose();
      router.refresh();
      router.push("/");

    }
    catch (error) {
      console.log("❌❌ error from leave-server-modal : ", error)
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
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 text-xl font-semibold">
            Are you sure you want to leave
            <span className="font-semibold text-indigo-500"> {server?.name} ❓</span>
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
              onClick={leaveServer}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}