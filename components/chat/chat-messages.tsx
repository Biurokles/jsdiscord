"use client"

import { Member, Message, Profile } from "@prisma/client";
import { ChatWelcome } from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { group } from "console";
import { Fragment } from "react";
import { ChatItem } from "./chat-item";
import {format} from "date-fns";
const DATE_FORMAT = 'd MMM yyyy, HH:mm'
type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

interface ChatMessagesProps {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    sokcetQuery: Record<string, string>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation"
}

export const ChatMessages = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    sokcetQuery,
    paramKey,
    paramValue,
    type
}: ChatMessagesProps) =>{

    const queryKey = `chat:${chatId}`;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        status
    }  = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue
    });
    if(isLoading==true)
    {
        <div className="flex flex-col flex-1 justify-center items-center">
            <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4"/>
            <p className="text-xs text-zinc-500 dark:text-zinc-400"> 
                Loading messages...
            </p>
        </div>
    }
    else if(status == "error")
    {
        <div className="flex flex-col flex-1 justify-center items-center">
            <ServerCrash className="h-7 w-7 text-zinc-500 my-4"/>
            <p className="text-xs text-zinc-500 dark:text-zinc-400"> 
                Something went wrong
            </p>
        </div>
    }
    
    return(
        <div className="flex-1 flex flex-col py-4 overflow-y-auto">
             <div className="flex-1"/>
             <ChatWelcome
             type={type}
             name={name}
             />

             <div className="flex flex-col-reverse mt-auto ">
                {data?.pages?.map((group, i)=>(
                    <Fragment key={i}>
                        {group.items.map((message: MessageWithMemberWithProfile)=>(
                            <ChatItem
                            currentMember={member}
                            member={message.member}
                            key={message.id}
                            id={message.id}
                            content={message.content}
                            timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                            socketUrl={socketUrl}
                            socketQuery={sokcetQuery} />
                        ))}
                        </Fragment>
                ))}

             </div>
        </div>
    )
}