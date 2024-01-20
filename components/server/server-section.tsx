"use client"

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import { ActionToolTip } from "../action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";


 interface ServerSectionProps{
    role?: MemberRole;
    sectionType: "channels" | "members";
    server?: ServerWithMembersWithProfiles;
 }
export const ServerSection = ({
    role,
    sectionType,
    server,
}: ServerSectionProps) =>{
    const {onOpen} = useModal();

    return(
        <div className="flex items-center justify-between py-2">
               {sectionType==="members"&&(      
               <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400"> Members</p> 
               )}
                {sectionType==="channels"&&(      
               <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400"> Channels</p> 
               )}
               
               {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionToolTip label="Create Channel" side="top">
          <button
            onClick={() => onOpen("createChannel")}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionToolTip>
      )}

            
        </div>
    )
}