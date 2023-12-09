"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import { ShieldAlert, ShieldCheck, User } from "lucide-react";

const roleIconMap = {
  "GUEST": <User className="w-4 h-4 ml-2 text-slate-800 " />,
  "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />
}


export const MembersModal = () => {

  const { isOpen, onClose, onOpen, type, data } = useModal();

  const isModelOpen = isOpen && type === "members";

  const { server } = data as { server: ServerWithMembersWithProfiles };




  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden ">
        <DialogHeader className="pt-6 px-6 pb-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea
          className="mt-8 max-h-[420px] pr-6"
        >
          {
            server?.members?.map((member) => (
              <div className="flex items-center gap-x-2 mb-6"
                key={member.id}
              >
                <UserAvatar src={member.profile.imageUrl} />
                <div className="flex flex-col gap-y-2">
                  <div className="text-xs font-semibold flex items-center gap-x-1">
                    {member.profile.name}
                    {roleIconMap[member.role]}
                  </div>
                  <p className=" text-xs text-zinc-500">
                    {member.profile.email}
                  </p>
                </div>
              </div>
            ))
          }
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}