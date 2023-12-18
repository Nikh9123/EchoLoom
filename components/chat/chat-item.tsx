"use client";

import { Member, MemberRole, Message, Profile } from "@prisma/client";
import { UserAvatar } from "@/components/user-avatar";
import { ActionToolTip } from "@/components/action-tooltip";
import { Edit, File, ShieldAlert, ShieldCheck, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
  "GUEST": <User className="h-4 w-4 ml-2 text-zinc-500 " />,
  "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500 " />,
  "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500 " />,
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

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, SetIsDeleting] = useState(false);

  const fileType = fileUrl?.split('.').pop();


  //working on rendering pdf and images in chats 
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;



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
          {isImage && (
            <a href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md overflow-hidden
            border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill className="object-cover"
              />
            </a>
          )}
          {isPDF && (
            <div
              className="overflow-hidden rounded-md
            border flex items-center bg-secondary h-40 w-48"
            >
              <File
                className='h-20 w-20 fill-indigo-200 stroke-indigo-400'
              />
              <a
                href={isPDF}
                target='_blank'
                rel='noreferrer noopener'
                className='text-indigo-400 dark:text-indigo-200 hover:text-indigo-500 hover:underline'
              >
                PDF FILE
              </a>

            </div>
          )}
          {
            !fileUrl && !isEditing && (
              <p className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}>
                {content}
                {
                  isUpdated && !deleted && (
                    <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400 ">
                      (edited)
                    </span>
                  )}
              </p>
            )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2
        absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border 
        rounded-sm">
          {
            canEditMessage && (
              <ActionToolTip label="Edit">
                <Edit
                  className="cursor-pointer transition hover:text-zinc-600 ml-auto w-4 h-4 text-xs text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300 "
                />
              </ActionToolTip>
            )
          }
        </div>
      )}
    </div>
  )
}