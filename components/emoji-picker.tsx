"use client";

import { Smile } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from 'next-themes';

import {
  Popover, PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import React from 'react'


interface EmojiPickerProps {
  onChange: (value: string) => void;
}

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const {resolvedTheme} = useTheme();
  return (
      <Popover>
        <PopoverTrigger asChild>
          <Smile className='text-zinc-500 dark:text-zinc-400 hover:text-zinc-600
          dark:hover:text-zinc-300 transition cursor-pointer'/>
        </PopoverTrigger>
        <PopoverContent
          side='right'
          sideOffset={40}
          className="bg-transparent border-none shadow-none drop-shadow-none mb-16">
          <Picker
            theme={resolvedTheme}
            data={data}
            onEmojiSelect={(emoji: any) => onChange(emoji.native)}
          />
        </PopoverContent>
      </Popover>
  )
}

/**
 * 
 * emoji.native: This is a property of the emoji object that likely contains the Unicode representation of the emoji in its native format.
 */
export default EmojiPicker