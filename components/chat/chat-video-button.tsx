
"use client";
import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { VideoOff, Video } from "lucide-react";

import { ActionToolTip } from "../action-tooltip";

export const ChatVideoButton = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isVideo = searchParams?.get("video");

  const onClick = () => {
    
    const url = qs.stringifyUrl({
      url: pathname || "",
      query: {
        video: isVideo ? undefined : true,
      }
    }, { skipNull: true });

    router.push(url); // Redirect to the new URL
  };

  const Icon = isVideo ? VideoOff : Video;
  const tooltiplabel = isVideo ? "End video call" : "Start video call";

  return (
    <ActionToolTip side="bottom" label={tooltiplabel}>
      <button onClick={onClick} className="hover:opacity-75 transition mr-4">
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionToolTip>
  );
};
