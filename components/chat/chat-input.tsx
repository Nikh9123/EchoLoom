"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Plus, Smile } from "lucide-react";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "channel" | "conversation";
}


const formSchema = z.object({
  content: z.string().min(1),
});


const ChatInput = ({
  apiUrl,
  type,
  name,
  query
}: ChatInputProps) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver : zodResolver(formSchema),
    defaultValues:{
      content: "",
    }
  })

  const isLoading = form.formState.isSubmitting ;

  const onSubmit = async (values : z.infer<typeof formSchema>) => {
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
        control={form.control}
        name="content"
        render={ ({field}) => (
          <FormItem>
            <FormControl>
              <div className="relative p-4 pb-6 ">
                <button
                type="button"
                onClick={()=>{}}
                className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full
                p-1 flex items-center justify-center"
                >
                  <Plus className="text-white dark:text-[#313338]"/>

                </button>
                <Input 
                disabled={isLoading}
                className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0
                focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                />

                <div className="absolute top-7 right-8"> 
                <Smile />
                </div>

              </div>
            </FormControl>
            </FormItem >
        )}
        >

        </FormField>
      </form>
    </Form>
  )
}

export default ChatInput; 