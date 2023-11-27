"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionToolTip } from "@/components/action-tooltip";
import { Router } from "next/router";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

export const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();
  console.log("params", params, "router", router);

  const onClick = () => {
    router.push(`/servers/${id}`);
    console.log("clicked");
  }

  return (
    <ActionToolTip
      label={name}
      side="right"
      align="center"
    >
      <button
        onClick={onClick}
        className="group relative flex items-center"
      >
        
        <div className={
          cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId !== id && " group-hover:h-[20px]",
            params?.serverId === id ? "h-[36px]" : "h-[8px]",
          )
        } />
        <div className={cn(
          "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center ",
          params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]",
        )}>
          <Image
            alt="channel"
            src={imageUrl}
            fill
          />
        </div>
      </button>
    </ActionToolTip>

  )
}