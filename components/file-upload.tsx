"use client";

import { X } from 'lucide-react';
import Image from 'next/image';
import { UploadDropzone } from '@/lib/uploadthing';
import "@uploadthing/react/styles.css"
import React from 'react'

type Props = {}

interface FileUploadProps {
  onChange: (url?: string) => void;
  value?: string;
  endpoint: "messageFile" | "serverImage"; //endpoint for uploadthing
}

const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  console.log(" value : ", value)
  const fileType = value?.split(".").pop();

  if (value && fileType !== 'pdf') {
    return (
      <div className='relative h-40 w-40 '>

        <Image src={value} alt='server image' fill className='rounded-full' />

        <button onClick={() => onChange("")} className='bg-rose-500 text-white p-1 
        rounded-full absolute  top-0 right-0 shadow-sm ' type='button'>
          <X size={24} className='h-4 w-4' />
        </button>

      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url)
      }}
      onUploadError={(err) => { console.log(err) }}
    />
  )
}

export default FileUpload