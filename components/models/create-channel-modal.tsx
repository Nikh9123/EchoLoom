"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import qs from "query-string" ;
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Form,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
  FormItem
} from "@/components/ui/form"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { ChannelType } from "@prisma/client";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Channel name is required."
  }).refine(
    name => name !== "general",
    {
      message: "Channel name cannot be 'general'"
    }
  ),
  type: z.nativeEnum(ChannelType)
});

export const CreateChannelModal = () => {

  const router = useRouter();
  const params = useParams() ;

  const { isOpen, onClose, data, type } = useModal();

  const isModelOpen = isOpen && type === "createChannel";
  
  const {channelType} = data ;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: channelType || ChannelType.TEXT,
    }
  });

  useEffect(() => {
    if(channelType){
      form.setValue("type", channelType);
    }
    else{
      form.setValue("type", ChannelType.TEXT);
    }
  },[channelType, form])

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url : "/api/channels",
        query: {
          serverId : params?.serverId 
        }
      })
      await axios.post(url, values);

      form.reset(); //this will reset the form and the default values
      router.refresh();
      
      onClose();
    } catch (error) {
      console.log(error)
    }
  }
  const handleClose = () => {
    onClose();
    form.reset();
  }
  return (
    <Dialog open={isModelOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden ">
        <DialogHeader className="pt-6 px-6 pb-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create your Channel!
          </DialogTitle>
        
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <div className="space-y-8 px-6">

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-600 dark:text-secondary/70">
                      Channel name
                    </FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} className="bg-zinc-300/50 border-0 focus-visible:ring-0
                     text-black focus-visible:ring-offset-0" placeholder="Enter channel name"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel Type</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className="bg-zinc-300/50 border-0 
                          focus:ring-0 text-black 
                          ring-offset-0 focus:ring-offset-0 
                          capitalize outline-none"
                        >
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant={"primary"}
              >
                Create
              </Button>

            </DialogFooter>
          </form>
        </Form>

      </DialogContent>
    </Dialog>
  )
}
//5:18