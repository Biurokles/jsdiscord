"use client";
import qs from "query-string";
import axios from 'axios';
import {Dialog,DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useForm } from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';
import { useEffect } from "react";
const formSchema = z.object({
    name: z.string().min(1,{
        message: "Channel name is required."
    }).refine(
        name=>name!=='general',
        {
            message:"Channel name cannot be 'general'"
        }
    )

});
export const EditChannelModal = () =>{
    const {isOpen, onClose, type, data} = useModal();
    const router = useRouter();
    const isModalOpen = isOpen && type === "editChannel";
    const {channel, server} = data;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues:{
            name: "",
        }
    });

    useEffect(()=>{
        if(channel)
        {
            form.setValue("name", channel.name);
        }
    },[form, channel])

    const isLodaing = form.formState.isSubmitting;
    const onSubmit = async( values: z.infer<typeof formSchema>) =>{
        try{
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query:{
                    serverId: server?.id
                }
            });
            await axios.patch(url,values)

            form.reset();
            router.refresh();
            onClose();  
        }
        catch(error){
            console.log(error)

        }
    }

    const handelClose = () =>{
        form.reset();
        onClose();
    }
    return(
        <Dialog open={isModalOpen} onOpenChange={handelClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Edit Channel
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField
                            control={form.control}
                            name="name"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel className="uppercase text-cs font-bold text-zinc-500
                                    dark:text-secondary/70">
                                    Channel name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                        disabled={isLodaing}
                                        className="bg-zinc-300/50 border-0
                                        focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                        placeholder="Enter channel name"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                           )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant={"primary"} disabled={isLodaing}>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}