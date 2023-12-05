"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CheckCheckIcon, Copy, RefreshCw, Share, Share2 } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";


export const InviteModal = () => {

  const { isOpen, onClose, onOpen, type, data } = useModal();
  const origin = useOrigin();

  const isModelOpen = isOpen && type === "invite";

  const server = data?.server;

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }

  const onNew = async () => {
    try {
      setIsLoading(true);

      const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);

      onOpen("invite", { server: response.data })

    } catch (err) {
      console.log(err);
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
            want to invite your friends to your server?
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-600">
            invite your friends to your server and start chatting with them
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase font-bold text-lg text-zinc-500
          dark:text-secondary/70
          ">Invite Link</Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input className=" bg-zinc-300/50 border-0 focus-visible:ring-slate-600
             text-black focus-visible:ring-offset-0"
              value={inviteUrl}
              disabled={isLoading}
            />
            <Button size="icon"
              onClick={onCopy}
              disabled={isLoading}
            >
              {copied ? <CheckCheckIcon className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <Button className=" text-sm mt-4 text-zinc-600 "
            variant="link"
            size={"sm"}
            disabled={isLoading}
            onClick={onNew}
          >
            Generate new link
            <RefreshCw className="w-4 h-4 text-zinc-600 ml-2" 
            onClick={onNew}
            />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}