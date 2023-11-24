"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

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

const formSchema = z.object({
  name: z.string().min(1, {
    message: "server name is required"
  }),
  imageUrl: z.string().min(1, {
    message: "server image is required"
  }),

})

export const InitialModel = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
  }

  return (
    <Dialog open={true} >
      <DialogContent className="bg-white text-black p-0 overflow-hidden ">
        <DialogHeader className="pt-6 px-6 pb-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Welcome to echoLoom!
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-600">
            echoloom is a social media platform for sharing your feelings and thoughts with the world 💫🌎.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                TODO: add image upload
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-600 dark:text-secondary/70">
                      Server name
                    </FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} className="bg-zinc-300/50 border-0 focus-visible:ring-0
                     text-black focus-visible:ring-offset-0" placeholder="Enter your server name"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant={"primary"}>
                Create 1:44:00
              </Button>
              
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}