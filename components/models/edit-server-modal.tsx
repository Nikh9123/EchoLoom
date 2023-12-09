"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { UploadButton } from "@uploadthing/react";
import { FileUp } from "lucide-react";
import FileUpload from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "server name is required"
  }),
  imageUrl: z.string().min(1, {
    message: "server image is required"
  }),

})

export const EditServerModel = () => {

  const { isOpen, onClose, onOpen, type, data } = useModal();

  const isModelOpen = isOpen && type === "editServer";

  const {server} =  data ;


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });
  
  useEffect(()=>{
    if(server)
    {
      form.setValue("name", server.name)
      form.setValue("imageUrl", server.imageUrl)
    }
  },[form, server])

  const router = useRouter();
  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/servers/${server?.id}`, values);
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
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    console.log("fsd", field),
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
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
                update
              </Button>

            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}