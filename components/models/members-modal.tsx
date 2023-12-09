"use client";
import { useState } from "react";
import { MemberRole } from "@prisma/client";
import qs from "query-string"
import axios from "axios";
import { useRouter } from "next/navigation";

import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  User
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"

import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";


const roleIconMap = {
  "GUEST": <User className="w-4 h-4 ml-2 text-slate-800 " />,
  "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />
}


export const MembersModal = () => {

  const router = useRouter();

  const { isOpen, onClose, onOpen, type, data } = useModal();

  const [loadingId, setLoadingId] = useState("");

  const isModelOpen = isOpen && type === "members";

  const { server } = data as { server: ServerWithMembersWithProfiles };

  //* kick function kick the user from databse
  const onKick = async (memberId: string) => {

    try {
      setLoadingId(memberId);

      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id
        }
      })

      const response = await axios.delete(url);

      router.refresh();
      onOpen("members", { server: response.data });
    }
    catch (err) {
      console.log("🚫 error from components/modal/member-modal.tsx", err);
    }
    finally {
      setLoadingId("");
    }
  }

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);

      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        }
      });

      const response = await axios.patch(url, { role })
      router.refresh()
      onOpen("members", { server: response.data })

    } catch (error) {
      console.log("error from components/models/members-modal.tsx", error)
    } finally {
      setLoadingId("")
    }
  }


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
                {/* {the dropdwon is only for moderator and guests not for admin that why we chcm=king thi} */}
                {server.profileId !== member.profileId
                  && loadingId !== member.id &&
                  (
                    <div className="ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="h-4 v-4 text-zinc-500 "

                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="left">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger
                              className="flex items-center"
                            >
                              <ShieldQuestion className="h-4 w-4 mr-2 " />
                              <span>Role</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  onClick={() => onRoleChange(member.id, "GUEST")}>
                                  <User className="h-4 w-4 mr-2" />
                                  GUEST
                                  {
                                    member.role === 'GUEST' && (
                                      <Check
                                        className="h-4 w-4 ml-auto"
                                      />
                                    )
                                  }
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onRoleChange(member.id, "MODERATOR")}
                                >
                                  <ShieldCheck className="h-4 w-4 mr-2" />
                                  MODERATOR
                                  {
                                    member.role === 'MODERATOR' && (
                                      <Check
                                        className="h-4 w-4 ml-auto"
                                      />
                                    )
                                  }
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onKick(member.id)}
                          >
                            <Gavel className="w-4 h-4 mr-2" />
                            KICK
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )
                }
                {
                  loadingId === member.id && (
                    <Loader2 className="animate-spin h-4 w-4 text-zinc-500 ml-auto " />
                  )
                }
              </div>
            ))
          }
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}