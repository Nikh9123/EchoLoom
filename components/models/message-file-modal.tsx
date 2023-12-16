"use client";

import qs from "query-string";
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
  FormField,
  FormControl,
  FormItem
} from "@/components/ui/form"

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachment is required"
  }),

})

export const MessageFileModal = () => {

  const { isOpen, onClose, type, data } = useModal();

  const { query, apiUrl } = data;

  const router = useRouter();

  const isModalOpen = isOpen && type === "messageFile";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  });


  const isLoading = form.formState.isSubmitting

  const handleClose = () => {
    form.reset();
    onClose();
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      })

      console.log("url : ", url);
      console.log("values : ", values);

      await axios.post(url, {
        ...values,
        content: values.fileUrl
      });

      handleClose();
      form.reset(); //this will reset the form and the default values
      router.refresh();
      // window.location.reload();
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden ">
        <DialogHeader className="pt-6 px-6 pb-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Add an Attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-600">

            send a file as a message 🗃️📂          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    console.log("fsd", field),
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant={"primary"}>
                Send
              </Button>

            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}