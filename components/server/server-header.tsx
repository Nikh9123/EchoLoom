"use client"

import React from 'react'
import {MemberRole, Server} from '@prisma/client' ;

import { ServerWithMembersWithProfiles } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button';
import { 
  ChevronDown, 
  LogOut, 
  PlusCircle, 
  Settings, 
  Trash, 
  UserPlus, 
  Users 
} from 'lucide-react';
 
interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role? : MemberRole
}

const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  
  const isAdmin = role === MemberRole.ADMIN ;
  const isModerator = isAdmin || MemberRole.MODERATOR ;
  //* A Admin is bydefault a moderator
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='focus:outline-none' asChild>
        <button
        className='w-full font-semibold text-md px-3
        flex items-center h-12 border-neutral-200
        dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10
        dark:hover:bg-zinc-700/50 transition'
        >
          {server.name}
          <ChevronDown className='h-5 w-5 ml-auto'/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 text-xs font-medium
       text-black dark:text-neutral-400 space-y-[2px]
       '>
        {isModerator && (
          <DropdownMenuItem 
          className='text-indigo-600 dark:text-indigo-400
          px-3 py-3 cursor-pointer'
          >
            Invite People
            <UserPlus className="h-4 w-4 ml-auto "/>
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem 
          className='px-3 py-3 cursor-pointer'
          >
            Server Settings
            <Settings className="h-4 w-4 ml-auto "/>
          </DropdownMenuItem>
        )}
        
        {isAdmin && (
          <DropdownMenuItem 
          className='px-3 py-3 cursor-pointer'
          >
            Manage Members
            <Users className="h-4 w-4 ml-auto "/>
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem 
          className='px-3 py-3 cursor-pointer'
          >
            Create Channels
            <PlusCircle className="h-4 w-4 ml-auto "/>
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuSeparator/>

        )}
        {isAdmin && (
          <DropdownMenuItem 
          className='text-rose-700 px-3 py-3 cursor-pointer'
          >
            Delete Server
            <Trash className=" h-4 w-4 ml-auto "/>
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem 
          className='text-rose-700 px-3 py-3 cursor-pointer'
          >
            Leave Server
            <LogOut className=" h-4 w-4 ml-auto "/>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ServerHeader