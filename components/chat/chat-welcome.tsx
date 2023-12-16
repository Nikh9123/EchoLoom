import { Hash } from 'lucide-react';
import React from 'react'

interface ChatWelComeProps {
  type: "channel" | "conversation";
  name: string;
}

// const ChatWelCome = ({
//   type,
//   name
// }: ChatWelComeProps
// ) => {
//   return (
//     <div>
//       <div className='flex flex-col items-center justify-center'>
//           <div className='text-xl font-bold text-zinc-600 dark:text-zinc-300'>
//             {type === "channel" ? name : "#" + name}
//           </div>
//           <div className='text-sm text-zinc-500 dark:text-zinc-400'>
//             This is the beginning of your {type === "channel" ? "channel" : "conversation"}.
//           </div>
//       </div>
//     </div>
//   )
// }

const ChatWelCome = ({
  type,
  name
}: ChatWelComeProps
) => {
  return (
    <div className='space-y-2 px-4 mb-4'>
      {type === "channel" && (
        <div
          className='h-[75px] w-[75px] rounded-none bg-zinc-500 dark:bg-zinc-700
          flex items-center justify-center '
        >
          <Hash className='h-20 w-20 text-white bg-transparent' />
          {/*the text will be right side of # */}

        </div>
      )}
      <p
        className='text-xl md:text-2xl font-bold text-white'
      >
        {type === "channel" ? "Welcome to #" : ""}{name}
      </p>
      <p
        className='text-zinc-600 dark:text-zinc-400 text-sm'
      >
        {type === "channel" ? `This is the beginning of your #${name} channel.` : `This is the beginning of your conversation with ${name}.`}
      </p>
    </div>
  )
}
export default ChatWelCome