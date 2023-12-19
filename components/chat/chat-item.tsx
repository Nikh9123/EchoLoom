"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member, MemberRole, Message, Profile } from "@prisma/client";
import { Delete, Edit, File, ShieldAlert, ShieldCheck, Trash2, User } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { ActionToolTip } from "@/components/action-tooltip";
import { set } from "date-fns";
import { useModal } from "@/hooks/use-modal-store";

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

//create form schema
const formSchema = z.object({
  //the content of the message where z.string is the type of the content
  content: z.string().min(1),
})

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
  const { onClose, onOpen } = useModal();
  //create form
  const form = useForm<z.infer<typeof formSchema>>({

    //we are passing formSchema to zodResolver because we want to validate the form
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content
    }
  })
  // const [isLoading , setIsLoading] = useState(false);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery
      });

      const response = await axios.patch(url, values);
      form.reset();
      setIsEditing(false);
    } catch (error) {
      //log the error with  file name 
      console.log("❌❌❌ error in components/chat/chat-item.tsx", error);
    }

  }

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === "Escape" || e.keyCode === 27) {
        setIsEditing(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    form.reset({
      content: content

    })
  }, [content, form])

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
          {
            !fileUrl && isEditing && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                  className="flex gap-x-2 w-full items-center pt-2"
                >
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className=" relative w-full">
                            <Input
                              placeholder="Edited a message"
                              className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0
                              focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                              {...field}
                              disabled={isLoading}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    size={"sm"}
                    variant={"primary"}
                    disabled={isLoading}
                  >
                    Save
                  </Button>
                </form>
                <span className="text-[10px] mt-1 text-zinc-400">
                  Press esc to cancel, enter to save
                </span>
              </Form>
            )
          }
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2
        absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border 
        rounded-sm">
          {canEditMessage && (
            <ActionToolTip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer transition hover:text-zinc-600 ml-auto w-4 h-4 text-xs text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300 "
              />
            </ActionToolTip>
          )}
          {/* add a thin line between both edit and edit icon*/}
          {
            !isImage && !isPDF && canEditMessage && canDeleteMessage && (
              <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-700"></div>
            )
          }
          {canDeleteMessage && (
            <ActionToolTip label="Delete">
              <Trash2
                onClick={() => onOpen("deleteMessage", { apiUrl: `${socketUrl}/${id}`, query: socketQuery })}
                className="cursor-pointer transition hover:text-zinc-600 ml-auto w-4 h-4 text-xs text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300 "
              />
            </ActionToolTip>
          )}
        </div>
      )}
    </div>
  )
}