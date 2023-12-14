"use client";
import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';


import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';


interface ServerSearchProps {
  //data is an array which have objects as an element
  data: {
    label: string;
    type: "channel" | "member",
    data: {
      id: string;
      icon: React.ReactNode;
      name: string;
    }[] | undefined
  }[],

}

const ServerSearch = ({
  data
}: ServerSearchProps
) => {

  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  //add a keyboard shortcut to open the command dialog which is cmd + k
  useEffect(() => {

    //this function will run when the component will mount
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open)
      }
    }

    //it will add the event listener when the component will mount
    document.addEventListener("keydown", down);

    //it will remove the event listener when the component will unmount
    return () => document.removeEventListener("keydown", down);
  }, []);

  const onClick = ({ id, type }: { id: string, type: "channel" | "member" }) => {
    setOpen(false);
    if (type === "member") {

      //redirect to the conversation
      router.push(`/servers/${params?.serverId}/conversations/${id}`);
    }
    if (type === "channel") {

      //redirect to the channel
      router.push(`/servers/${params?.serverId}/channels/${id}`);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className='group px-2 py-2 rounded-md flex 
  items-center w-full gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50
  transition'
      >
        <Search className='w-4 h-4 text-zinc-500 dark:text-zinc-400 transition' />
        <p
          className='text-sm font-semibold text-zinc-500 dark:text-zinc-400 group:hover:text-zinc-600 
    dark:group:hover:text-zinc-300 transition '
        >
          search
        </p>
        <kbd
          className='
    pointers-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted
    px-1.5 font-mono text-[10px] font-medium text-muted-forground ml-auto
    '
        >
          <span className="text-xs">⌘ + K</span>
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Search all channels and members...' />
        <CommandList>
          <CommandEmpty>
            No Results Found !
          </CommandEmpty>
          {
            data.map(({ label, type, data }) => {

              if (!data?.length) {
                return null;
              }

              return (
                <CommandGroup key={label} heading={label} >
                  {data?.map(({ id, icon, name }) => {
                    return (
                      <CommandItem key={id} onSelect={() => onClick({ id, type })}>
                        {icon}
                        <span>{name}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )

            })
          }
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default ServerSearch