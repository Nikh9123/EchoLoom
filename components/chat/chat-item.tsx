"use client";

import { Member, Message, Profile } from "@prisma/client";
import { UserAvatar } from "@/components/user-avatar";
import { ActionToolTip } from "@/components/action-tooltip";
import { ShieldAlert, ShieldCheck, User } from "lucide-react";

interface ChatItemProps {
  id: string
  content: string
  member: Member & {
    profile: Profile
  }
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: Boolean;
  socketUrl: string;
  socketQuery: Record<string, string>
}

const roleIconMap = {
  "GUEST" : <User className="h-4 w-4 ml-2 text-zinc-500 "/>,
  "MODERATOR" : <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500 "/>,
  "ADMIN" : <ShieldAlert className="h-4 w-4 ml-2 text-rose-500 "/>,
}

export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  deleted,
  currentMember,
  isUpdated,
  socketQuery,
  socketUrl,
  fileUrl
}: ChatItemProps) => {
  return (
    <div className="relative group flex item-center hover:bg-black/5
    p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full ">
        <div
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="font-semibold text-sm hover:underline cursor-pointer">
                {member.profile.name}
              </p>
              <ActionToolTip label={member.role}>
               {roleIconMap[member.role]}
              </ActionToolTip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {content}
        </div>
      </div>
    </div>
  )
}