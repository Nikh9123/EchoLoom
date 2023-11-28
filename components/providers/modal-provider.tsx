"use client";

import { CreateServerModel } from "@/components/models/create-server-modal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { //
    setIsMounted(true);
  }, []);

  //this is to prevent the modal from rendering on the server
  if(!isMounted) return null;

  return (
    <>
      <CreateServerModel />
    </>
  )
}