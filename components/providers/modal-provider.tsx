"use client"

import { CreateServerModal } from "@/components/modals/create-server-modal";
import { useState, useEffect } from "react";
import { InviteModal } from "../modals/invite-modal";
import { EditServerModal } from "../modals/edit-server-modal copy";
import { MembersModal } from "../modals/members-modal";
import { CreateChannelModal } from "../modals/create-channel-modal";

export const ModalProvider = () =>{
    const [isMounted, setisMounted] = useState(false);
    useEffect(()=>{
        setisMounted(true);
    }, []);
    if(!isMounted)
    {
        return null;
    }
    return(
        <>
            <CreateServerModal/>
            <InviteModal/>
            <EditServerModal/>
            <MembersModal/>
            <CreateChannelModal/>
        </>
    )
}