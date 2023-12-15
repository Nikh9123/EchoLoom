"use client";

import { CreateServerModel } from "@/components/models/create-server-modal";
import { useEffect, useState } from "react";
import { InviteModal } from "@/components/models/invite-modal";
import { EditServerModel } from "@/components/models/edit-server-modal";
import { MembersModal } from "@/components/models/members-modal";
import { CreateChannelModal } from "@/components/models/create-channel-modal";
import { LeaveServerModal } from "@/components/models/leave-server-modal";
import { DeleteServerModal } from "@/components/models/delete-server-modal";
import { DeleteChannelModal } from "@/components/models/delete-channel-modal";
import { EditChannelModal } from "@/components/models/edit-channel-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { //
    setIsMounted(true);
  }, []);

  //this is to prevent the modal from rendering on the server
  if (!isMounted) return null;

  return (
    <>
      <CreateServerModel />
      <InviteModal />
      <EditServerModel/>
      <MembersModal/>
      <CreateChannelModal/>
      <LeaveServerModal/>
      <DeleteServerModal/>
      <DeleteChannelModal />
      <EditChannelModal />
    </>
  )
}