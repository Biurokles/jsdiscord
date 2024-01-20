import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { channel } from "diagnostics_channel";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";

interface ServerSidebarProps{
    serverId: string
}

export const ServerSidebar = async ({
    serverId
    }:ServerSidebarProps)=>
    {
        const profile = await currentProfile();
        if(!profile)
        {
            return redirect("/");
        }
        const server = await db.server.findUnique({
            where:{
                id: serverId,
            },
            include:{
                channels:{
                    orderBy:{
                        createdAt:"asc",
                    },
                },
                members:{
                    include:{
                        profile:true,
                    },
                    orderBy:{
                        role:"asc",
                    }
                }
            }
        });
    const members = server?.members.filter((member)=>member.profileId!=profile.id);
    if(!server){
        return redirect('/');
    }

    const role = server.members.find((member)=>member.profileId===profile.id)?.role;


    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <ServerHeader
        server={server}
        role={role}></ServerHeader>
        <ScrollArea>
            {!!server.channels?.length &&(
                <div className="mb-2">
                    <ServerSection
                    sectionType="channels"
                    role={role}
                    />
                    {server.channels.map((channel)=>(
                        <ServerChannel
                        key={channel.id}
                        channel={channel}
                        server={server}
                        role={role}/>
                    ))}
                </div>
            )}
                {!!members?.length &&(
                <div className="mb-2">
                    <ServerSection
                    sectionType="members"
                    role={role}
                    />
                    {members.map((member)=>(
                        <ServerMember
                         member={member}
                         server={server}
                        key={member.id} />
                    ))}
                </div>
            )}

        </ScrollArea>
        </div>
    )
    
}