"use client"

import { Member, Profile } from "@prisma/client";
import { UserAvatar } from "../user-avatar";
import { ActionToolTip } from "../action-tooltip";
import { ShieldAlert, ShieldCheck } from "lucide-react";

interface ChatItemProps{
    id: string,
    content: string;
    member: Member &{
        profile: Profile
    };
    timestamp: string;
    currentMember: Member;
    socketUrl: string;
    socketQuery: Record<string, string>;
}

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-indigo-500"/>
}

export const ChatItem = ({
    id,
    content,
    member,
    timestamp,
    currentMember,
    socketUrl,
    socketQuery
}: ChatItemProps) =>
{
    return(
        <div
        className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
            <div className="group flex gap-x-2 items-start w-full">
                <div className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar src={member.profile.imageUrl}/>
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p className="font-semibold text-sm hover:underline cursor-pointer">
                                {member.profile.name}
                            </p>
                            <ActionToolTip label={member.role}>
                                     {roleIconMap[member.role]}
                                </ActionToolTip>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {timestamp}
                        </span>
                    </div>
                    {content}
                </div>

            </div>
            
        </div>
    )
}