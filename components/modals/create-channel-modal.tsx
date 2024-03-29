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
import { useParams, useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';
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
export const CreateChannelModal = () =>{
    const {isOpen, onClose, type} = useModal();
    const router = useRouter();
    const params = useParams();
    const isModalOpen = isOpen && type === "createChannel";

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues:{
            name: "",
        }
    });

    const isLodaing = form.formState.isSubmitting;
    const onSubmit = async( values: z.infer<typeof formSchema>) =>{
        try{
            const url = qs.stringifyUrl({
                url: "/api/channels",
                query:{
                    serverId: params?.serverId
                }
            });
            await axios.post(url,values)

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
                        Create Channel
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
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}