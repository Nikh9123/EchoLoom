import { Hash } from "lucide-react";
import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;

}

// ChatHeader component
export const ChatHeader = ({
  serverId, name, type, imageUrl
}: ChatHeaderProps) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {
        type === "conversation" && (
          <UserAvatar 
          src={imageUrl}
          className="mr-2 h-4 w-4 md:h-6 md:w-6"
          />
        )
      }
      <p className="font-semibold text-md text-black dark:text-white">
        {name}
      </p>
    </div>
  )
}